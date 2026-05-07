<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Organization extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'org_name',
        'president_id',
        'organization_code',
    ];

    /**
     * Get the president of the organization.
     */
    public function president()
    {
        return $this->belongsTo(User::class, 'president_id');
    }

    /**
     * Get the president's user organization record
     */
    public function presidentUserOrganization()
    {
        return $this->hasOne(UserOrganization::class, 'organization_id')
                    ->where('org_role', 'president');
    }

    /**
     * Get members of the organization (excluding president)
     */
    public function members()
    {
        return $this->hasManyThrough(
            User::class,
            UserOrganization::class,
            'organization_id',
            'id',
            'id',
            'user_id'
        )->where('user_organizations.org_role', 'member')
         ->where('user_organizations.status', 'accepted');
    }

    /**
     * Get pending join requests
     */
    public function pendingJoinRequests()
    {
        return $this->hasManyThrough(
            User::class,
            UserOrganization::class,
            'organization_id',
            'id',
            'id',
            'user_id'
        )->where('user_organizations.status', 'pending');
    }

    public function userOrganizations()
    {
        return $this->hasMany(UserOrganization::class);
    }

    public function users()
    {
        return $this->hasManyThrough(User::class, UserOrganization::class, 'organization_id', 'id', 'id', 'user_id');
    }

    public function plantingActivities()
    {
        return $this->hasMany(PlantingActivity::class, 'organization_id');
    }

    public function certificates()
    {
        return $this->hasMany(Certificate::class, 'organization_id');
    }
}
