<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class MonitoringAssignment extends Model
{
    use HasFactory;

    protected $table = 'monitoring_assignments';

    protected $fillable = [
        'activity_id',
        'couple_planting_sched_id',
        'staff_id',
        'assigned_by',
        'assigned_at',
        'target_year',
        'target_quarter',
        'scheduled_date',
        'is_completed',
    ];

    protected $casts = [
        'target_year' => 'integer',
        'target_quarter' => 'integer',
        'is_completed' => 'boolean',
        'scheduled_date' => 'date',
        'assigned_at' => 'datetime',
    ];

    public $incrementing = false;
    protected $keyType = 'string';

    public function activity()
    {
        return $this->belongsTo(PlantingActivity::class, 'activity_id');
    }

    public function couplePlantingSchedule()
    {
        return $this->belongsTo(CouplePlantingActivity::class, 'couple_planting_sched_id');
    }

    public function staff()
    {
        return $this->belongsTo(User::class, 'staff_id');
    }

    public function assignedBy()
    {
        return $this->belongsTo(User::class, 'assigned_by');
    }

    public function monitoringRecords()
    {
        return $this->hasMany(MonitoringRecord::class, 'assignment_id');
    }
}
