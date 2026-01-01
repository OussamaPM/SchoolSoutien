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
        Schema::create('affiliate_commissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('affiliate_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete(); // The customer who made the purchase
            $table->foreignId('purchased_plan_id')->nullable()->constrained()->nullOnDelete();
            $table->enum('type', ['direct', 'referral'])->default('direct'); // direct = from own customers, referral = from referred affiliate's customers
            $table->decimal('amount', 10, 2); // Commission amount in currency
            $table->decimal('purchase_amount', 10, 2); // Original purchase amount
            $table->decimal('commission_rate', 5, 2); // Rate at time of commission
            $table->enum('status', ['pending', 'paid', 'cancelled'])->default('pending');
            $table->unsignedBigInteger('invoice_id')->nullable(); // Will be linked when invoice is generated
            $table->timestamps();

            $table->index(['affiliate_id', 'created_at']);
            $table->index(['status', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('affiliate_commissions');
    }
};
