<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('monitoring_assignments', function (Blueprint $table) {
            $table->char('id', 36)->primary();
            $table->foreignId('activity_id')->constrained('planting_activities')->onDelete('cascade');
            $table->foreignId('staff_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('assigned_by')->constrained('users')->onDelete('cascade');
            $table->timestamp('assigned_at');
            $table->integer('target_year')->nullable();
            $table->integer('target_quarter')->nullable();
            $table->date('scheduled_date');
            $table->boolean('is_completed')->default(false);
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->unique(['activity_id', 'staff_id', 'target_year', 'target_quarter'], 'monitoring_assignments_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('monitoring_assignments');
    }
};
