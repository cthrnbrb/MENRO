<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('monitoring_assignment_logs', function (Blueprint $table) {
            $table->id();
            $table->char('assignment_id', 36);
            $table->foreign('assignment_id')->references('id')->on('monitoring_assignments')->onDelete('cascade');
            $table->foreignId('previous_staff_id')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('new_staff_id')->nullable()->constrained('users')->onDelete('set null');
            $table->text('remarks')->nullable();
            $table->foreignId('transferred_by')->constrained('users')->onDelete('cascade');
            $table->timestamp('transferred_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('monitoring_assignment_logs');
    }
};
