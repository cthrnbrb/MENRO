<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Couple extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $table = 'couples';

    protected $fillable = [
        'user_id',
        'partner_user_id',
        'or_number',
        'created_at',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function partner()
    {
        return $this->belongsTo(User::class, 'partner_user_id');
    }

    public function certificates()
    {
        return $this->hasMany(Certificate::class, 'couple_id');
    }
}
