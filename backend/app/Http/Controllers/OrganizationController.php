<?php

namespace App\Http\Controllers;

use App\Models\Organization;
use App\Models\Couple;
use App\Models\PlantingActivity;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class OrganizationController extends Controller
{
    /**
     * PHASE 1: Organization Interview & Setup
     * Admin inputs organization details and planting schedule
     */

    /**
     * List all organizations
     */
    public function index()
    {
        $organizations = Organization::with(['plantingActivities', 'president'])
            ->orderBy('id', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $organizations
        ]);
    }

    /**
     * Show single organization with details
     */
    public function show($id)
    {
        $organization = Organization::with([
            'plantingActivities',
            'plantingActivities.trees',
            'users'
        ])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $organization
        ]);
    }

    /**
     * Create new organization
     * Step 1-3 of Phase 1 - Admin only creates organization first
     * Planters and planting activities are added separately later
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'org_name' => 'required|string|max:255',
            'president_id' => 'required|exists:users,id',
            'organization_code' => 'required|string|max:6|unique:organizations',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Verify president user has role = 'organization'
            $president = User::findOrFail($request->president_id);
            if ($president->role !== 'organization') {
                return response()->json([
                    'success' => false,
                    'message' => 'President must have role set to "organization"'
                ], 422);
            }

            // Create organization with president
            $organization = Organization::create([
                'org_name' => $request->org_name,
                'president_id' => $request->president_id,
                'organization_code' => $request->organization_code,
            ]);

            // Automatically create president's user organization record
            \App\Models\UserOrganization::create([
                'user_id' => $request->president_id,
                'organization_id' => $organization->id,
                'org_role' => 'president',
                'status' => 'accepted',
                'joined_at' => now(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Organization created successfully',
                'data' => $organization
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create organization: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update organization details
     */
    public function update(Request $request, $id)
    {
        $organization = Organization::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'org_name' => 'sometimes|required|string|max:255',
            'president_id' => 'nullable|exists:users,id',
            'organization_code' => 'sometimes|required|string|max:6|unique:organizations,organization_code,' . $id,
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $organization->update($request->only([
            'org_name',
            'president_id',
            'organization_code'
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Organization updated successfully',
            'data' => $organization
        ]);
    }

    /**
     * Delete organization
     */
    public function destroy($id)
    {
        $organization = Organization::findOrFail($id);
        $organization->delete();

        return response()->json([
            'success' => true,
            'message' => 'Organization deleted successfully'
        ]);
    }

    /**
     * Get organization by code
     */
    public function getByCode($code)
    {
        $organization = Organization::where('organization_code', $code)->first();

        if (!$organization) {
            return response()->json([
                'success' => false,
                'message' => 'Organization not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $organization
        ]);
    }

    /**
     * Get users by organization
     */
    public function getUsers($id)
    {
        $organization = Organization::findOrFail($id);

        // Get all users linked to this organization via user_organizations
        $users = User::whereHas('userOrganizations', function ($q) use ($id) {
                $q->where('organization_id', $id);
            })
            ->with(['userOrganizations' => function ($q) use ($id) {
                $q->where('organization_id', $id);
            }])
            ->get()
            ->map(function ($user) {
                $userOrg = $user->userOrganizations->first();
                return [
                    'id' => $user->id,
                    'first_name' => $user->first_name,
                    'last_name' => $user->last_name,
                    'email' => $user->email,
                    'contact_number' => $user->contact_number,
                    'role' => $user->role,
                    'membership_status' => $userOrg?->status ?? null,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $users
        ]);
    }

    /**
     * Get pending join requests for an organization
     */
    public function getPendingRequests($id)
    {
        $organization = Organization::findOrFail($id);
        
        $pendingRequests = \App\Models\UserOrganization::with('user')
            ->where('organization_id', $id)
            ->where('status', 'pending')
            ->where('org_role', 'member')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $pendingRequests
        ]);
    }

    /**
     * Respond to join request (accept/reject)
     */
    public function respondToJoinRequest(Request $request, $organizationId, $requestId)
    {
        $user = auth()->user();
        
        // Verify user is president of this organization
        $presidentMembership = \App\Models\UserOrganization::where('organization_id', $organizationId)
            ->where('user_id', $user->id)
            ->where('org_role', 'president')
            ->where('status', 'accepted')
            ->first();

        if (!$presidentMembership) {
            return response()->json([
                'success' => false,
                'message' => 'Only the organization president can respond to join requests'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'action' => 'required|in:accept,reject',
            'remarks' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $joinRequest = \App\Models\UserOrganization::findOrFail($requestId);
        
        if ($joinRequest->organization_id != $organizationId || $joinRequest->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Invalid join request'
            ], 400);
        }

        $action = $request->action;
        
        if ($action === 'accept') {
            $joinRequest->update([
                'status' => 'accepted',
                'responded_at' => now(),
                'responded_by' => $user->id,
                'joined_at' => now(),
            ]);

            // Create notification for accepted member
            \App\Models\Notification::create([
                'user_id' => $joinRequest->user_id,
                'title' => 'Join Request Accepted',
                'message' => 'Your join request to ' . $joinRequest->organization->org_name . ' has been accepted.',
                'type' => 'join_accepted',
                'role_target' => 'organization',
                'related_id' => $organizationId,
            ]);

            $message = 'Join request accepted successfully';
        } else {
            $joinRequest->update([
                'status' => 'rejected',
                'responded_at' => now(),
                'responded_by' => $user->id,
            ]);

            // Create notification for rejected member
            \App\Models\Notification::create([
                'user_id' => $joinRequest->user_id,
                'title' => 'Join Request Rejected',
                'message' => 'Your join request to ' . $joinRequest->organization->org_name . ' has been rejected.',
                'type' => 'join_rejected',
                'role_target' => 'organization',
                'related_id' => $organizationId,
            ]);

            $message = 'Join request rejected successfully';
        }

        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $joinRequest->load('user')
        ]);
    }

    /**
     * Remove a member from organization (president only)
     */
    public function removeMember(Request $request, $organizationId, $userId)
    {
        $user = auth()->user();
        
        // Verify user is president of this organization
        $presidentMembership = \App\Models\UserOrganization::where('organization_id', $organizationId)
            ->where('user_id', $user->id)
            ->where('org_role', 'president')
            ->where('status', 'accepted')
            ->first();

        if (!$presidentMembership) {
            return response()->json([
                'success' => false,
                'message' => 'Only the organization president can remove members'
            ], 403);
        }

        $memberMembership = \App\Models\UserOrganization::where('organization_id', $organizationId)
            ->where('user_id', $userId)
            ->where('org_role', 'member')
            ->where('status', 'accepted')
            ->first();

        if (!$memberMembership) {
            return response()->json([
                'success' => false,
                'message' => 'Member not found in this organization'
            ], 404);
        }

        $memberMembership->update([
            'status' => 'removed',
            'removed_at' => now(),
            'removed_by' => $user->id,
            'removal_remarks' => $request->remarks,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Member removed successfully'
        ]);
    }
}
