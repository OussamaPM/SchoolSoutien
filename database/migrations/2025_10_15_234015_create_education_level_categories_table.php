<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('education_level_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        if (Schema::hasTable('education_level_categories')) {
            DB::table('education_level_categories')->insert([
                ['name' => 'Primaire', 'description' => 'Niveau scolaire primaire', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
                ['name' => 'Collège', 'description' => 'Niveau scolaire collège', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
                ['name' => 'Lycée', 'description' => 'Niveau scolaire lycée', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('education_level_categories');
    }
};
