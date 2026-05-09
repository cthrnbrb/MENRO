<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CoupleScheduleLog extends Model
{
    use HasFactory;

    protected $table = 'couple_schedule_logs';

    public $timestamps = false;

    protected $fillable = [
        'couple_planting_sched_id',
        'old_date',
        'new_date',
        'old_time',
        'new_time',
        'remarks',
        'changed_by',
        'changed_at',
    ];

    protected $casts = [
        'old_date' => 'date',
        'new_date' => 'date',
        'old_time' => 'datetime',
        'new_time' => 'datetime',
        'changed_at' => 'datetime',
    ];

    public function couplePlantingActivity()
    {
        return $this->belongsTo(CouplePlantingActivity::class, 'couple_planting_sched_id');
    }

    public function changedBy()
    {
        return $this->belongsTo(User::class, 'changed_by');
    }
}
