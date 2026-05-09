<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create default admin account (only if not exists)
        User::firstOrCreate(
            ['email' => 'romarybanez2005@gmail.com'],
            [
                'password' => Hash::make('admin'),
                'role' => 'admin',
                'first_name' => 'Romar',
                'middle_name' => 'Avelino',
                'last_name' => 'Ybanez',
                'contact_number' => '09381395140',
                'address' => 'Sample Address',
            ]
        );

        // Run seeders for testing
        $this->call([
            CoupleSeeder::class,
            MonitoringStaffSeeder::class,
            OrganizationSeeder::class,
        ]);

    }
}
