<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Plan extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price',
        'duration_days',
        'is_active',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    protected $appends = [
        'formatted_price',
        'formatted_duration',
    ];

    /**
     * Get all purchased instances of this plan.
     */
    public function purchasedPlans(): HasMany
    {
        return $this->hasMany(PurchasedPlan::class);
    }

    /**
     * Get formatted price.
     */
    public function getFormattedPriceAttribute(): string
    {
        return number_format($this->price, 2).' €';
    }

    /**
     * Get formatted duration.
     */
    public function getFormattedDurationAttribute(): string
    {
        if ($this->duration_days == 1) {
            return '1 jour';
        } elseif ($this->duration_days == 7) {
            return '1 semaine';
        } elseif ($this->duration_days == 30) {
            return '1 mois';
        } elseif ($this->duration_days == 90) {
            return '3 mois';
        } elseif ($this->duration_days == 365) {
            return '1 an';
        }

        return $this->duration_days.' jours';
    }

    /**
     * Scope for active plans only.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
