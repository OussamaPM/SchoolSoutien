<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AffiliateInvoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'affiliate_id',
        'invoice_number',
        'month',
        'year',
        'total_amount',
        'total_commissions_count',
        'status',
        'paid_at',
        'payment_method',
        'payment_notes',
        'pdf_path',
    ];

    protected $casts = [
        'total_amount' => 'decimal:2',
        'paid_at' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($invoice) {
            if (empty($invoice->invoice_number)) {
                $invoice->invoice_number = self::generateInvoiceNumber();
            }
        });
    }

    /**
     * Generate a unique invoice number
     */
    public static function generateInvoiceNumber(): string
    {
        $year = date('Y');
        $month = date('m');
        $count = self::whereYear('created_at', $year)
            ->whereMonth('created_at', $month)
            ->count() + 1;

        return sprintf('INV-%s%s-%04d', $year, $month, $count);
    }

    /**
     * Get the affiliate this invoice belongs to
     */
    public function affiliate(): BelongsTo
    {
        return $this->belongsTo(Affiliate::class);
    }

    /**
     * Get all commissions included in this invoice
     */
    public function commissions(): HasMany
    {
        return $this->hasMany(AffiliateCommission::class, 'invoice_id');
    }

    /**
     * Mark invoice as paid
     */
    public function markAsPaid(string $paymentMethod = null, string $notes = null): void
    {
        $this->update([
            'status' => 'paid',
            'paid_at' => now(),
            'payment_method' => $paymentMethod,
            'payment_notes' => $notes,
        ]);
    }

    /**
     * Check if invoice is pending
     */
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    /**
     * Get formatted period
     */
    public function getPeriod(): string
    {
        $monthName = date('F', mktime(0, 0, 0, $this->month, 1));
        return "{$monthName} {$this->year}";
    }
}
