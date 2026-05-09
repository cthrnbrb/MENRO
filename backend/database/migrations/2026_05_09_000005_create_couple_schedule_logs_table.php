<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('couple_schedule_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('couple_planting_sched_id')->constrained('couple_planting_activities')->onDelete('cascade');
            $table->date('old_date')->nullable();
            $table->date('new_date')->nullable();
            $table->time('old_time')->nullable();
            $table->time('new_time')->nullable();
            $table->text('remarks')->nullable();
            $table->foreignId('changed_by')->constrained('users')->onDelete('cascade');
            $table->timestamp('changed_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('couple_schedule_logs');
    }
};
