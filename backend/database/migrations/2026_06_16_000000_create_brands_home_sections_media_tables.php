<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('brands', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('name');
            $table->string('logo_url')->nullable();
            $table->timestamps();
        });

        Schema::create('home_sections', function (Blueprint $table) {
            $table->id();
            $table->string('section_id')->unique(); // e.g. 'hero', 'categories', etc.
            $table->string('type');
            $table->string('name_en');
            $table->string('name_ar');
            $table->boolean('visible')->default(true);
            $table->integer('order')->default(0);
            $table->json('content')->nullable(); // imageUrl, link, title, filterType, filterId
            $table->timestamps();
        });

        Schema::create('media', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('url');
            $table->string('type')->default('image');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('brands');
        Schema::dropIfExists('home_sections');
        Schema::dropIfExists('media');
    }
};
