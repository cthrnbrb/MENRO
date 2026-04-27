<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('planting_activities', function (Blueprint $table) {
            $table->integer('id', false, true)->primary()->autoIncrement();
            $table->integer('planter_id', false, true);
            $table->foreign('planter_id')->references('id')->on('users')->onDelete('cascade');
            $table->integer('admin_id', false, true);
            $table->foreign('admin_id')->references('id')->on('users')->onDelete('cascade');
            $table->string('location', 50);
            $table->decimal('latitude', 10, 7);
            $table->decimal('longitude', 10, 7);
            $table->integer('expected_tree_count');
            $table->string('tree_species', 25);
            $table->date('scheduled_date');
            $table->timestamp('created_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('planting_activities');
    }
};
