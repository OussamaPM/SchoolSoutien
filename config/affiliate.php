<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Default Commission Rates
    |--------------------------------------------------------------------------
    |
    | These are the default commission rates for affiliates.
    | Rates are in percentage (e.g., 10.00 for 10%).
    |
    */

    'default_commission_rate' => env('AFFILIATE_COMMISSION_RATE', 10.00),
    'default_referral_bonus_rate' => env('AFFILIATE_REFERRAL_BONUS_RATE', 5.00),

    /*
    |--------------------------------------------------------------------------
    | Cookie Lifetime
    |--------------------------------------------------------------------------
    |
    | The number of days to keep the affiliate tracking cookie.
    | This determines how long an affiliate gets credit for a referral.
    |
    */

    'cookie_lifetime_days' => env('AFFILIATE_COOKIE_LIFETIME', 30),

    /*
    |--------------------------------------------------------------------------
    | Minimum Payout Amount
    |--------------------------------------------------------------------------
    |
    | The minimum commission amount required before an affiliate can be paid.
    |
    */

    'minimum_payout' => env('AFFILIATE_MINIMUM_PAYOUT', 50.00),

    /*
    |--------------------------------------------------------------------------
    | Invoice Settings
    |--------------------------------------------------------------------------
    |
    | Settings for generating affiliate invoices.
    |
    */

    'invoice' => [
        'auto_generate' => env('AFFILIATE_AUTO_GENERATE_INVOICES', true),
        'generation_day' => env('AFFILIATE_INVOICE_GENERATION_DAY', 1), // 1st day of month
    ],

    /*
    |--------------------------------------------------------------------------
    | Contract Settings
    |--------------------------------------------------------------------------
    |
    | Settings for affiliate contracts.
    |
    */

    'contract' => [
        'require_signature' => true,
        'template_path' => resource_path('views/affiliate/contract-template.blade.php'),
    ],

];
