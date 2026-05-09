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
        // Create multiple couple accounts with different OR numbers
        $couples = [
            [
                'or_number' => 'OR-2024-001234',
                'husband' => [
                    'email' => 'juan.delacruz@test.com',
                    'first_name' => 'Juan',
                    'middle_name' => 'Santos',
                    'last_name' => 'Dela Cruz',
                    'contact_number' => '09171234567',
                    'address' => '123 Rizal Street, Barangay San Jose, City of Trees',
                ],
                'wife' => [
                    'email' => 'maria.delacruz@test.com',
                    'first_name' => 'Maria',
                    'middle_name' => 'Reyes',
                    'last_name' => 'Dela Cruz',
                    'contact_number' => '09187654321',
                    'address' => '123 Rizal Street, Barangay San Jose, City of Trees',
                ],
            ],
            [
                'or_number' => 'OR-2024-001235',
                'husband' => [
                    'email' => 'pedro.santos@test.com',
                    'first_name' => 'Pedro',
                    'middle_name' => 'Mendoza',
                    'last_name' => 'Santos',
                    'contact_number' => '09192345678',
                    'address' => '456 Mabini Street, Barangay Santa Cruz, City of Trees',
                ],
                'wife' => [
                    'email' => 'rosa.santos@test.com',
                    'first_name' => 'Rosa',
                    'middle_name' => 'Lopez',
                    'last_name' => 'Santos',
                    'contact_number' => '09203456789',
                    'address' => '456 Mabini Street, Barangay Santa Cruz, City of Trees',
                ],
            ],
            [
                'or_number' => 'OR-2024-001236',
                'husband' => [
                    'email' => 'carlos.reyes@test.com',
                    'first_name' => 'Carlos',
                    'middle_name' => 'Garcia',
                    'last_name' => 'Reyes',
                    'contact_number' => '09213456790',
                    'address' => '789 Bonifacio Street, Barangay San Antonio, City of Trees',
                ],
                'wife' => [
                    'email' => 'elena.reyes@test.com',
                    'first_name' => 'Elena',
                    'middle_name' => 'Martinez',
                    'last_name' => 'Reyes',
                    'contact_number' => '09224567890',
                    'address' => '789 Bonifacio Street, Barangay San Antonio, City of Trees',
                ],
            ],
        ];

        foreach ($couples as $coupleData) {
            // Create husband test account
            $husband = User::firstOrCreate(
                ['email' => $coupleData['husband']['email']],
                [
                    'password' => Hash::make('password123'),
                    'role' => 'couple',
                    'first_name' => $coupleData['husband']['first_name'],
                    'middle_name' => $coupleData['husband']['middle_name'],
                    'last_name' => $coupleData['husband']['last_name'],
                    'contact_number' => $coupleData['husband']['contact_number'],
                    'address' => $coupleData['husband']['address'],
                ]
            );

            // Create wife test account
            $wife = User::firstOrCreate(
                ['email' => $coupleData['wife']['email']],
                [
                    'password' => Hash::make('password123'),
                    'role' => 'couple',
                    'first_name' => $coupleData['wife']['first_name'],
                    'middle_name' => $coupleData['wife']['middle_name'],
                    'last_name' => $coupleData['wife']['last_name'],
                    'contact_number' => $coupleData['wife']['contact_number'],
                    'address' => $coupleData['wife']['address'],
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
                    'or_number' => $coupleData['or_number'],
                ]);
            } else {
                Couple::create([
                    'user_id' => $husband->id,
                    'partner_user_id' => $wife->id,
                    'or_number' => $coupleData['or_number'],
                    'created_at' => now(),
                ]);
            }

            $this->command->info("Couple created with OR Number: {$coupleData['or_number']}");
            $this->command->info("  Husband: {$husband->email} / password123");
            $this->command->info("  Wife: {$wife->email} / password123");
        }
    }
}
