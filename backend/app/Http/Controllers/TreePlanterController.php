<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Organization;
use App\Models\UserOrganization;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

class TreePlanterController extends Controller
{
    /**
     * List all tree planters
     */
    public function index()
    {
        $treePlanters = User::whereIn('role', ['couple', 'organization'])
            ->with(['userOrganizations.organization', 'coupleAsUser', 'coupleAsPartner'])
            ->orderBy('id', 'desc')
            ->get()
            ->map(function ($user) {
                $data = [
                    'id' => $user->id,
                    'first_name' => $user->first_name,
                    'middle_name' => $user->middle_name,
                    'last_name' => $user->last_name,
                    'email' => $user->email,
                    'contact_number' => $user->contact_number,
                    'address' => $user->address,
                    'role' => $user->role,
                    'created_at' => $user->created_at,
                    'updated_at' => $user->updated_at,
                ];

                $userOrg = $user->userOrganizations->first();
                if ($userOrg) {
                    $data['organization_id'] = $userOrg->organization_id;
                    $data['organization'] = $userOrg->organization;
                    $data['membership_status'] = $userOrg->status;
                }

                if ($user->role === 'couple') {
                    $couple = $user->coupleAsUser ?? $user->coupleAsPartner;
                    if ($couple) {
                        $data['or_number'] = $couple->or_number;
                        $partnerId = $couple->user_id === $user->id ? $couple->partner_user_id : $couple->user_id;
                        $partner = User::find($partnerId);
                        if ($partner) {
                            $data['partner'] = [
                                'id' => $partner->id,
                                'first_name' => $partner->first_name,
                                'last_name' => $partner->last_name,
                                'email' => $partner->email,
                            ];
                        }
                    }
                }

                return $data;
            });

        return response()->json([
            'success' => true,
            'data' => $treePlanters
        ]);
    }

    /**
     * Show single tree planter
     */
    public function show($id)
    {
        $user = User::whereIn('role', ['couple', 'organization'])
            ->with(['userOrganizations.organization', 'coupleAsUser', 'coupleAsPartner'])
            ->findOrFail($id);

        $data = [
            'id' => $user->id,
            'first_name' => $user->first_name,
            'last_name' => $user->last_name,
            'email' => $user->email,
            'contact_number' => $user->contact_number,
            'address' => $user->address,
            'role' => $user->role,
            'created_at' => $user->created_at,
            'updated_at' => $user->updated_at,
        ];

        $userOrg = $user->userOrganizations->first();
        if ($userOrg) {
            $data['organization_id'] = $userOrg->organization_id;
            $data['organization'] = $userOrg->organization;
            $data['membership_status'] = $userOrg->status;
        }

        if ($user->role === 'couple') {
            $couple = $user->coupleAsUser ?? $user->coupleAsPartner;
            if ($couple) {
                $data['or_number'] = $couple->or_number;
                $partnerId = $couple->user_id === $user->id ? $couple->partner_user_id : $couple->user_id;
                $partner = User::find($partnerId);
                if ($partner) {
                    $data['partner'] = [
                        'id' => $partner->id,
                        'first_name' => $partner->first_name,
                        'last_name' => $partner->last_name,
                        'email' => $partner->email,
                    ];
                }
            }
        }

        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    }

    /**
     * Create new tree planter
     */
    public function store(Request $request)
    {
        $isCouple = $request->role === 'couple';
        
        $rules = [
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'contact_number' => 'required|string|max:11',
            'address' => 'required|string',
            'role' => 'required|in:couple,organization',
        ];
        
        // Add couple-specific rules
        if ($isCouple) {
            $rules['or_number'] = 'required|string|max:50';
            $rules['middle_name'] = 'nullable|string|max:50';
            $rules['partner_first_name'] = 'required|string|max:100';
            $rules['partner_middle_name'] = 'nullable|string|max:50';
            $rules['partner_last_name'] = 'required|string|max:100';
            $rules['partner_email'] = 'required|email|unique:users,email';
            $rules['partner_password'] = 'required|string|min:6';
            $rules['partner_contact_number'] = 'required|string|max:11';
        }
        
        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }
        
        // Check if OR number is already in use by another couple
        if ($isCouple && $request->has('or_number')) {
            $existingCouple = \App\Models\Couple::where('or_number', $request->or_number)->first();
            if ($existingCouple) {
                return response()->json([
                    'success' => false,
                    'message' => 'This OR number is already registered',
                    'errors' => ['or_number' => 'This OR number is already registered']
                ], 422);
            }
        }

