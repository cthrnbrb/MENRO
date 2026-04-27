<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('trees', function (Blueprint $table) {
            $table->integer('id', false, true)->primary()->autoIncrement();
            $table->integer('activity_id', false, true);
            $table->foreign('activity_id')->references('id')->on('planting_activities')->onDelete('cascade');
            $table->integer('planter_id', false, true);
            $table->foreign('planter_id')->references('id')->on('users')->onDelete('cascade');
            $table->decimal('latitude', 10, 7);
            $table->decimal('longitude', 10, 7);
            $table->text('photo');
            $table->timestamp('planted_at');
            $table->timestamp('synced_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('trees');
    }
};
