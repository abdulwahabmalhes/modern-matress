<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductVariation;
use App\Models\AttributeGroup;
use App\Models\AttributeOption;
use App\Models\Quotation;
use App\Models\User;
use App\Models\Order;
use App\Models\Brand;
use App\Models\HomeSection;
use App\Models\Media;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class ApiController extends Controller
{
    // --- CATEGORIES ---
    public function getCategories()
    {
        return response()->json(Category::all());
    }

    public function storeCategory(Request $request)
    {
        $validated = $request->validate([
            'name_en' => 'required|string',
            'name_ar' => 'required|string',
            'image_url' => 'nullable|string',
            'parent_id' => 'nullable|integer',
            'icon' => 'nullable|string',
        ]);

        $slug = Str::slug($validated['name_en']);
        
        $category = Category::create([
            'slug' => $slug,
            'name_en' => $validated['name_en'],
            'name_ar' => $validated['name_ar'],
            'image_url' => $validated['image_url'] ?? 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=600&auto=format&fit=crop',
            'parent_id' => $validated['parent_id'] ?? null,
            'icon' => $validated['icon'] ?? 'Box',
        ]);

        return response()->json($category, 201);
    }

    public function updateCategory(Request $request, $id)
    {
        $category = Category::find($id);
        if (!$category) return response()->json(['message' => 'Not found'], 404);

        $validated = $request->validate([
            'name_en' => 'sometimes|string',
            'name_ar' => 'sometimes|string',
            'image_url' => 'nullable|string',
            'icon' => 'nullable|string',
        ]);

        if (isset($validated['name_en'])) {
            $validated['slug'] = Str::slug($validated['name_en']);
        }

        $category->update($validated);
        return response()->json($category);
    }

    public function deleteCategory($id)
    {
        $category = Category::find($id);
        if (!$category) return response()->json(['message' => 'Not found'], 404);
        $category->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }

    // --- BRANDS ---
    public function getBrands()
    {
        return response()->json(Brand::all());
    }

    public function storeBrand(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'logo_url' => 'nullable|string',
        ]);

        $slug = Str::slug($validated['name']);
        $brand = Brand::create([
            'slug' => $slug,
            'name' => $validated['name'],
            'logo_url' => $validated['logo_url'] ?? null,
        ]);

        return response()->json($brand, 201);
    }

    public function updateBrand(Request $request, $id)
    {
        $brand = Brand::find($id);
        if (!$brand) return response()->json(['message' => 'Not found'], 404);

        $validated = $request->validate([
            'name' => 'sometimes|string',
            'logo_url' => 'nullable|string',
        ]);

        if (isset($validated['name'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $brand->update($validated);
        return response()->json($brand);
    }

    public function deleteBrand($id)
    {
        $brand = Brand::find($id);
        if (!$brand) return response()->json(['message' => 'Not found'], 404);
        $brand->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }

    // --- HOME LAYOUT ---
    public function getHomeLayout()
    {
        $sections = HomeSection::orderBy('order')->get();
        return response()->json($sections);
    }

    public function saveHomeLayout(Request $request)
    {
        $validated = $request->validate([
            'sections' => 'required|array',
        ]);

        foreach ($validated['sections'] as $sec) {
            HomeSection::updateOrCreate(
                ['section_id' => $sec['id']],
                [
                    'type' => $sec['type'],
                    'name_en' => $sec['name']['en'],
                    'name_ar' => $sec['name']['ar'],
                    'visible' => $sec['visible'],
                    'order' => $sec['order'],
                    'content' => $sec['content'] ?? null,
                ]
            );
        }

        return response()->json(['message' => 'Layout saved']);
    }

    // --- MEDIA LIBRARY ---
    public function getMedia()
    {
        return response()->json(Media::orderBy('created_at', 'desc')->get());
    }

    public function storeMedia(Request $request)
    {
        $request->validate([
            'image' => 'required|file|image|max:10240',
        ]);

        $file = $request->file('image');
        $filename = time() . '_' . $file->getClientOriginalName();
        $path = $file->storeAs('media', $filename, 'public');
        $url = Storage::disk('public')->url($path);

        $media = Media::create([
            'name' => $file->getClientOriginalName(),
            'url' => $url,
            'type' => 'image',
        ]);

        return response()->json($media, 201);
    }

    public function deleteMedia($id)
    {
        $media = Media::find($id);
        if (!$media) return response()->json(['message' => 'Not found'], 404);

        // Extract path from url and delete file
        $relativePath = str_replace('/storage/', '', parse_url($media->url, PHP_URL_PATH));
        Storage::disk('public')->delete($relativePath);

        $media->delete();
        return response()->json(['message' => 'Deleted']);
    }

    // --- PRODUCTS ---
    public function getProducts(Request $request)
    {
        $query = Product::with(['category', 'variations', 'attributes.group']);

        if ($request->has('category') && $request->category != 'all') {
            $query->whereHas('category', function($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        if ($request->has('brand') && $request->brand != 'all') {
            $query->where('brand', 'like', '%' . $request->brand . '%');
        }

        if ($request->has('firmness') && $request->firmness != 'all') {
            $query->where('firmness', $request->firmness);
        }

        if ($request->has('search')) {
            $searchTerm = '%' . $request->search . '%';
            $query->where(function($q) use ($searchTerm) {
                $q->where('name_en', 'like', $searchTerm)
                  ->orWhere('name_ar', 'like', $searchTerm)
                  ->orWhere('brand', 'like', $searchTerm);
            });
        }

        $products = $query->get();

        // Custom price range filtering
        if ($request->has('priceRange') && $request->priceRange != 'all') {
            $products = $products->filter(function($prod) use ($request) {
                $price = $prod->sale_price ?? $prod->base_price;
                if ($request->priceRange == 'under-500') return $price < 500;
                if ($request->priceRange == '500-1500') return $price >= 500 && $price <= 1500;
                if ($request->priceRange == '1500-3000') return $price >= 1500 && $price <= 3000;
                if ($request->priceRange == 'over-3000') return $price > 3000;
                return true;
            })->values();
        }

        // Custom attribute options filter
        if ($request->has('attributes')) {
            $optionIds = explode(',', $request->attributes);
            $products = $products->filter(function($prod) use ($optionIds) {
                $prodOptionIds = $prod->attributes->pluck('id')->toArray();
                return count(array_intersect($optionIds, $prodOptionIds)) > 0;
            })->values();
        }

        return response()->json($products);
    }

    public function getProduct($slug)
    {
        $product = Product::with(['category', 'variations', 'attributes.group'])->where('slug', $slug)->first();
        
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        return response()->json($product);
    }

    public function storeProduct(Request $request)
    {
        $validated = $request->validate([
            'name_en' => 'required|string',
            'name_ar' => 'required|string',
            'category_id' => 'required|integer',
            'brand' => 'required|string',
            'base_price' => 'required|numeric',
            'sale_price' => 'nullable|numeric',
            'firmness' => 'required|string',
            'warranty_months' => 'required|integer',
            'short_description_en' => 'required|string',
            'short_description_ar' => 'required|string',
            'description_en' => 'required|string',
            'description_ar' => 'required|string',
            'images' => 'required|array',
            'variations' => 'required|array',
            'attributes' => 'nullable|array',
        ]);

        $slug = Str::slug($validated['name_en']);

        $product = Product::create([
            'slug' => $slug,
            'name_en' => $validated['name_en'],
            'name_ar' => $validated['name_ar'],
            'category_id' => $validated['category_id'],
            'brand' => $validated['brand'],
            'base_price' => $validated['base_price'],
            'sale_price' => $validated['sale_price'],
            'firmness' => $validated['firmness'],
            'warranty_months' => $validated['warranty_months'],
            'short_description_en' => $validated['short_description_en'],
            'short_description_ar' => $validated['short_description_ar'],
            'description_en' => $validated['description_en'],
            'description_ar' => $validated['description_ar'],
            'images' => $validated['images'],
        ]);

        foreach ($validated['variations'] as $v) {
            ProductVariation::create([
                'product_id' => $product->id,
                'size' => $v['size'],
                'price' => $v['price'],
                'sale_price' => $v['sale_price'] ?? null,
                'stock' => $v['stock'] ?? 10,
            ]);
        }

        if (!empty($validated['attributes'])) {
            $product->attributes()->attach($validated['attributes']);
        }

        return response()->json(Product::with(['category', 'variations', 'attributes.group'])->find($product->id), 201);
    }

    public function updateProduct(Request $request, $id)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        $validated = $request->validate([
            'name_en' => 'sometimes|string',
            'name_ar' => 'sometimes|string',
            'category_id' => 'sometimes|integer',
            'brand' => 'sometimes|string',
            'base_price' => 'sometimes|numeric',
            'sale_price' => 'nullable|numeric',
            'firmness' => 'sometimes|string',
            'warranty_months' => 'sometimes|integer',
            'short_description_en' => 'sometimes|string',
            'short_description_ar' => 'sometimes|string',
            'description_en' => 'sometimes|string',
            'description_ar' => 'sometimes|string',
            'images' => 'sometimes|array',
            'variations' => 'sometimes|array',
            'attributes' => 'nullable|array',
            'is_best_seller' => 'sometimes|boolean',
            'is_new' => 'sometimes|boolean',
        ]);

        if (isset($validated['name_en'])) {
            $product->slug = Str::slug($validated['name_en']);
        }

        $product->update($validated);

        if (isset($validated['variations'])) {
            $product->variations()->delete();
            foreach ($validated['variations'] as $v) {
                ProductVariation::create([
                    'product_id' => $product->id,
                    'size' => $v['size'],
                    'price' => $v['price'],
                    'sale_price' => $v['sale_price'] ?? null,
                    'stock' => $v['stock'] ?? 10,
                ]);
            }
        }

        if (isset($validated['attributes'])) {
            $product->attributes()->sync($validated['attributes']);
        }

        return response()->json(Product::with(['category', 'variations', 'attributes.group'])->find($product->id));
    }

    public function deleteProduct($id)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        $product->variations()->delete();
        $product->attributes()->detach();
        $product->delete();

        return response()->json(['message' => 'Deleted successfully']);
    }

    // --- FILTER GROUPS & OPTIONS ---
    public function getFilters()
    {
        return response()->json(AttributeGroup::with('options')->get());
    }

    public function storeFilterGroup(Request $request)
    {
        $validated = $request->validate([
            'name_en' => 'required|string',
            'name_ar' => 'required|string',
        ]);

        $group = AttributeGroup::create([
            'name_en' => $validated['name_en'],
            'name_ar' => $validated['name_ar'],
            'slug' => Str::slug($validated['name_en']),
            'type' => 'select',
        ]);

        return response()->json($group, 201);
    }

    public function storeFilterOption(Request $request)
    {
        $validated = $request->validate([
            'group_id' => 'required|integer',
            'value_en' => 'required|string',
            'value_ar' => 'required|string',
        ]);

        $option = AttributeOption::create($validated);
        return response()->json($option, 201);
    }

    // --- B2B QUOTATIONS ---
    public function getQuotations()
    {
        return response()->json(Quotation::orderBy('created_at', 'desc')->get());
    }

    public function storeQuotation(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email',
            'phone' => 'required|string',
            'company' => 'nullable|string',
            'city' => 'required|string',
            'product_name' => 'nullable|string',
            'quantity' => 'required|string',
            'notes' => 'nullable|string',
            'amount' => 'nullable|numeric',
        ]);

        $quote = Quotation::create([
            'quote_number' => 'QT-2026-' . rand(10000, 99999),
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'company' => $validated['company'],
            'city' => $validated['city'],
            'product_name' => $validated['product_name'] ?? 'Custom Order',
            'quantity' => $validated['quantity'],
            'notes' => $validated['notes'],
            'status' => 'new',
            'amount' => $validated['amount'] ?? 5000,
        ]);

        return response()->json($quote, 201);
    }

    public function updateQuotationStatus(Request $request, $id)
    {
        $validated = $request->validate(['status' => 'required|string']);
        $quote = Quotation::find($id);
        if (!$quote) return response()->json(['message' => 'Not found'], 404);
        $quote->update(['status' => $validated['status']]);
        return response()->json($quote);
    }

    public function deleteQuotation($id)
    {
        $quote = Quotation::find($id);
        if (!$quote) return response()->json(['message' => 'Not found'], 404);
        $quote->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }

    // --- CUSTOMER AUTHENTICATION ---
    public function registerCustomer(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'phone' => 'nullable|string',
            'city' => 'nullable|string',
            'address' => 'nullable|string',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'phone' => $validated['phone'] ?? null,
            'city' => $validated['city'] ?? null,
            'address' => $validated['address'] ?? null,
        ]);

        return response()->json($user, 201);
    }

    public function loginCustomer(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            return response()->json(['message' => 'Invalid email or password'], 401);
        }

        return response()->json($user);
    }

    // --- ORDERS (INVOICES) ---
    public function getOrders()
    {
        return response()->json(Order::orderBy('created_at', 'desc')->get());
    }

    public function storeOrder(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'nullable|integer',
            'customer_name' => 'required|string',
            'customer_email' => 'required|email',
            'customer_phone' => 'required|string',
            'shipping_address' => 'required|string',
            'city' => 'required|string',
            'payment_method' => 'required|string',
            'payment_status' => 'required|string',
            'total_amount' => 'required|numeric',
            'items' => 'required|array',
        ]);

        $order = Order::create([
            'user_id' => $validated['user_id'] ?? null,
            'order_number' => 'INV-2026-' . rand(10000, 99999),
            'customer_name' => $validated['customer_name'],
            'customer_email' => $validated['customer_email'],
            'customer_phone' => $validated['customer_phone'],
            'shipping_address' => $validated['shipping_address'],
            'city' => $validated['city'],
            'payment_method' => $validated['payment_method'],
            'payment_status' => $validated['payment_status'],
            'total_amount' => $validated['total_amount'],
            'status' => 'pending',
            'items' => $validated['items'],
        ]);

        return response()->json($order, 201);
    }

    public function getCustomerOrders($email)
    {
        $orders = Order::where('customer_email', $email)->orderBy('created_at', 'desc')->get();
        return response()->json($orders);
    }

    public function updateOrderStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'nullable|string',
            'payment_status' => 'nullable|string',
        ]);

        $order = Order::find($id);
        if (!$order) return response()->json(['message' => 'Order not found'], 404);

        if (isset($validated['status'])) $order->status = $validated['status'];
        if (isset($validated['payment_status'])) $order->payment_status = $validated['payment_status'];
        $order->save();

        return response()->json($order);
    }

    // --- CUSTOMERS ---
    public function getCustomers()
    {
        $customers = User::all()->map(function($user) {
            $user->orders_count = Order::where('customer_email', $user->email)->count();
            return $user;
        });

        return response()->json($customers);
    }
}
