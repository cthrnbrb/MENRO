<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('activity_schedule_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('activity_id')->constrained('planting_activities')->onDelete('cascade');
            $table->date('old_date')->nullable();
            $table->date('new_date')->nullable();
            $table->text('remarks')->nullable();
            $table->foreignId('changed_by')->constrained('users')->onDelete('cascade');
            $table->timestamp('changed_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activity_schedule_logs');
    }
};
