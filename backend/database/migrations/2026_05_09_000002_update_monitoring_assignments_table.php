<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('monitoring_assignments', function (Blueprint $table) {
            // Make target_year and target_quarter NOT NULL
            $table->integer('target_year')->nullable(false)->change();
            $table->integer('target_quarter')->nullable(false)->change();
        });
    }

    public function down(): void
    {
        Schema::table('monitoring_assignments', function (Blueprint $table) {
            // Revert to nullable
            $table->integer('target_year')->nullable()->change();
            $table->integer('target_quarter')->nullable()->change();
        });
    }
};
