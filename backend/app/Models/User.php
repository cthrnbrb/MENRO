<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Str;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    protected $fillable = [
        'email',
        'password',
        'role',
        'first_name',
        'middle_name',
        'last_name',
        'contact_number',
        'address',
        'organization_id',
        'or_number',
        'photo',
    ];

    protected $hidden = [
        'password',
    ];

    protected $casts = [
        'password' => 'hashed',
        'organization_id' => 'integer',
    ];

    public function getNameAttribute(): string
    {
        return $this->first_name . ' ' . ($this->middle_name ? $this->middle_name . ' ' : '') . $this->last_name;
    }

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    public function couple()
    {
        return $this->hasOne(Couple::class);
    }

    public function treesAsPlanter()
    {
        return $this->hasMany(Tree::class, 'planter_id');
    }

    public function monitoringAssignmentsAsStaff()
    {
        return $this->hasMany(MonitoringAssignment::class, 'staff_id');
    }

    public function monitoringRecordsAsStaff()
    {
        return $this->hasMany(MonitoringRecord::class, 'staff_id');
    }

}
