<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Tree extends Model
{
    use HasFactory;

    protected $fillable = [
        'activity_id',
        'planter_id',
        'latitude',
        'longitude',
        'photo',
        'planted_at',
        'synced_at',
    ];

    protected $casts = [
        'latitude' => 'decimal:7',
        'longitude' => 'decimal:7',
        'planted_at' => 'datetime',
        'synced_at' => 'datetime',
    ];

    public function activity()
    {
        return $this->belongsTo(PlantingActivity::class, 'activity_id');
    }

    public function planter()
    {
        return $this->belongsTo(User::class, 'planter_id');
    }

    public function monitoringRecords()
    {
        return $this->hasMany(MonitoringRecord::class);
    }
}
