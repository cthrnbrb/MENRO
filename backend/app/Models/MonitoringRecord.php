<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class MonitoringRecord extends Model
{
    use HasFactory;

    protected $table = 'monitoring_records';

    protected $fillable = [
        'tree_id',
        'staff_id',
        'assignment_id',
        'status',
        'photo',
        'checked_at',
        'synced_at',
    ];

    protected $casts = [
        'status' => 'string',
        'checked_at' => 'datetime',
        'synced_at' => 'datetime',
    ];

    public function tree()
    {
        return $this->belongsTo(Tree::class);
    }

    public function staff()
    {
        return $this->belongsTo(User::class, 'staff_id');
    }

    public function assignment()
    {
        return $this->belongsTo(MonitoringAssignment::class, 'assignment_id');
    }
}
