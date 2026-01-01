<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AffiliateOnboardingController extends Controller
{
    /**
     * Show the onboarding page.
     */
    public function index()
    {
        $affiliate = auth()->user()->affiliate;

        if (!$affiliate) {
            abort(403, 'Affiliate profile not found');
        }

        if ($affiliate->isOnboardingComplete()) {
            return redirect()->route('affiliate.dashboard');
        }

        return Inertia::render('affiliate/onboarding/index', [
            'affiliate' => [
                'id' => $affiliate->id,
                'has_bank_info' => $affiliate->hasBankInfo(),
                'has_company_info' => $affiliate->hasCompanyInfo(),
                'contract_signed' => $affiliate->contract_signed,
                'bank_name' => $affiliate->bank_name,
                'account_holder_name' => $affiliate->account_holder_name,
                'iban' => $affiliate->iban,
                'swift_bic' => $affiliate->swift_bic,
                'company_name' => $affiliate->company_name,
                'company_registration' => $affiliate->company_registration,
                'tax_id' => $affiliate->tax_id,
                'company_address' => $affiliate->company_address,
            ],
        ]);
    }

    /**
     * Update bank information.
     */
    public function updateBankInfo(Request $request)
    {
        $affiliate = auth()->user()->affiliate;

        $validated = $request->validate([
            'bank_name' => 'required|string|max:255',
            'account_holder_name' => 'required|string|max:255',
            'iban' => 'required|string|max:34',
            'swift_bic' => 'nullable|string|max:11',
        ]);

        $affiliate->update($validated);

        return back()->with('success', 'Informations bancaires enregistrées.');
    }

    /**
     * Update company information.
     */
    public function updateCompanyInfo(Request $request)
    {
        $affiliate = auth()->user()->affiliate;

        $validated = $request->validate([
            'company_name' => 'required|string|max:255',
            'company_registration' => 'nullable|string|max:255',
            'tax_id' => 'nullable|string|max:255',
            'company_address' => 'required|string',
        ]);

        $affiliate->update($validated);

        return back()->with('success', 'Informations de société enregistrées.');
    }

    /**
     * Show the contract.
     */
    public function contract()
    {
        $affiliate = auth()->user()->affiliate;

        return Inertia::render('affiliate/onboarding/contract', [
            'affiliate' => [
                'id' => $affiliate->id,
                'user_name' => $affiliate->user->name,
                'company_name' => $affiliate->company_name,
            ],
        ]);
    }

    /**
     * Sign the contract.
     */
    public function signContract(Request $request)
    {
        $validated = $request->validate([
            'signature' => 'required|string|max:255',
        ]);

        $affiliate = auth()->user()->affiliate;

        $affiliate->update([
            'contract_signed' => true,
            'signature' => $validated['signature'],
            'contract_signed_at' => now(),
            'is_active' => true, // Activate affiliate after contract signing
        ]);

        return redirect()->route('affiliate.dashboard')
            ->with('success', 'Contrat signé avec succès. Bienvenue!');
    }
}
