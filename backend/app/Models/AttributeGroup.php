<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AttributeGroup extends Model
{
    use HasFactory;

    protected $fillable = ['name_en', 'name_ar', 'slug', 'type'];

    public function options(): HasMany
    {
        return $this->hasMany(AttributeOption::class, 'group_id');
    }
}
