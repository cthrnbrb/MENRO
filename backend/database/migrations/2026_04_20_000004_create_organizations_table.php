<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('organizations', function (Blueprint $table) {
            $table->integer('id', false, true)->primary()->autoIncrement();
            $table->string('org_name', 50);
            $table->integer('president_id', false, true)->nullable();
            $table->foreign('president_id')->references('id')->on('users')->onDelete('set null');
            $table->string('organization_code', 6)->unique();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('organizations');
    }
};
