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
        Schema::create('affiliates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('unique_code')->unique(); // Secure unique identifier for affiliate links
            $table->decimal('commission_rate', 5, 2)->default(10.00); // Percentage (e.g., 10.00 for 10%)
            $table->decimal('referral_bonus_rate', 5, 2)->default(5.00); // Bonus from referred affiliates

            // Bank Information
            $table->string('bank_name')->nullable();
            $table->string('account_holder_name')->nullable();
            $table->string('iban')->nullable();
            $table->string('swift_bic')->nullable();

            // Company Information
            $table->string('company_name')->nullable();
            $table->string('company_registration')->nullable();
            $table->string('tax_id')->nullable();
            $table->text('company_address')->nullable();

            // Contract & Activation
            $table->boolean('contract_signed')->default(false);
            $table->string('signature')->nullable(); // Signature text or path
            $table->timestamp('contract_signed_at')->nullable();
            $table->boolean('is_active')->default(false);
            $table->boolean('can_recommend')->default(false); // Can this affiliate recommend others?

            // Referral tracking
            $table->foreignId('recommended_by')->nullable()->constrained('affiliates')->nullOnDelete();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('affiliates');
    }
};
