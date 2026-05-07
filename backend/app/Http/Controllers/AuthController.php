<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Auth\Events\PasswordReset;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($request->only('email', 'password'))) {
            $user = Auth::user();
            $token = $user->createToken('auth-token')->plainTextToken;

            // Load user's organizations with organization details
            $userOrganizations = $user->userOrganizations()->with('organization')->get();

            return response()->json([
                'success' => true,
                'message' => 'Login successful',
                'token' => $token,
                'user' => $user,
                'organizations' => $userOrganizations,
                'role' => $user->role,
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Invalid credentials',
        ], 401);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully',
        ]);
    }

    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $status = Password::sendResetLink(
            $request->only('email')
        );

        if ($status === Password::RESET_LINK_SENT) {
            return response()->json([
                'success' => true,
                'message' => 'Password reset link sent to your email',
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Unable to send reset link'
        ], 400);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:8|confirmed',
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (User $user, string $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                ])->save();

                event(new PasswordReset($user));
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return response()->json([
                'success' => true,
                'message' => 'Password reset successfully',
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Invalid token or email',
        ], 400);
    }

    public function validateCode(Request $request)
    {
        $request->validate([
            'code' => 'required|string|max:6',
        ]);

        $code = trim($request->code);

        // Check if organization exists
        $organization = \App\Models\Organization::where('organization_code', $code)->first();

        if ($organization) {
            return response()->json([
                'success' => true,
                'valid' => true,
                'message' => 'Organization code is valid',
                'organization_code' => $organization->organization_code,
                'organization_name' => $organization->org_name,
            ]);
        }

        // Organization does not exist
        return response()->json([
            'success' => false,
            'valid' => false,
            'message' => 'Invalid organization code'
        ], 404);
    }

    public function joinOrganization(Request $request)
    {
        try {
            $request->validate([
                'code' => 'required|string|max:6',
            ]);

            $user = auth()->user();
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not authenticated'
                ], 401);
            }

            $code = trim($request->code);

            // Check if organization exists
            $organization = \App\Models\Organization::where('organization_code', $code)->first();

            if (!$organization) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid organization code'
                ], 404);
            }

            // Check if user already has a pending/accepted membership request
            $existingMembership = \App\Models\UserOrganization::where('user_id', $user->id)
                ->where('organization_id', $organization->id)
                ->first();

            if ($existingMembership) {
                return response()->json([
                    'success' => false,
                    'message' => 'You already have a membership request for this organization',
                    'status' => $existingMembership->status
                ], 400);
            }

            // Create join request with pending status
            \App\Models\UserOrganization::create([
                'user_id' => $user->id,
                'organization_id' => $organization->id,
                'status' => 'pending',
                'requested_at' => now(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Join request submitted. Waiting for president approval.',
                'data' => [
                    'organization' => $organization,
                    'role' => $user->role,
                ]
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to submit join request: ' . $e->getMessage()
            ], 500);
        }
    }

    public function register(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string|max:50',
            'middle_name' => 'nullable|string|max:50',
            'last_name' => 'required|string|max:50',
            'email' => 'required|string|email|max:50|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'contact_number' => 'required|string|max:11',
            'address' => 'required|string',
        ]);

        // Create the user only (no organization yet)
        // Default role is 'organization' for self-registration
        $user = \App\Models\User::create([
            'first_name' => $request->first_name,
            'middle_name' => $request->middle_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'contact_number' => $request->contact_number,
            'address' => $request->address,
            'role' => 'organization',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Registration successful. Please login to join an organization.',
            'data' => [
                'user' => $user,
            ]
        ], 201);
    }

    public function user(Request $request)
    {
        return response()->json([
            'user' => $request->user(),
        ]);
    }
}
