<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserOrganization extends Model
{
    use HasFactory;

    protected $table = 'user_organizations';

    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'organization_id',
        'org_role',
        'status',
        'requested_at',
        'responded_at',
        'responded_by',
        'joined_at',
        'removed_at',
        'removed_by',
        'removal_remarks',
    ];

    /**
     * The possible organization roles.
     */
    public const ORG_ROLES = [
        'president' => 'president',
        'member' => 'member',
    ];

    /**
     * The possible statuses.
     */
    public const STATUSES = [
        'pending' => 'pending',
        'accepted' => 'accepted',
        'rejected' => 'rejected',
        'removed' => 'removed',
    ];

    protected $casts = [
        'requested_at' => 'datetime',
        'responded_at' => 'datetime',
        'joined_at' => 'datetime',
        'removed_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    public function respondedBy()
    {
        return $this->belongsTo(User::class, 'responded_by');
    }

    public function removedBy()
    {
        return $this->belongsTo(User::class, 'removed_by');
    }

    /**
     * Check if this user is the president of the organization
     */
    public function isPresident()
    {
        return $this->org_role === 'president';
    }

    /**
     * Check if this user is a member of the organization
     */
    public function isMember()
    {
        return $this->org_role === 'member';
    }

    /**
     * Check if the membership is active (accepted)
     */
    public function isActive()
    {
        return $this->status === 'accepted';
    }

    /**
     * Scope to get only presidents
     */
    public function scopePresidents($query)
    {
        return $query->where('org_role', 'president');
    }

    /**
     * Scope to get only members
     */
    public function scopeMembers($query)
    {
        return $query->where('org_role', 'member');
    }

    /**
     * Scope to get only active members
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'accepted');
    }

    /**
     * Scope to get only pending requests
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }
}
