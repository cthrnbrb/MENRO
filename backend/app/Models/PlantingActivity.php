<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class PlantingActivity extends Model
{
    use HasFactory;

    protected $table = 'planting_activities';

    protected $fillable = [
        'organization_id',
        'location',
        'expected_tree_count',
        'tree_species',
        'scheduled_date',
    ];

    protected $casts = [
        'scheduled_date' => 'date',
    ];

    public function organization()
    {
        return $this->belongsTo(Organization::class, 'organization_id');
    }

    public function trees()
    {
        return $this->hasMany(Tree::class, 'activity_id');
    }

    public function monitoringAssignments()
    {
        return $this->hasMany(MonitoringAssignment::class, 'activity_id');
    }

    public function attendanceRecords()
    {
        return $this->hasMany(AttendanceRecord::class, 'activity_id');
    }
}
