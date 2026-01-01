<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AffiliateCommission extends Model
{
    use HasFactory;

    protected $fillable = [
        'affiliate_id',
        'user_id',
        'purchased_plan_id',
        'type',
        'amount',
        'purchase_amount',
        'commission_rate',
        'status',
        'invoice_id',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'purchase_amount' => 'decimal:2',
        'commission_rate' => 'decimal:2',
    ];

    /**
     * Get the affiliate who earned this commission
     */
    public function affiliate(): BelongsTo
    {
        return $this->belongsTo(Affiliate::class);
    }

    /**
     * Get the user who made the purchase
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the purchased plan
     */
    public function purchasedPlan(): BelongsTo
    {
        return $this->belongsTo(PurchasedPlan::class);
    }

    /**
     * Get the invoice this commission belongs to
     */
    public function invoice(): BelongsTo
    {
        return $this->belongsTo(AffiliateInvoice::class, 'invoice_id');
    }

    /**
     * Mark commission as paid
     */
    public function markAsPaid(AffiliateInvoice $invoice): void
    {
        $this->update([
            'status' => 'paid',
            'invoice_id' => $invoice->id,
        ]);
    }

    /**
     * Cancel commission
     */
    public function cancel(): void
    {
        $this->update(['status' => 'cancelled']);
    }

    /**
     * Check if commission is pending
     */
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }
}
