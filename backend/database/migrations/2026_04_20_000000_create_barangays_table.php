<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('barangays', function (Blueprint $table) {
            $table->integer('id', false, true)->primary()->autoIncrement();
            $table->string('name', 100);
            $table->string('municipality', 100);
            $table->string('province', 100);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('barangays');
    }
};
