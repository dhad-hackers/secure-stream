<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('video_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')
                  ->constrained('courses')
                  ->onDelete('cascade');
            $table->foreignId('user_id')
                  ->constrained('users')
                  ->onDelete('cascade');
            $table->timestamp('accessed_at');
            $table->timestamps();
            
            // Add indexes for better query performance
            $table->index('course_id');
            $table->index('user_id');
            $table->index('accessed_at');
            $table->index(['user_id', 'course_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('video_logs');
    }
};