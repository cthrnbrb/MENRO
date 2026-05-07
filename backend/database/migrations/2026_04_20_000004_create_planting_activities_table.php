<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('planting_activities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained()->onDelete('cascade');
            $table->foreignId('barangay_id')->nullable()->constrained()->onDelete('set null');
            $table->string('site_name', 50);
            $table->string('tree_species', 25);
            $table->double('center_lat')->nullable();
            $table->double('center_lng')->nullable();
            $table->integer('radius_meters')->nullable();
            $table->date('scheduled_date');
            $table->time('scheduled_time');
            $table->foreignId('recorded_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('recorded_at')->nullable();
            $table->string('letter_reference', 100)->nullable();
            $table->enum('status', ['pending', 'approved', 'completed', 'cancelled'])->default('pending');
            $table->boolean('is_deleted')->default(false);
            $table->timestamp('deleted_at')->nullable();
            $table->foreignId('deleted_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('planting_activities');
    }
};
