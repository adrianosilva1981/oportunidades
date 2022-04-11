<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Opportunity extends Model
{
    use HasFactory;

    protected $fillable = [
        'seller_id',
        'buyer_id',
        'product_id',
        'offer',
        'message',
        'approved',
    ];

    public function sellers()
    {
        return $this->hasMany(User::class, 'id', 'seller_id')->where('type', 'seller');
    }

    public function buyers()
    {
        return $this->hasMany(User::class, 'id', 'buyer_id')->where('type', 'buyer');
    }

    public function products()
    {
        return $this->hasMany(Products::class, 'id', 'product_id');
    }
}
