<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ApiController;

Route::prefix('v1')->group(function () {
    // Categories
    Route::get('/categories', [ApiController::class, 'getCategories']);
    Route::post('/categories', [ApiController::class, 'storeCategory']);
    Route::put('/categories/{id}', [ApiController::class, 'updateCategory']);
    Route::delete('/categories/{id}', [ApiController::class, 'deleteCategory']);

    // Brands
    Route::get('/brands', [ApiController::class, 'getBrands']);
    Route::post('/brands', [ApiController::class, 'storeBrand']);
    Route::put('/brands/{id}', [ApiController::class, 'updateBrand']);
    Route::delete('/brands/{id}', [ApiController::class, 'deleteBrand']);

    // Products
    Route::get('/products', [ApiController::class, 'getProducts']);
    Route::post('/products', [ApiController::class, 'storeProduct']);
    Route::put('/products/{id}', [ApiController::class, 'updateProduct']);
    Route::delete('/products/{id}', [ApiController::class, 'deleteProduct']);
    Route::get('/products/{slug}', [ApiController::class, 'getProduct']);

    // Filters
    Route::get('/filters', [ApiController::class, 'getFilters']);
    Route::post('/filters/groups', [ApiController::class, 'storeFilterGroup']);
    Route::post('/filters/options', [ApiController::class, 'storeFilterOption']);

    // Quotations (B2B leads)
    Route::get('/quotations', [ApiController::class, 'getQuotations']);
    Route::post('/quotations', [ApiController::class, 'storeQuotation']);
    Route::put('/quotations/{id}', [ApiController::class, 'updateQuotationStatus']);
    Route::delete('/quotations/{id}', [ApiController::class, 'deleteQuotation']);

    // Authentication
    Route::post('/register', [ApiController::class, 'registerCustomer']);
    Route::post('/login', [ApiController::class, 'loginCustomer']);

    // Orders (Invoices)
    Route::get('/orders', [ApiController::class, 'getOrders']);
    Route::post('/orders', [ApiController::class, 'storeOrder']);
    Route::get('/orders/customer/{email}', [ApiController::class, 'getCustomerOrders']);
    Route::put('/orders/{id}/status', [ApiController::class, 'updateOrderStatus']);

    // Customers
    Route::get('/customers', [ApiController::class, 'getCustomers']);

    // Home Sections Layout
    Route::get('/home-layout', [ApiController::class, 'getHomeLayout']);
    Route::post('/home-layout', [ApiController::class, 'saveHomeLayout']);

    // Media Library
    Route::get('/media', [ApiController::class, 'getMedia']);
    Route::post('/media', [ApiController::class, 'storeMedia']);
    Route::delete('/media/{id}', [ApiController::class, 'deleteMedia']);
});
