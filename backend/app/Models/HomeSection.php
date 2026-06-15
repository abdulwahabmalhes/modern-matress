<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HomeSection extends Model
{
    protected $fillable = ['section_id', 'type', 'name_en', 'name_ar', 'visible', 'order', 'content'];

    protected $casts = [
        'content' => 'array',
        'visible' => 'boolean',
    ];
}
