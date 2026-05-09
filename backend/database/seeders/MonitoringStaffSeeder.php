<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class MonitoringStaffSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create single monitoring staff account for testing
        $monitoringStaff = [
            [
                'email' => 'monitor@test.com',
                'first_name' => 'Test',
                'middle_name' => 'User',
                'last_name' => 'Monitor',
                'contact_number' => '09123456789',
                'address' => '123 Monitoring Street, Barangay Central, City of Trees',
            ],
        ];

        foreach ($monitoringStaff as $staff) {
            User::firstOrCreate(
                ['email' => $staff['email']],
                [
                    'password' => Hash::make('password123'),
                    'role' => 'monitoring staff',
                    'first_name' => $staff['first_name'],
                    'middle_name' => $staff['middle_name'],
                    'last_name' => $staff['last_name'],
                    'contact_number' => $staff['contact_number'],
                    'address' => $staff['address'],
                ]
            );

            $this->command->info("Monitoring staff created: {$staff['email']} / password123");
        }
    }
}
