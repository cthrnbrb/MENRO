<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Organization;
use App\Models\UserOrganization;

class NewOrganizationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing data to avoid duplicates
        DB::table('user_organizations')->where('org_role', 'president')->delete();
        DB::table('organizations')->delete();
        DB::table('users')->where('email', 'president@neworg.com')->delete();

        // Create president user account
        $president = User::create([
            'email' => 'president@neworg.com',
            'password' => Hash::make('password123'),
            'role' => 'organization',
            'first_name' => 'John',
            'middle_name' => 'David',
            'last_name' => 'Smith',
            'contact_number' => '09123456789',
            'address' => '123 Organization Street, Manila City',
        ]);

        // Create the organization
        $organization = Organization::create([
            'org_name' => 'Green Earth Environmental Organization',
            'president_id' => $president->id,
            'organization_code' => 'GREEN1',
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

        $this->command->info('New organization and president account created successfully!');
        $this->command->info('================================================');
        $this->command->info('President Email: president@neworg.com');
        $this->command->info('President Password: password123');
        $this->command->info('Organization: Green Earth Environmental Organization');
        $this->command->info('Organization Code: GREEN1');
        $this->command->info('================================================');
    }
}
