<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Barangay extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'name',
        'municipality',
        'province',
    ];

    public function zones()
    {
        return $this->hasMany(Zone::class);
    }

    public function plantingActivities()
    {
        return $this->hasMany(PlantingActivity::class);
    }
}
