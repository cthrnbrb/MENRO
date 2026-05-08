<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Couple;
use Illuminate\Support\Facades\Hash;

class CoupleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sharedOrNumber = 'OR-2024-001234';

        // Create husband test account
        $husband = User::firstOrCreate(
            ['email' => 'juan.delacruz@test.com'],
            [
                'password' => Hash::make('password123'),
                'role' => 'couple',
                'first_name' => 'Juan',
                'middle_name' => 'Santos',
                'last_name' => 'Dela Cruz',
                'contact_number' => '09171234567',
                'address' => '123 Rizal Street, Barangay San Jose, City of Trees',
            ]
        );

        // Create wife test account
        $wife = User::firstOrCreate(
            ['email' => 'maria.delacruz@test.com'],
            [
                'password' => Hash::make('password123'),
                'role' => 'couple',
                'first_name' => 'Maria',
                'middle_name' => 'Reyes',
                'last_name' => 'Dela Cruz',
                'contact_number' => '09187654321',
                'address' => '123 Rizal Street, Barangay San Jose, City of Trees',
            ]
        );

        // Ensure a single couple record exists for this pair with one shared OR number.
        $existingCouple = Couple::query()
            ->where(function ($query) use ($husband, $wife) {
                $query->where('user_id', $husband->id)
                    ->where('partner_user_id', $wife->id);
            })
            ->orWhere(function ($query) use ($husband, $wife) {
                $query->where('user_id', $wife->id)
                    ->where('partner_user_id', $husband->id);
            })
            ->first();

        if ($existingCouple) {
            $existingCouple->update([
                'or_number' => $sharedOrNumber,
            ]);
        } else {
            Couple::create([
                'user_id' => $husband->id,
                'partner_user_id' => $wife->id,
                'or_number' => $sharedOrNumber,
                'created_at' => now(),
            ]);
        }

        $this->command->info('Couple account created successfully!');
        $this->command->info('Husband: juan.delacruz@test.com / password123');
        $this->command->info('Wife: maria.delacruz@test.com / password123');
        $this->command->info("Shared OR Number: {$sharedOrNumber}");
    }
}
