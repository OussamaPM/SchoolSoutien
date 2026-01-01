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
        Schema::table('exercise_words', function (Blueprint $table) {
            $table->string('first_letter')->nullable()->after('audio_path');
            $table->string('second_letter')->nullable()->after('first_letter');
            $table->string('syllable')->nullable()->after('second_letter');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('exercise_words', function (Blueprint $table) {
            $table->dropColumn(['first_letter', 'second_letter', 'syllable']);
        });
    }
};
