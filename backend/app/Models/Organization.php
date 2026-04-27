<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Organization extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'org_name',
        'president_first_name',
        'president_middle_name',
        'president_last_name',
        'organization_code',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
