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
            $table->string('full_text')->nullable()->after('text');
            $table->integer('masked_position')->nullable()->after('full_text');
            $table->string('correct_letter', 5)->nullable()->after('masked_position');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('exercise_images', function (Blueprint $table) {
            $table->dropColumn(['full_text', 'masked_position', 'correct_letter']);
        });
    }
};
