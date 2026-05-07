<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin user
        User::create([
            'email' => 'admin@test.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
            'first_name' => 'Admin',
            'middle_name' => null,
            'last_name' => 'User',
            'contact_number' => '09123456789',
            'address' => 'Test Address',
        ]);

        // Monitoring staff user
        User::create([
            'email' => 'staff@test.com',
            'password' => bcrypt('password'),
            'role' => 'monitoring staff',
            'first_name' => 'Monitoring',
            'middle_name' => null,
            'last_name' => 'Staff',
            'contact_number' => '09123456789',
            'address' => 'Test Address',
        ]);

        // Organization planter user
        User::create([
            'email' => 'organization@test.com',
            'password' => bcrypt('password'),
            'role' => 'organization',
            'first_name' => 'Organization',
            'middle_name' => null,
            'last_name' => 'Planter',
            'contact_number' => '09123456789',
            'address' => 'Test Address',
        ]);

        // Couple user
        User::create([
            'email' => 'couple@test.com',
            'password' => bcrypt('password'),
            'role' => 'couple',
            'first_name' => 'Couple',
            'middle_name' => null,
            'last_name' => 'User',
            'contact_number' => '09123456789',
            'address' => 'Test Address',
        ]);
    }
}
