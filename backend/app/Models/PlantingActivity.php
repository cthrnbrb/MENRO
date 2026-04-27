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
        'planter_id',
        'admin_id',
        'location',
        'expected_tree_count',
        'tree_species',
        'scheduled_date',
    ];

    protected $casts = [
        'scheduled_date' => 'date',
    ];

    public function planter()
    {
        return $this->belongsTo(User::class, 'planter_id');
    }

    public function admin()
    {
        return $this->belongsTo(User::class, 'admin_id');
    }

    public function trees()
    {
        return $this->hasMany(Tree::class, 'activity_id');
    }

    public function monitoringAssignments()
    {
        return $this->hasMany(MonitoringAssignment::class, 'activity_id');
    }
}
