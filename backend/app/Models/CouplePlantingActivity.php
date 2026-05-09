<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CouplePlantingActivity extends Model
{
    use HasFactory;

    protected $table = 'couple_planting_activities';

    protected $fillable = [
        'couple_id',
        'barangay_id',
        'chosen_date',
        'chosen_time',
        'status',
        'is_deleted',
        'deleted_at',
        'deleted_by',
    ];

    protected $casts = [
        'chosen_date' => 'date',
        'chosen_time' => 'datetime',
        'is_deleted' => 'boolean',
        'deleted_at' => 'datetime',
    ];

    public function couple()
    {
        return $this->belongsTo(Couple::class, 'couple_id');
    }

    public function barangay()
    {
        return $this->belongsTo(Barangay::class, 'barangay_id');
    }

    public function trees()
    {
        return $this->hasMany(Tree::class, 'couple_planting_sched_id');
    }

    public function monitoringAssignments()
    {
        return $this->hasMany(MonitoringAssignment::class, 'couple_planting_sched_id');
    }

    public function scheduleLogs()
    {
        return $this->hasMany(CoupleScheduleLog::class, 'couple_planting_sched_id');
    }

    public function locationLogs()
    {
        return $this->hasMany(CoupleLocationLog::class, 'couple_planting_sched_id');
    }

    public function deletedBy()
    {
        return $this->belongsTo(User::class, 'deleted_by');
    }
}
