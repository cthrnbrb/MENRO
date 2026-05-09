<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('title', 100);
            $table->text('message');
            $table->enum('type', [
                'activity_reminder',
                'activity_rescheduled',
                'activity_cancelled',
                'monitoring_schedule',
                'monitoring_reassigned',
                'tree_update_reminder',
                'certificate_ready',
                'join_request',
                'join_accepted',
                'join_rejected'
            ]);
            $table->enum('role_target', ['admin', 'staff', 'organization', 'couple']);
            $table->boolean('is_read')->default(false);
            $table->integer('related_id')->nullable();
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
