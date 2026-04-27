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
            $table->integer('staff_id', false, true);
            $table->foreign('staff_id')->references('id')->on('users')->onDelete('cascade');
            $table->char('assignment_id', 36);
            $table->foreign('assignment_id')->references('id')->on('monitoring_assignments')->onDelete('cascade');
            $table->enum('status', ['alive', 'dead']);
            $table->text('photo');
            $table->timestamp('checked_at');
            $table->timestamp('synced_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('monitoring_records');
    }
};
