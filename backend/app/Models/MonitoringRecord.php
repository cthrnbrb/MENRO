<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class MonitoringRecord extends Model
{
    use HasFactory;

    protected $table = 'monitoring_records';

    public $timestamps = false;

    protected $fillable = [
        'tree_id',
        'assignment_id',
        'couple_user_id',
        'photo',
        'status',
        'dead_lat',
        'dead_lng',
        'checked_at',
        'synced_at',
        'approval_status',
        'approved_by',
        'approved_at',
        'approval_remarks',
    ];

    protected $casts = [
        'status' => 'string',
        'dead_lat' => 'decimal:7',
        'dead_lng' => 'decimal:7',
        'checked_at' => 'datetime',
        'synced_at' => 'datetime',
        'approval_status' => 'string',
        'approved_at' => 'datetime',
    ];

    public function tree()
    {
        return $this->belongsTo(Tree::class);
    }

    public function assignment()
    {
        return $this->belongsTo(MonitoringAssignment::class, 'assignment_id');
    }

    public function coupleUser()
    {
        return $this->belongsTo(User::class, 'couple_user_id');
    }

    public function approvedBy()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}
