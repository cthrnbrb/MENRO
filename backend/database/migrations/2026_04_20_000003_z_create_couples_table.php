<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('couples', function (Blueprint $table) {
            $table->integer('id', false, true)->primary()->autoIncrement();
            $table->integer('user_id', false, true);
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->integer('partner_user_id', false, true);
            $table->foreign('partner_user_id')->references('id')->on('users')->onDelete('cascade');
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
