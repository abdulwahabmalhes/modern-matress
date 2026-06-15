<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('name_en');
            $table->string('name_ar');
            $table->foreignId('category_id')->constrained('categories')->onDelete('cascade');
            $table->string('brand');
            $table->decimal('base_price', 12, 2);
            $table->decimal('sale_price', 12, 2)->nullable();
            $table->decimal('rating', 3, 2)->default(5.0);
            $table->string('firmness'); // 'soft', 'medium', 'firm'
            $table->integer('warranty_months')->default(120);
            $table->text('short_description_en');
            $table->text('short_description_ar');
            $table->longText('description_en');
            $table->longText('description_ar');
            $table->json('images');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
