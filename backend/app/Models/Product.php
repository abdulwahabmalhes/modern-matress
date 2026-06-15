<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'name_en',
        'name_ar',
        'category_id',
        'brand',
        'base_price',
        'sale_price',
        'rating',
        'firmness',
        'warranty_months',
        'short_description_en',
        'short_description_ar',
        'description_en',
        'description_ar',
        'images',
        'badge_label',
        'badge_color',
        'is_featured',
        'is_new_arrival',
        'key_features'
    ];

    protected $casts = [
        'images' => 'array',
        'key_features' => 'array',
        'base_price' => 'float',
        'sale_price' => 'float',
        'rating' => 'float',
        'is_featured' => 'boolean',
        'is_new_arrival' => 'boolean',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function variations(): HasMany
    {
        return $this->hasMany(ProductVariation::class);
    }

    public function attributes(): BelongsToMany
    {
        return $this->belongsToMany(AttributeOption::class, 'product_attributes', 'product_id', 'option_id');
    }
}
