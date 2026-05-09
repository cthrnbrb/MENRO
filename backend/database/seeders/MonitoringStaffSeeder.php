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
        // Create multiple monitoring staff accounts
        $monitoringStaff = [
            [
                'email' => 'monitor1@test.com',
                'first_name' => 'John',
                'middle_name' => 'David',
                'last_name' => 'Smith',
                'contact_number' => '09123456789',
                'address' => '123 Monitoring Street, Barangay Central, City of Trees',
            ],
            [
                'email' => 'monitor2@test.com',
                'first_name' => 'Sarah',
                'middle_name' => 'Grace',
                'last_name' => 'Johnson',
                'contact_number' => '09134567890',
                'address' => '456 Inspection Avenue, Barangay North, City of Trees',
            ],
            [
                'email' => 'monitor3@test.com',
                'first_name' => 'Michael',
                'middle_name' => 'James',
                'last_name' => 'Wilson',
                'contact_number' => '09145678901',
                'address' => '789 Survey Road, Barangay South, City of Trees',
            ],
        ];

        foreach ($monitoringStaff as $staff) {
            User::firstOrCreate(
                ['email' => $staff['email']],
                [
                    'password' => Hash::make('monitor123'),
                    'role' => 'monitoring staff',
                    'first_name' => $staff['first_name'],
                    'middle_name' => $staff['middle_name'],
                    'last_name' => $staff['last_name'],
                    'contact_number' => $staff['contact_number'],
                    'address' => $staff['address'],
                ]
            );

            $this->command->info("Monitoring staff created: {$staff['email']} / monitor123");
        }
    }
}
