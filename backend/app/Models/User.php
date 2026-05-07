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
        'photo',
        'is_deleted',
        'deleted_at',
        'deleted_by',
    ];

    /**
     * The possible roles for a user.
     * Note: 'president' role has been removed and merged into 'organization'.
     */
    public const ROLES = [
        'admin' => 'admin',
        'monitoring staff' => 'monitoring staff',
        'organization' => 'organization',
        'couple' => 'couple',
    ];

    protected $hidden = [
        'password',
    ];

    protected $casts = [
        'password' => 'hashed',
        'is_deleted' => 'boolean',
        'deleted_at' => 'datetime',
        'deleted_by' => 'integer',
    ];

    public function getNameAttribute(): string
    {
        return $this->first_name . ' ' . ($this->middle_name ? $this->middle_name . ' ' : '') . $this->last_name;
    }

    public function userOrganizations()
    {
        return $this->hasMany(UserOrganization::class);
    }

    public function coupleAsUser()
    {
        return $this->hasOne(Couple::class, 'user_id');
    }

    public function coupleAsPartner()
    {
        return $this->hasOne(Couple::class, 'partner_user_id');
    }

    public function treesAsPlanter()
    {
        return $this->hasMany(Tree::class, 'planter_id');
    }

    public function monitoringAssignmentsAsStaff()
    {
        return $this->hasMany(MonitoringAssignment::class, 'staff_id');
    }

    public function deletedBy()
    {
        return $this->belongsTo(User::class, 'deleted_by');
    }

    /**
     * Check if user is an organization president
     */
    public function isOrganizationPresident()
    {
        return $this->role === 'organization' && 
               $this->userOrganizations()->where('org_role', 'president')->exists();
    }

    /**
     * Get organizations where user is president
     */
    public function presidentOrganizations()
    {
        return $this->hasManyThrough(
            Organization::class,
            UserOrganization::class,
            'user_id',
            'id',
            'id',
            'organization_id'
        )->where('user_organizations.org_role', 'president');
    }

    /**
     * Get organizations where user is a member
     */
    public function memberOrganizations()
    {
        return $this->hasManyThrough(
            Organization::class,
            UserOrganization::class,
            'user_id',
            'id',
            'id',
            'organization_id'
        )->where('user_organizations.org_role', 'member');
    }

}
