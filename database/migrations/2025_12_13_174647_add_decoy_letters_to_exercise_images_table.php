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
        Schema::table('exercise_images', function (Blueprint $table) {
            $table->json('decoy_letters')->nullable()->after('correct_letter');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('exercise_images', function (Blueprint $table) {
            $table->dropColumn('decoy_letters');
        });
    }
};
