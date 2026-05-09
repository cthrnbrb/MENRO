<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('couple_location_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('couple_planting_sched_id')->constrained('couple_planting_activities')->onDelete('cascade');
            $table->foreignId('old_barangay_id')->nullable()->constrained('barangays')->onDelete('set null');
            $table->foreignId('new_barangay_id')->nullable()->constrained('barangays')->onDelete('set null');
            $table->text('remarks')->nullable();
            $table->foreignId('changed_by')->constrained('users')->onDelete('cascade');
            $table->timestamp('changed_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('couple_location_logs');
    }
};
