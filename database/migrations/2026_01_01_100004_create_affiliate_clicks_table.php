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
        Schema::create('affiliate_clicks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('affiliate_id')->constrained()->cascadeOnDelete();
            $table->string('ip_address')->nullable();
            $table->string('user_agent')->nullable();
            $table->string('referer')->nullable();
            $table->foreignId('converted_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('converted_at')->nullable();
            $table->timestamps();

            $table->index(['affiliate_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('affiliate_clicks');
    }
};
