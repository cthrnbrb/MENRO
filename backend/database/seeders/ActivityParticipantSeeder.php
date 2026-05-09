<?php

namespace Database\Seeders;

use App\Models\PlantingActivity;
use App\Models\User;
use Illuminate\Database\Seeder;

class ActivityParticipantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all users who should be able to plant trees
        $users = User::whereIn('role', ['couple', 'organization', 'monitoring staff'])->get();
        
        // Get planting activities
        $activities = PlantingActivity::all();

        foreach ($activities as $activity) {
            foreach ($users as $user) {
                // Assign user to activity as participant
                $activity->participants()->attach($user->id, [
                    'participant_member' => $user->id,
                    'assigned_at' => now(),
                    'status' => 'active',
                ]);
            }
        }

        $this->command->info('Activity participants seeded successfully');
    }
}
