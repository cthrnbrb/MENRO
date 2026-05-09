<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Organization;
use App\Models\UserOrganization;

class OrganizationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create a test president user
        $president = User::create([
            'email' => 'president@testorg.com',
            'password' => Hash::make('password123'),
            'role' => 'organization',
            'first_name' => 'Juan',
            'middle_name' => 'Santos',
            'last_name' => 'Cruz',
            'contact_number' => '09123456789',
            'address' => '123 Test Street, Test City',
        ]);

        // Create a test organization
        $organization = Organization::create([
            'org_name' => 'Test Environmental Organization',
            'president_id' => $president->id,
            'organization_code' => 'TEST01',
        ]);

        // Create the president's user organization record
        UserOrganization::create([
            'user_id' => $president->id,
            'organization_id' => $organization->id,
            'org_role' => 'president',
            'status' => 'accepted',
            'requested_at' => now(),
            'responded_at' => now(),
            'joined_at' => now(),
        ]);

        // Create a test member user
        $member = User::create([
            'email' => 'member@testorg.com',
            'password' => Hash::make('password123'),
            'role' => 'organization',
            'first_name' => 'Maria',
            'middle_name' => 'Garcia',
            'last_name' => 'Reyes',
            'contact_number' => '09876543210',
            'address' => '456 Member Avenue, Test City',
        ]);

        // Create the member's user organization record (pending)
        UserOrganization::create([
            'user_id' => $member->id,
            'organization_id' => $organization->id,
            'org_role' => 'member',
            'status' => 'pending',
            'requested_at' => now(),
        ]);

        // Create a test admin user
        $admin = User::create([
            'email' => 'admin@test.com',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
            'first_name' => 'Admin',
            'middle_name' => 'System',
            'last_name' => 'User',
            'contact_number' => '09111111111',
            'address' => 'Admin Office, Test City',
        ]);

        // Create a test monitoring staff
        $staff = User::create([
            'email' => 'staff@test.com',
            'password' => Hash::make('staff123'),
            'role' => 'monitoring staff',
            'first_name' => 'Staff',
            'middle_name' => 'Monitoring',
            'last_name' => 'User',
            'contact_number' => '09222222222',
            'address' => 'Monitoring Office, Test City',
        ]);

        // Create a test couple
        $couple1 = User::create([
            'email' => 'couple1@test.com',
            'password' => Hash::make('couple123'),
            'role' => 'couple',
            'first_name' => 'Juan',
            'middle_name' => 'Dela',
            'last_name' => 'Cruz',
            'contact_number' => '09333333333',
            'address' => 'Couple Residence 1, Test City',
        ]);

        $couple2 = User::create([
            'email' => 'couple2@test.com',
            'password' => Hash::make('couple123'),
            'role' => 'couple',
            'first_name' => 'Maria',
            'middle_name' => 'Santos',
            'last_name' => 'Reyes',
            'contact_number' => '09444444444',
            'address' => 'Couple Residence 1, Test City',
        ]);

        $this->command->info('Test accounts created successfully!');
        $this->command->info('=====================================');
        $this->command->info('President: president@testorg.com / password123');
        $this->command->info('Member: member@testorg.com / password123');
        $this->command->info('Admin: admin@test.com / admin123');
        $this->command->info('Staff: staff@test.com / staff123');
        $this->command->info('Couple 1: couple1@test.com / couple123');
        $this->command->info('Couple 2: couple2@test.com / couple123');
        $this->command->info('Organization: Test Environmental Organization (TEST01)');
        $this->command->info('=====================================');
    }
}
