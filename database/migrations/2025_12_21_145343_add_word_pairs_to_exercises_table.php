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
        Schema::table('exercises', function (Blueprint $table) {
            $table->json('word_pairs')->nullable()->after('word_sequences');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('exercises', function (Blueprint $table) {
            $table->dropColumn('word_pairs');
        });
    }
};
