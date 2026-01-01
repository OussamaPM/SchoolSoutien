<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AffiliateRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'recommended_by',
        'first_name',
        'last_name',
        'email',
        'phone',
        'message',
        'status',
        'rejection_reason',
        'reviewed_at',
        'reviewed_by',
    ];

    protected $casts = [
        'reviewed_at' => 'datetime',
    ];

    /**
     * Get the affiliate who recommended this request
     */
    public function recommender(): BelongsTo
    {
        return $this->belongsTo(Affiliate::class, 'recommended_by');
    }

    /**
     * Get the admin who reviewed this request
     */
    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    /**
     * Check if request is pending
     */
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    /**
     * Approve the request
     */
    public function approve(User $reviewer): void
    {
        $this->update([
            'status' => 'approved',
            'reviewed_at' => now(),
            'reviewed_by' => $reviewer->id,
        ]);
    }

    /**
     * Reject the request
     */
    public function reject(User $reviewer, string $reason = null): void
    {
        $this->update([
            'status' => 'rejected',
            'rejection_reason' => $reason,
            'reviewed_at' => now(),
            'reviewed_by' => $reviewer->id,
        ]);
    }
}
