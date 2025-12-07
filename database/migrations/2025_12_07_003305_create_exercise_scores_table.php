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
        Schema::create('exercise_scores', function (Blueprint $table) {
            $table->id();
            $table->foreignId('child_profile_id')->constrained()->onDelete('cascade');
            $table->foreignId('exercise_id')->constrained()->onDelete('cascade');
            $table->integer('score')->default(0);
            $table->integer('total')->default(0);
            $table->integer('percentage')->default(0);
            $table->timestamps();

            $table->index(['child_profile_id', 'exercise_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exercise_scores');
    }
};
