<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AffiliateClick extends Model
{
    use HasFactory;

    protected $fillable = [
        'affiliate_id',
        'ip_address',
        'user_agent',
        'referer',
        'converted_user_id',
        'converted_at',
    ];

    protected $casts = [
        'converted_at' => 'datetime',
    ];

    /**
     * Get the affiliate this click belongs to
     */
    public function affiliate(): BelongsTo
    {
        return $this->belongsTo(Affiliate::class);
    }

    /**
     * Get the user who converted from this click
     */
    public function convertedUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'converted_user_id');
    }

    /**
     * Mark this click as converted
     */
    public function markAsConverted(User $user): void
    {
        $this->update([
            'converted_user_id' => $user->id,
            'converted_at' => now(),
        ]);
    }

    /**
     * Check if this click has converted
     */
    public function hasConverted(): bool
    {
        return ! is_null($this->converted_user_id);
    }
}
