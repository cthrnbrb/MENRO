<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Certificate extends Model
{
    use HasFactory;

    protected $fillable = [
        'couple_id',
        'organization_id',
        'issued_at',
    ];

    protected $casts = [
        'issued_at' => 'datetime',
        'created_at' => 'datetime',
    ];

    public function couple()
    {
        return $this->belongsTo(Couple::class);
    }

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }
}
