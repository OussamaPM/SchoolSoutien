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
        Schema::create('purchased_plans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('plan_id')->constrained()->onDelete('cascade'); // Plan template
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Parent who bought it
            $table->foreignId('child_profile_id')->nullable()->constrained()->onDelete('cascade'); // Child it's assigned to (nullable)
            $table->decimal('paid_price', 8, 2); // Price paid (in case plan price changes)
            $table->timestamp('purchased_at');
            $table->timestamp('expires_at');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('purchased_plans');
    }
};
