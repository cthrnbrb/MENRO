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
            'president_id' => 'nullable|exists:users,id',
            'organization_code' => 'required|string|max:6|unique:organizations',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Create organization only
            $organization = Organization::create([
                'org_name' => $request->org_name,
                'president_id' => $request->president_id,
                'organization_code' => $request->organization_code,
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
}
