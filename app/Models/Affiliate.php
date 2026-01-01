<?php

namespace App\Models;

use Illuminate\Support\Str;
use App\Models\AffiliateClick;
use App\Models\AffiliateCommission;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Affiliate extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'unique_code',
        'commission_rate',
        'referral_bonus_rate',
        'bank_name',
        'account_holder_name',
        'iban',
        'swift_bic',
        'company_name',
        'company_registration',
        'tax_id',
        'company_address',
        'contract_signed',
        'signature',
        'contract_signed_at',
        'is_active',
        'can_recommend',
        'recommended_by',
    ];

    protected $casts = [
        'commission_rate' => 'decimal:2',
        'referral_bonus_rate' => 'decimal:2',
        'contract_signed' => 'boolean',
        'contract_signed_at' => 'datetime',
        'is_active' => 'boolean',
        'can_recommend' => 'boolean',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($affiliate) {
            if (empty($affiliate->unique_code)) {
                $affiliate->unique_code = self::generateUniqueCode();
            }
        });
    }

    /**
     * Generate a secure unique code for the affiliate
     */
    public static function generateUniqueCode(): string
    {
        do {
            $code = Str::random(12);
        } while (self::where('unique_code', $code)->exists());

        return $code;
    }

    /**
     * Get the user associated with this affiliate
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the affiliate who recommended this affiliate
     */
    public function recommender(): BelongsTo
    {
        return $this->belongsTo(Affiliate::class, 'recommended_by');
    }

    /**
     * Get affiliates recommended by this affiliate
     */
    public function referredAffiliates(): HasMany
    {
        return $this->hasMany(Affiliate::class, 'recommended_by');
    }

    /**
     * Get all affiliate requests made by this affiliate
     */
    public function affiliateRequests(): HasMany
    {
        return $this->hasMany(AffiliateRequest::class, 'recommended_by');
    }

    /**
     * Get all clicks on this affiliate's link
     */
    public function clicks(): HasMany
    {
        return $this->hasMany(AffiliateClick::class);
    }

    /**
     * Get all commissions earned by this affiliate
     */
    public function commissions(): HasMany
    {
        return $this->hasMany(AffiliateCommission::class);
    }

    /**
     * Get all invoices for this affiliate
     */
    public function invoices(): HasMany
    {
        return $this->hasMany(AffiliateInvoice::class);
    }

    /**
     * Get users referred by this affiliate
     */
    public function referredUsers(): HasMany
    {
        return $this->hasMany(User::class, 'affiliated_by', 'user_id');
    }

    /**
     * Check if onboarding is complete
     */
    public function isOnboardingComplete(): bool
    {
        return $this->hasBankInfo() && $this->hasCompanyInfo() && $this->contract_signed;
    }

    /**
     * Check if bank information is complete
     */
    public function hasBankInfo(): bool
    {
        return !empty($this->bank_name) &&
            !empty($this->account_holder_name) &&
            !empty($this->iban);
    }

    /**
     * Check if company information is complete
     */
    public function hasCompanyInfo(): bool
    {
        return !empty($this->company_name) &&
            !empty($this->company_address);
    }

    /**
     * Get the affiliate link
     */
    public function getAffiliateLink(): string
    {
        return url("/sales/{$this->unique_code}");
    }

    /**
     * Get conversion rate
     */
    public function getConversionRate(): float
    {
        $totalClicks = $this->clicks()->count();
        if ($totalClicks === 0) {
            return 0;
        }

        $convertedClicks = $this->clicks()->whereNotNull('converted_user_id')->count();
        return round(($convertedClicks / $totalClicks) * 100, 2);
    }
}
