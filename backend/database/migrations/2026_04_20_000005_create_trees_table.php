<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('trees', function (Blueprint $table) {
            $table->id();
            $table->foreignId('activity_id')->constrained('planting_activities')->onDelete('cascade');
            $table->foreignId('planter_id')->constrained('users')->onDelete('cascade');
            $table->double('latitude')->nullable();
            $table->double('longitude')->nullable();
            $table->text('photo')->nullable();
            $table->timestamp('planted_at')->nullable();
            $table->timestamp('synced_at')->nullable();
            $table->enum('status', ['alive', 'dead'])->default('alive');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('trees');
    }
};
