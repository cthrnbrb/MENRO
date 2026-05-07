<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('monitoring_records', function (Blueprint $table) {
            $table->integer('id', false, true)->primary()->autoIncrement();
            $table->integer('tree_id', false, true);
            $table->foreign('tree_id')->references('id')->on('trees')->onDelete('cascade');
            $table->char('assignment_id', 36)->nullable();
            $table->foreign('assignment_id')->references('id')->on('monitoring_assignments')->onDelete('set null');
            $table->integer('couple_user_id', false, true)->nullable();
            $table->foreign('couple_user_id')->references('id')->on('users')->onDelete('set null');
            $table->text('photo')->nullable();
            $table->enum('status', ['alive', 'dead'])->default('alive');
            $table->decimal('dead_lat', 10, 7)->nullable();
            $table->decimal('dead_lng', 10, 7)->nullable();
            $table->timestamp('checked_at')->nullable();
            $table->timestamp('synced_at')->nullable();
            $table->enum('approval_status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->integer('approved_by', false, true)->nullable();
            $table->foreign('approved_by')->references('id')->on('users')->onDelete('set null');
            $table->timestamp('approved_at')->nullable();
            $table->text('approval_remarks')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('monitoring_records');
    }
};
