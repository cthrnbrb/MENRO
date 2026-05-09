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

    public function couplePlantingActivities()
    {
        return $this->hasMany(CouplePlantingActivity::class);
    }

    public function coupleLocationLogsAsOld()
    {
        return $this->hasMany(CoupleLocationLog::class, 'old_barangay_id');
    }

    public function coupleLocationLogsAsNew()
    {
        return $this->hasMany(CoupleLocationLog::class, 'new_barangay_id');
    }
}
