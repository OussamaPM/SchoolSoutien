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
        Schema::create('affiliate_invoices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('affiliate_id')->constrained()->cascadeOnDelete();
            $table->string('invoice_number')->unique();
            $table->integer('month'); // 1-12
            $table->integer('year'); // e.g., 2026
            $table->decimal('total_amount', 10, 2);
            $table->integer('total_commissions_count')->default(0);
            $table->enum('status', ['pending', 'paid'])->default('pending');
            $table->timestamp('paid_at')->nullable();
            $table->string('payment_method')->nullable();
            $table->text('payment_notes')->nullable();
            $table->string('pdf_path')->nullable();
            $table->timestamps();

            $table->index(['affiliate_id', 'year', 'month']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('affiliate_invoices');
    }
};
