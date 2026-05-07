<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('monitoring_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tree_id')->constrained()->onDelete('cascade');
            $table->char('assignment_id', 36)->nullable();
            $table->foreign('assignment_id')->references('id')->on('monitoring_assignments')->onDelete('set null');
            $table->foreignId('couple_user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->text('photo')->nullable();
            $table->enum('status', ['alive', 'dead'])->default('alive');
            $table->double('dead_lat')->nullable();
            $table->double('dead_lng')->nullable();
            $table->timestamp('checked_at')->nullable();
            $table->timestamp('synced_at')->nullable();
            $table->enum('approval_status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->foreignId('approved_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('approved_at')->nullable();
            $table->text('approval_remarks')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('monitoring_records');
    }
};
