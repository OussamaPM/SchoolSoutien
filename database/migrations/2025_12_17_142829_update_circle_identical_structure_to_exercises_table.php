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
            $table->dropColumn(['model_word', 'other_words']);
            $table->json('word_sequences')->nullable()->after('letter_options');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('exercises', function (Blueprint $table) {
            $table->dropColumn('word_sequences');
            $table->string('model_word')->nullable()->after('letter_options');
            $table->json('other_words')->nullable()->after('model_word');
        });
    }
};
