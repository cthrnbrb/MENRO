<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CoupleLocationLog extends Model
{
    use HasFactory;

    protected $table = 'couple_location_logs';

    public $timestamps = false;

    protected $fillable = [
        'couple_planting_sched_id',
        'old_barangay_id',
        'new_barangay_id',
        'remarks',
        'changed_by',
        'changed_at',
    ];

    protected $casts = [
        'changed_at' => 'datetime',
    ];

    public function couplePlantingActivity()
    {
        return $this->belongsTo(CouplePlantingActivity::class, 'couple_planting_sched_id');
    }

    public function oldBarangay()
    {
        return $this->belongsTo(Barangay::class, 'old_barangay_id');
    }

    public function newBarangay()
    {
        return $this->belongsTo(Barangay::class, 'new_barangay_id');
    }

    public function changedBy()
    {
        return $this->belongsTo(User::class, 'changed_by');
    }
}
