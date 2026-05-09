<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'message',
        'type',
        'role_target',
        'is_read',
        'related_id',
    ];

    /**
     * The possible notification types.
     */
    public const TYPES = [
        'activity_reminder' => 'activity_reminder',
        'activity_rescheduled' => 'activity_rescheduled',
        'activity_cancelled' => 'activity_cancelled',
        'monitoring_schedule' => 'monitoring_schedule',
        'monitoring_reassigned' => 'monitoring_reassigned',
        'tree_update_reminder' => 'tree_update_reminder',
        'certificate_ready' => 'certificate_ready',
        'join_request' => 'join_request',
        'join_accepted' => 'join_accepted',
        'join_rejected' => 'join_rejected',
    ];

    /**
     * The possible role targets.
     * Note: 'president' has been removed - use 'organization' for both president and members.
     */
    public const ROLE_TARGETS = [
        'admin' => 'admin',
        'monitoring staff' => 'monitoring staff',
        'organization' => 'organization',
        'couple' => 'couple',
    ];

    protected $casts = [
        'is_read' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
