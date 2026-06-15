<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Quotation extends Model
{
    use HasFactory;

    protected $fillable = [
        'quote_number',
        'name',
        'email',
        'phone',
        'company',
        'city',
        'product_name',
        'quantity',
        'notes',
        'status',
        'amount'
    ];

    protected $casts = [
        'amount' => 'float',
    ];
}
