<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('monitoring_assignments', function (Blueprint $table) {
            // Make activity_id nullable (assignment can be for activity OR couple planting)
            $table->foreignId('activity_id')->nullable()->change();
            
            // Add couple_planting_sched_id foreign key
            $table->foreignId('couple_planting_sched_id')->nullable()->after('activity_id')->constrained('couple_planting_activities')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('monitoring_assignments', function (Blueprint $table) {
            $table->dropForeign(['couple_planting_sched_id']);
            $table->dropColumn('couple_planting_sched_id');
            $table->foreignId('activity_id')->nullable(false)->change();
        });
    }
};
