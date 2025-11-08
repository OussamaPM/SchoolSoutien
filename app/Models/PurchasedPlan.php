<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PurchasedPlan extends Model
{
    use HasFactory;

    protected $fillable = [
        'plan_id',
        'user_id',
        'child_profile_id',
        'paid_price',
        'purchased_at',
        'expires_at',
        'is_active',
    ];

    protected $casts = [
        'paid_price' => 'decimal:2',
        'purchased_at' => 'datetime',
        'expires_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    protected $appends = [
        'still_going',
        'remaining_days',
    ];

    /**
     * Get the plan template this purchase is based on.
     */
    public function plan(): BelongsTo
    {
        return $this->belongsTo(Plan::class);
    }

    /**
     * Get the parent who purchased this plan.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the child profile this plan is assigned to.
     */
    public function childProfile(): BelongsTo
    {
        return $this->belongsTo(ChildProfile::class);
    }

    /**
     * Check if this purchased plan is currently active.
     */
    public function isActive(): bool
    {
        return $this->is_active && $this->expires_at > now();
    }

    /**
     * Check if this purchased plan has expired.
     */
    public function isExpired(): bool
    {
        return $this->expires_at <= now();
    }

    public function getStillGoingAttribute(): bool
    {
        return ! $this->isExpired();
    }

    /**
     * Get remaining days until expiration.
     */
    public function getRemainingDaysAttribute(): int
    {
        if ($this->isExpired()) {
            return 0;
        }

        return now()->diffInDays($this->expires_at, false);
    }

    /**
     * Assign this purchased plan to a child profile.
     */
    public function assignToChild(ChildProfile $child): void
    {
        // Make sure the child belongs to the same parent
        if ($child->parent_id !== $this->user_id) {
            throw new \InvalidArgumentException('Child does not belong to the plan purchaser.');
        }

        $this->update(['child_profile_id' => $child->id]);
    }

    /**
     * Unassign this plan from its child profile.
     */
    public function unassignFromChild(): void
    {
        $this->update(['child_profile_id' => null]);
    }

    /**
     * Scope for active purchases only.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true)
            ->where('expires_at', '>', now());
    }

    /**
     * Scope for unassigned purchases.
     */
    public function scopeUnassigned($query)
    {
        return $query->whereNull('child_profile_id');
    }

    /**
     * Scope for assigned purchases.
     */
    public function scopeAssigned($query)
    {
        return $query->whereNotNull('child_profile_id');
    }
}
