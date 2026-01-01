<?php

namespace App\Http\Controllers;

use App\Models\Affiliate;
use App\Models\AffiliateClick;
use App\Models\AffiliateCommission;
use App\Models\Plan;
use App\Models\User;
use App\RoleEnum;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class AffiliateSalesController extends Controller
{
    /**
     * Show the affiliate sales landing page.
     */
    public function landing($affiliateCode)
    {
        $affiliate = Affiliate::where('unique_code', $affiliateCode)
            ->where('is_active', true)
            ->firstOrFail();

        // Track the click
        $click = AffiliateClick::create([
            'affiliate_id' => $affiliate->id,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'referer' => request()->header('referer'),
        ]);

        // Store affiliate tracking in cookie
        $cookie = cookie(
            'affiliate_tracking',
            json_encode([
                'affiliate_id' => $affiliate->id,
                'click_id' => $click->id,
                'code' => $affiliate->unique_code,
            ]),
            config('affiliate.cookie_lifetime_days', 30) * 24 * 60 // Convert days to minutes
        );

        Cookie::queue($cookie);

        // Get all available plans
        $plans = Plan::where('is_active', true)
            ->orderBy('price')
            ->get()
            ->map(function ($plan) {
                return [
                    'id' => $plan->id,
                    'name' => $plan->name,
                    'description' => $plan->description,
                    'price' => $plan->price,
                    'duration_months' => $plan->duration_days ? intval($plan->duration_days / 30) : 1,
                    'features' => [
                        'Accès à tous les cours',
                        'Exercices interactifs',
                        'Suivi de progression',
                        'Support prioritaire',
                    ],
                ];
            });

        return Inertia::render('sales/affiliate-landing', [
            'affiliate' => [
                'code' => $affiliate->unique_code,
                'user_name' => $affiliate->user->name,
            ],
            'plans' => $plans,
            'affiliate_code' => $affiliateCode,
        ]);
    }

    /**
     * Handle affiliate signup.
     */
    public function signup(Request $request)
    {
        // Get affiliate tracking from cookie
        $tracking = json_decode(request()->cookie('affiliate_tracking'), true);

        if (!$tracking || !isset($tracking['affiliate_id'])) {
            return back()->withErrors(['error' => 'Lien d\'affiliation invalide ou expiré.']);
        }

        $affiliate = Affiliate::findOrFail($tracking['affiliate_id']);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'nullable|string|max:20',
            'password' => 'required|string|min:8|confirmed',
            'city' => 'nullable|string|max:255',
            // TODO: Add payment fields here when payment is implemented
            // 'plan_id' => 'required|exists:plans,id',
        ]);

        DB::beginTransaction();
        try {
            // Create user account
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'] ?? null,
                'password' => Hash::make($validated['password']),
                'city' => $validated['city'] ?? null,
                'role' => RoleEnum::PARENT,
                'is_active' => true,
                'affiliated_by' => $affiliate->user_id, // Link to affiliate permanently
            ]);

            // TODO: Process payment here
            // TODO: Create purchased plan for the user
            // For now, we're just creating the account

            // Mark click as converted
            if (isset($tracking['click_id'])) {
                $click = AffiliateClick::find($tracking['click_id']);
                if ($click) {
                    $click->markAsConverted($user);
                }
            }

            // TODO: Create commission record when payment is implemented
            // $this->createCommission($affiliate, $user, $purchasedPlan);

            DB::commit();

            // Log the user in
            auth()->login($user);

            // Clear the affiliate cookie
            Cookie::queue(Cookie::forget('affiliate_tracking'));

            return redirect()->route('parent.dashboard')
                ->with('success', 'Compte créé avec succès! Bienvenue.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Une erreur s\'est produite lors de la création du compte.']);
        }
    }

    /**
     * Create commission for affiliate (to be implemented with payment).
     */
    protected function createCommission(Affiliate $affiliate, User $user, $purchasedPlan)
    {
        // TODO: Implement commission creation logic
        // This will be called after successful payment
        /*
        AffiliateCommission::create([
            'affiliate_id' => $affiliate->id,
            'user_id' => $user->id,
            'purchased_plan_id' => $purchasedPlan->id,
            'type' => 'direct',
            'amount' => $purchasedPlan->paid_price * ($affiliate->commission_rate / 100),
            'purchase_amount' => $purchasedPlan->paid_price,
            'commission_rate' => $affiliate->commission_rate,
            'status' => 'pending',
        ]);

        // If affiliate was referred by another affiliate, create referral commission
        if ($affiliate->recommended_by) {
            $referrer = Affiliate::find($affiliate->recommended_by);
            AffiliateCommission::create([
                'affiliate_id' => $referrer->id,
                'user_id' => $user->id,
                'purchased_plan_id' => $purchasedPlan->id,
                'type' => 'referral',
                'amount' => $purchasedPlan->paid_price * ($referrer->referral_bonus_rate / 100),
                'purchase_amount' => $purchasedPlan->paid_price,
                'commission_rate' => $referrer->referral_bonus_rate,
                'status' => 'pending',
            ]);
        }
        */
    }
}
