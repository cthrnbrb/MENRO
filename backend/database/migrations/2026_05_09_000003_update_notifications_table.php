<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('notifications', function (Blueprint $table) {
            // Update role_target enum to change 'staff' to 'monitoring staff'
            $table->enum('role_target', ['admin', 'monitoring staff', 'organization', 'couple'])->change();
        });
    }

    public function down(): void
    {
        Schema::table('notifications', function (Blueprint $table) {
            // Revert to 'staff'
            $table->enum('role_target', ['admin', 'staff', 'organization', 'couple'])->change();
        });
    }
};
