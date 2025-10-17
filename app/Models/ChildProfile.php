<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ChildProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'parent_id',
        'name',
        'birth_date',
        'gender',
        'avatar',
        'notes',
        'is_active',
        'last_accessed_at',
    ];

    protected $casts = [
        'birth_date' => 'date',
        'is_active' => 'boolean',
        'last_accessed_at' => 'datetime',
    ];

    /**
     * Get the parent who owns this child profile.
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(User::class, 'parent_id');
    }

    /**
     * Get all purchased plans assigned to this child.
     */
    public function purchasedPlans(): HasMany
    {
        return $this->hasMany(PurchasedPlan::class);
    }

    /**
     * Relationship for the child's current (active, non-expired) purchased plan.
     *
     * This returns a HasOne relationship so you can eager load it with
     * ->with('currentPlan') and access it as $child->currentPlan.
     */
    public function currentPlan(): HasOne
    {
        return $this->hasOne(PurchasedPlan::class)
            ->where('is_active', true)
            ->where('expires_at', '>', now())
            ->orderBy('expires_at', 'desc');
    }

    /**
     * Get only active (non-expired) purchased plans for this child.
     */
    public function activePurchasedPlans(): HasMany
    {
        return $this->purchasedPlans()
            ->where('is_active', true)
            ->where('expires_at', '>', now());
    }

    /**
     * Check if this child profile has access to the platform.
     */
    public function hasActiveSubscription(): bool
    {
        return $this->activePurchasedPlans()->exists();
    }

    /**
     * Get the child's age.
     */
    public function getAgeAttribute(): ?int
    {
        return $this->birth_date ? $this->birth_date->age : null;
    }

    /**
     * Update last accessed timestamp.
     */
    public function updateLastAccessed(): void
    {
        $this->update(['last_accessed_at' => now()]);
    }

    /**
     * Scope for active profiles only.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
