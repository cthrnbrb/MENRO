<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('couples', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('partner_user_id')->constrained('users')->onDelete('cascade');
            $table->string('or_number', 50);
            $table->timestamp('created_at')->nullable();

            $table->unique(['user_id', 'partner_user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('couples');
    }
};
