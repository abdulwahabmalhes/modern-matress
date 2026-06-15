<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductVariation;
use App\Models\Quotation;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Seed Categories
        $categoriesData = [
            [
                'id' => 1,
                'slug' => 'mattresses',
                'name_en' => 'Mattresses',
                'name_ar' => 'المراتب',
                'image_url' => 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=600&auto=format&fit=crop'
            ],
            [
                'id' => 2,
                'slug' => 'beds',
                'name_en' => 'Beds & Frames',
                'name_ar' => 'الأسرة والإطارات',
                'image_url' => 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=600&auto=format&fit=crop'
            ],
            [
                'id' => 3,
                'slug' => 'furniture',
                'name_en' => 'Bedroom Furniture',
                'name_ar' => 'أثاث غرفة النوم',
                'image_url' => 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=600&auto=format&fit=crop'
            ],
            [
                'id' => 4,
                'slug' => 'pillows',
                'name_en' => 'Pillows & Toppers',
                'name_ar' => 'الوسائد واللباد',
                'image_url' => 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=600&auto=format&fit=crop'
            ],
            [
                'id' => 5,
                'slug' => 'accessories',
                'name_en' => 'Accessories',
                'name_ar' => 'إكسسوارات النوم',
                'image_url' => 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=600&auto=format&fit=crop'
            ]
        ];

        foreach ($categoriesData as $cat) {
            Category::updateOrCreate(['id' => $cat['id']], $cat);
        }

        // 2. Seed Products
        $productsData = [
            [
                'slug' => 'dream-cloud-hybrid',
                'name_en' => 'DreamCloud Hybrid Mattress',
                'name_ar' => 'مرتبة دريم كلاود الهجينة',
                'category_id' => 1,
                'brand' => 'Modern Mattresses',
                'base_price' => 2400,
                'sale_price' => 1899,
                'rating' => 4.8,
                'firmness' => 'medium',
                'warranty_months' => 120,
                'short_description_en' => 'Multi-layer hybrid mattress combining cooling gel-memory foam with individually pocketed coils for optimal pressure relief and spinal alignment.',
                'short_description_ar' => 'مرتبة هجينة متعددة الطبقات تجمع بين رغوة الذاكرة الهلامية المبردة والنوابض الجيبية المغلفة بشكل فردي لتخفيف الضغط ومحاذاة العمود الفقري بشكل مثالي.',
                'description_en' => 'The DreamCloud Hybrid Mattress is engineered from the ground up for ultimate luxury and comfort. Featuring 5 layers of premium materials, it starts with an ultra-breathable cashmere blend cover. Below that, a cooling gel-infused memory foam layer cradles your body and disperses heat. The core consists of hundreds of individually wrapped pocket coils that adapt to your body weight and eliminate motion transfer.',
                'description_ar' => 'تم تصميم مرتبة دريم كلاود الهجينة من الصفر لتقديم أقصى درجات الفخامة والراحة. تتميز بـ 5 طبقات من المواد الفاخرة، تبدأ بغطاء من مزيج الكشمير فائق التهوية. أسفل ذلك، هناك طبقة من رغوة الذاكرة الممزوجة بالجل المبرد التي تحتضن جسمك وتشتت الحرارة. يتكون القلب من مئات النوابض الجيبية المغلفة بشكل فردي والتي تتكيف مع وزن جسمك وتمنع انتقال الحركة.',
                'images' => [
                    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=800&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=800&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=800&auto=format&fit=crop',
                ],
                'variations' => [
                    ['size' => 'Single (90x190 cm)', 'price' => 1800, 'sale_price' => 1499, 'stock' => 24],
                    ['size' => 'Double (120x200 cm)', 'price' => 2100, 'sale_price' => 1699, 'stock' => 18],
                    ['size' => 'Queen (160x200 cm)', 'price' => 2400, 'sale_price' => 1899, 'stock' => 35],
                    ['size' => 'King (180x200 cm)', 'price' => 2800, 'sale_price' => 2199, 'stock' => 42],
                    ['size' => 'Super King (200x200 cm)', 'price' => 3200, 'sale_price' => 2499, 'stock' => 15],
                ]
            ],
            [
                'slug' => 'royal-orthopedic',
                'name_en' => 'Royal Orthopedic Mattress',
                'name_ar' => 'مرتبة رويال الطبية والتقويمية',
                'category_id' => 1,
                'brand' => 'Modern Mattresses',
                'base_price' => 3200,
                'sale_price' => 2499,
                'rating' => 4.9,
                'firmness' => 'firm',
                'warranty_months' => 180,
                'short_description_en' => 'Ultra-supportive medical grade foam mattress designed for spinal alignment and alleviating back, neck, and joint pain.',
                'short_description_ar' => 'مرتبة رغوية طبية فائقة الدعم مصممة خصيصاً لمحاذاة العمود الفقري وتخفيف آلام الظهر والرقبة والمفاصل.',
                'description_en' => 'The Royal Orthopedic Mattress is recommended by physical therapists across the GCC. It features a triple-zone support core that matches the ergonomic zones of the human body.',
                'description_ar' => 'يوصي المعالجون الفيزيائيون في الخليج بمرتبة رويال الطبية. تتميز بقلب دعم ثلاثي المناطق يطابق المناطق التشريحية لجسم الإنسان.',
                'images' => [
                    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=800&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=800&auto=format&fit=crop',
                ],
                'variations' => [
                    ['size' => 'Double (120x200 cm)', 'price' => 2600, 'sale_price' => 2099, 'stock' => 12],
                    ['size' => 'Queen (160x200 cm)', 'price' => 3200, 'sale_price' => 2499, 'stock' => 20],
                    ['size' => 'King (180x200 cm)', 'price' => 3700, 'sale_price' => 2899, 'stock' => 25],
                    ['size' => 'Super King (200x200 cm)', 'price' => 4200, 'sale_price' => 3299, 'stock' => 10],
                ]
            ],
            [
                'slug' => 'imperial-latex-luxury',
                'name_en' => 'Imperial Latex Luxury Mattress',
                'name_ar' => 'مرتبة إمبيريال لاتكس الفاخرة',
                'category_id' => 1,
                'brand' => 'Modern Mattresses',
                'base_price' => 4500,
                'sale_price' => 3899,
                'rating' => 4.7,
                'firmness' => 'soft',
                'warranty_months' => 120,
                'short_description_en' => 'Eco-friendly 100% natural latex mattress offering an incredibly plush feel, instant bounce-back, and natural cooling properties.',
                'short_description_ar' => 'مرتبة صديقة للبيئة من اللاتكس الطبيعي 100٪ توفر ملمساً وثيراً ومخملياً، وارتداداً فورياً، وخصائص تبريد طبيعية.',
                'description_en' => 'Experience organic luxury. The Imperial Latex Mattress is crafted using natural Dunlop latex harvested from organic rubber tree plantations.',
                'description_ar' => 'اختبر الفخامة العضوية. تم تصنيع مرتبة إمبيريال لاتفكس باستخدام لاتكس دنلوب الطبيعي 100٪ المحصود من مزارع المطاط العضوية.',
                'images' => [
                    'https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=800&auto=format&fit=crop',
                ],
                'variations' => [
                    ['size' => 'Queen (160x200 cm)', 'price' => 4500, 'sale_price' => 3899, 'stock' => 8],
                    ['size' => 'King (180x200 cm)', 'price' => 5100, 'sale_price' => 4399, 'stock' => 12],
                ]
            ],
            [
                'slug' => 'majestic-velvet-bed-frame',
                'name_en' => 'Majestic Velvet Bed Frame',
                'name_ar' => 'إطار سرير ماجستيك المخملي الفاخر',
                'category_id' => 2,
                'brand' => 'Modern Mattresses',
                'base_price' => 2800,
                'sale_price' => 2200,
                'rating' => 4.9,
                'firmness' => 'medium',
                'warranty_months' => 60,
                'short_description_en' => 'Statement upholstered bed frame wrapped in premium velvet fabric, featuring a tall chesterfield headboard.',
                'short_description_ar' => 'إطار سرير مبطن مغطى بمخمل فاخر مقاوم للبقع، ويتميز بلوح رأسي تشيسترفيلد.',
                'description_en' => 'The Majestic Bed Frame creates an instant center of attention. Durable and beautiful.',
                'description_ar' => 'يخلق إطار سرير ماجستيك انتباهاً فورياً. متين وعملي بقدر ما هو جميل.',
                'images' => [
                    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=800&auto=format&fit=crop',
                ],
                'variations' => [
                    ['size' => 'Queen (160x200 cm)', 'price' => 2800, 'sale_price' => 2200, 'stock' => 15],
                    ['size' => 'King (180x200 cm)', 'price' => 3200, 'sale_price' => 2500, 'stock' => 18],
                ]
            ]
        ];

        foreach ($productsData as $prodData) {
            $vars = $prodData['variations'];
            unset($prodData['variations']);

            $product = Product::updateOrCreate(['slug' => $prodData['slug']], $prodData);

            foreach ($vars as $v) {
                ProductVariation::create(array_merge($v, ['product_id' => $product->id]));
            }
        }

        // 3. Seed B2B Leads (Quotations)
        $leadsData = [
            [
                'quote_number' => 'QT-9812',
                'name' => 'Mohammed Al Ketbi',
                'email' => 'm.ketbi@emaar.ae',
                'phone' => '+971509988776',
                'company' => 'Emaar Hospitality Group',
                'city' => 'dubai',
                'product_name' => 'DreamCloud Hybrid Mattress',
                'quantity' => '120',
                'notes' => 'Outfitting 120 guest rooms in Downtown Address Hotel. High comfort requirements.',
                'status' => 'new',
                'amount' => 227880,
            ],
            [
                'quote_number' => 'QT-9810',
                'name' => 'James Thornton',
                'email' => 'james.t@rotana.com',
                'phone' => '+971565544332',
                'company' => 'Rotana Hotels Abu Dhabi',
                'city' => 'abu-dhabi',
                'product_name' => 'Royal Orthopedic Mattress',
                'quantity' => '30',
                'notes' => 'Premium suite upgrades. Need delivery schedule coordination.',
                'status' => 'quoted',
                'amount' => 74970,
            ],
            [
                'quote_number' => 'QT-9805',
                'name' => 'Sarah Connor',
                'email' => 'sarah.c@damac.com',
                'phone' => '+971521122334',
                'company' => 'Damac Properties',
                'city' => 'dubai',
                'product_name' => 'Floating Wooden Platform Bed',
                'quantity' => '10',
                'notes' => 'Show home staging bedroom furniture sets.',
                'status' => 'approved',
                'amount' => 29000,
            ]
        ];

        foreach ($leadsData as $l) {
            Quotation::updateOrCreate(['quote_number' => $l['quote_number']], $l);
        }
    }
}