        try {
            $user2 = null;

            // Handle based on role
            if ($request->role === 'couple') {
                // Create first user
                $user = User::create([
                    'first_name' => $request->first_name,
                    'middle_name' => $request->middle_name,
                    'last_name' => $request->last_name,
                    'email' => $request->email,
                    'password' => Hash::make($request->password),
                    'contact_number' => $request->contact_number,
                    'address' => $request->address,
                    'role' => 'couple',
                ]);

                // Create second user for couple
                $user2 = User::create([
                    'first_name' => $request->partner_first_name,
                    'middle_name' => $request->partner_middle_name,
                    'last_name' => $request->partner_last_name,
                    'email' => $request->partner_email,
                    'password' => Hash::make($request->partner_password),
                    'contact_number' => $request->partner_contact_number,
                    'address' => $request->address,
                    'role' => 'couple',
                ]);

                // Create couple relationship
                \App\Models\Couple::create([
                    'user_id' => $user->id,
                    'partner_user_id' => $user2->id,
                    'or_number' => $request->or_number,
                    'created_at' => now(),
                ]);
            } else {
                // Organization type - create single user
                $user = User::create([
                    'first_name' => $request->first_name,
                    'middle_name' => $request->middle_name,
                    'last_name' => $request->last_name,
                    'email' => $request->email,
                    'password' => Hash::make($request->password),
                    'contact_number' => $request->contact_number,
                    'address' => $request->address,
                    'role' => 'organization',
                ]);
            }

            $responseData = [
                'id' => $user->id,
                'first_name' => $user->first_name,
                'middle_name' => $user->middle_name,
                'last_name' => $user->last_name,
                'email' => $user->email,
                'contact_number' => $user->contact_number,
                'address' => $user->address,
                'role' => $user->role,
            ];
            
            // Include partner data for couples
            if ($user2) {
                $responseData['partner'] = [
                    'id' => $user2->id,
                    'first_name' => $user2->first_name,
                    'last_name' => $user2->last_name,
                    'email' => $user2->email,
                ];
                $responseData['or_number'] = $request->or_number;
            }

            return response()->json([
                'success' => true,
                'message' => $user2 ? 'Couple created successfully' : 'Tree planter created successfully',
                'data' => $responseData
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create tree planter: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update tree planter
     */
    public function update(Request $request, $id)
    {
        $user = User::whereIn('role', ['couple', 'organization'])
            ->with(['userOrganizations', 'coupleAsUser', 'coupleAsPartner'])
            ->findOrFail($id);

        $isCouple = $user->role === 'couple';

        $rules = [
            'first_name' => 'sometimes|required|string|max:100',
            'last_name' => 'sometimes|required|string|max:100',
            'email' => 'sometimes|required|email|unique:users,email,' . $id,
            'contact_number' => 'sometimes|required|string|max:11',
            'address' => 'sometimes|required|string',
        ];
        
        // Add couple-specific rules
        if ($isCouple) {
            $rules['or_number'] = 'sometimes|required|string|max:50';
            $rules['middle_name'] = 'nullable|string|max:50';
            $rules['partner_first_name'] = 'sometimes|required|string|max:100';
            $rules['partner_middle_name'] = 'nullable|string|max:50';
            $rules['partner_last_name'] = 'sometimes|required|string|max:100';
            $rules['partner_email'] = 'sometimes|required|email';
            $rules['partner_contact_number'] = 'sometimes|required|string|max:11';
        }

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }
        
        // Check if OR number is already in use by another couple (excluding current couple)
        if ($isCouple && $request->has('or_number')) {
            $existingCouple = \App\Models\Couple::where('or_number', $request->or_number)
                ->where('id', '!=', ($user->coupleAsUser?->id ?? $user->coupleAsPartner?->id))
                ->first();
            if ($existingCouple) {
                return response()->json([
                    'success' => false,
                    'errors' => ['or_number' => 'This OR number is already registered']
                ], 422);
            }
        }

        try {
            // Update user details
            $updateData = [];
            if ($request->has('first_name')) $updateData['first_name'] = $request->first_name;
            if ($request->has('last_name')) $updateData['last_name'] = $request->last_name;
            if ($request->has('email')) $updateData['email'] = $request->email;
            if ($request->has('contact_number')) $updateData['contact_number'] = $request->contact_number;
            if ($request->has('address')) $updateData['address'] = $request->address;
            if ($request->has('middle_name')) $updateData['middle_name'] = $request->middle_name;

            if (!empty($updateData)) {
                $user->update($updateData);
            }

            // Update couple OR number if provided
            if ($isCouple && $request->has('or_number')) {
                $couple = $user->coupleAsUser ?? $user->coupleAsPartner;
                if ($couple) {
                    $couple->update(['or_number' => $request->or_number]);
                }
            }

            // Update partner details if this is a couple
            if ($isCouple && ($request->has('partner_first_name') || $request->has('partner_last_name') || $request->has('partner_email') || $request->has('partner_contact_number'))) {
                $couple = $user->coupleAsUser ?? $user->coupleAsPartner;
                if ($couple) {
                    $partnerId = $couple->user_id === $user->id ? $couple->partner_user_id : $couple->user_id;
                    $partner = User::find($partnerId);
                    
                    if ($partner) {
                        $partnerUpdateData = [];
                        if ($request->has('partner_first_name')) $partnerUpdateData['first_name'] = $request->partner_first_name;
                        if ($request->has('partner_last_name')) $partnerUpdateData['last_name'] = $request->partner_last_name;
                        if ($request->has('partner_email')) $partnerUpdateData['email'] = $request->partner_email;
                        if ($request->has('partner_contact_number')) $partnerUpdateData['contact_number'] = $request->partner_contact_number;
                        if ($request->has('partner_middle_name')) $partnerUpdateData['middle_name'] = $request->partner_middle_name;

                        if (!empty($partnerUpdateData)) {
                            $partner->update($partnerUpdateData);
                        }
                    }
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Tree planter updated successfully',
                'data' => $user->load(['coupleAsUser', 'coupleAsPartner'])
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update tree planter: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete tree planter
     */
    public function destroy($id)
    {
        $user = User::whereIn('role', ['couple', 'organization'])
            ->with(['coupleAsUser', 'coupleAsPartner'])
            ->findOrFail($id);

        try {
            // If this is a couple user, delete the couple relationship
            if ($user->role === 'couple') {
                $couple = $user->coupleAsUser ?? $user->coupleAsPartner;
                if ($couple) {
                    $couple->delete();
                }
            }

            // Delete user organizations
            $user->userOrganizations()->delete();

            // Delete user
            $user->delete();

            return response()->json([
                'success' => true,
                'message' => 'Tree planter deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete tree planter: ' . $e->getMessage()
            ], 500);
        }
    }
}
