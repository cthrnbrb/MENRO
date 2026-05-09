<?php

namespace Database\Seeders;

use App\Models\PlantingActivity;
use Illuminate\Database\Seeder;

class PlantingActivitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $activities = [
            [
                'organization_id' => 1, // Test Environmental Organization
                'site_name' => 'Community Tree Planting 2026',
                'tree_species' => 'Narra, Mahogany, Acacia',
                'center_lat' => 8.4833,
                'center_lng' => 124.6500,
                'radius_meters' => 500,
                'scheduled_date' => now()->addDays(7),
                'scheduled_time' => '08:00:00',
                'recorded_by' => 1, // admin user
                'recorded_at' => now(),
                'letter_reference' => 'LETTER-2026-001',
                'status' => 'approved',
                'is_deleted' => false,
            ],
            [
                'organization_id' => 1,
                'site_name' => 'School Tree Planting Program',
                'tree_species' => 'Mango, Narra, Gmelina',
                'center_lat' => 8.4850,
                'center_lng' => 124.6520,
                'radius_meters' => 300,
                'scheduled_date' => now()->addDays(14),
                'scheduled_time' => '09:00:00',
                'recorded_by' => 1,
                'recorded_at' => now(),
                'letter_reference' => 'LETTER-2026-002',
                'status' => 'approved',
                'is_deleted' => false,
            ],
            [
                'organization_id' => 1,
                'site_name' => 'Riverbank Rehabilitation',
                'tree_species' => 'Bamboo, Narra, Acacia',
                'center_lat' => 8.4800,
                'center_lng' => 124.6480,
                'radius_meters' => 400,
                'scheduled_date' => now()->addDays(21),
                'scheduled_time' => '07:30:00',
                'recorded_by' => 1,
                'recorded_at' => now(),
                'letter_reference' => 'LETTER-2026-003',
                'status' => 'approved',
                'is_deleted' => false,
            ],
        ];

        foreach ($activities as $activity) {
            PlantingActivity::firstOrCreate(
                ['site_name' => $activity['site_name']],
                $activity
            );
        }

        $this->command->info('Planting activities seeded successfully');
    }
}
