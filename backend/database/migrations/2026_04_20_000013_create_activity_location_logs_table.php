<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('activity_location_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('activity_id')->constrained('planting_activities')->onDelete('cascade');
            $table->foreignId('old_barangay_id')->nullable()->constrained('barangays')->onDelete('set null');
            $table->foreignId('new_barangay_id')->nullable()->constrained('barangays')->onDelete('set null');
            $table->double('old_lat')->nullable();
            $table->double('old_lng')->nullable();
            $table->double('new_lat')->nullable();
            $table->double('new_lng')->nullable();
            $table->text('remarks')->nullable();
            $table->foreignId('changed_by')->constrained('users')->onDelete('cascade');
            $table->timestamp('changed_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activity_location_logs');
    }
};
