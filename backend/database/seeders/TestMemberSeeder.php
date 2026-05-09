<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Organization;
use App\Models\UserOrganization;

class TestMemberSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing test member
        DB::table('user_organizations')->where('user_id', function($query) {
            $query->select('id')->from('users')->where('email', 'testmember@green1.com');
        })->delete();
        DB::table('users')->where('email', 'testmember@green1.com')->delete();

        // Get the organization
        $organization = Organization::where('organization_code', 'GREEN1')->first();
        
        if (!$organization) {
            $this->command->error('Organization GREEN1 not found. Please run NewOrganizationSeeder first.');
            return;
        }

        // Create test member user
        $member = User::create([
            'email' => 'testmember@green1.com',
            'password' => Hash::make('password123'),
            'role' => 'organization',
            'first_name' => 'Test',
            'middle_name' => 'Member',
            'last_name' => 'User',
            'contact_number' => '09123456789',
            'address' => '456 Member Street, Manila City',
        ]);

        // Create pending membership request
        UserOrganization::create([
            'user_id' => $member->id,
            'organization_id' => $organization->id,
            'org_role' => 'member',
            'status' => 'pending',
            'requested_at' => now(),
        ]);

        $this->command->info('Test member with pending request created successfully!');
        $this->command->info('================================================');
        $this->command->info('Member Email: testmember@green1.com');
        $this->command->info('Member Password: password123');
        $this->command->info('Organization: ' . $organization->org_name);
        $this->command->info('Status: Pending Approval');
        $this->command->info('================================================');
    }
}
