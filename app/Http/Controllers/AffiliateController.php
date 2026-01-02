<?php

namespace App\Http\Controllers;

use App\Models\Affiliate;
use App\Models\AffiliateRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AffiliateController extends Controller
{
    /**
     * Get authenticated affiliate or fail
     */
    protected function getAffiliate()
    {
        return auth()->user()->affiliate ?? abort(403, 'Affiliate profile not found');
    }

    /**
     * Show the affiliate dashboard.
     */
    public function dashboard(Request $request)
    {
        $affiliate = $this->getAffiliate();

        // Check if onboarding is complete
        if (!$affiliate->isOnboardingComplete()) {
            return redirect()->route('affiliate.onboarding');
        }

        // Get filter params
        $year = $request->input('year', date('Y'));
        $month = $request->input('month');

        // Build commissions query
        $commissionsQuery = $affiliate->commissions()
            ->whereYear('created_at', $year);

        if ($month) {
            $commissionsQuery->whereMonth('created_at', $month);
        }

        // Calculate stats
        $totalClicks = $affiliate->clicks()
            ->whereYear('created_at', $year)
            ->when($month, fn($q) => $q->whereMonth('created_at', $month))
            ->count();

        $totalConversions = $affiliate->clicks()
            ->whereNotNull('converted_user_id')
            ->whereYear('created_at', $year)
            ->when($month, fn($q) => $q->whereMonth('created_at', $month))
            ->count();

        $totalCommissions = $commissionsQuery->sum('amount');
        $pendingCommissions = $commissionsQuery->where('status', 'pending')->sum('amount');
        $paidCommissions = $commissionsQuery->where('status', 'paid')->sum('amount');

        $activeSubscribers = $affiliate->referredUsers()
            ->where('role', 'parent')
            ->whereHas('activePurchasedPlans')
            ->count();

        $conversionRate = $totalClicks > 0 ? round(($totalConversions / $totalClicks) * 100, 2) : 0;

        // Get monthly data for chart (last 12 months or current year)
        $monthlyData = $affiliate->commissions()
            ->select(
                DB::raw('YEAR(created_at) as year'),
                DB::raw('MONTH(created_at) as month'),
                DB::raw('SUM(amount) as total'),
                DB::raw('COUNT(*) as count')
            )
            ->whereYear('created_at', $year)
            ->groupBy('year', 'month')
            ->orderBy('year')
            ->orderBy('month')
            ->get()
            ->map(function ($item) {
                return [
                    'month' => $item->month,
                    'year' => $item->year,
                    'total' => (float) $item->total,
                    'count' => $item->count,
                    'label' => date('M', mktime(0, 0, 0, $item->month, 1)),
                ];
            });

        // Fill missing months with zeros
        $filledMonthlyData = collect(range(1, 12))->map(function ($month) use ($monthlyData, $year) {
            $existing = $monthlyData->firstWhere('month', $month);
            return $existing ?? [
                'month' => $month,
                'year' => $year,
                'total' => 0,
                'count' => 0,
                'label' => date('M', mktime(0, 0, 0, $month, 1)),
            ];
        });

        // Get available years for filter
        $years = $affiliate->commissions()
            ->selectRaw('DISTINCT YEAR(created_at) as year')
            ->pluck('year')
            ->toArray();

        // Add current year if not present
        if (!in_array((int) $year, $years)) {
            $years[] = (int) $year;
        }
        sort($years);

        return Inertia::render('affiliate/dashboard', [
            'affiliate' => [
                'id' => $affiliate->id,
                'unique_code' => $affiliate->unique_code,
                'affiliate_link' => $affiliate->getAffiliateLink(),
                'commission_rate' => $affiliate->commission_rate,
                'can_recommend' => $affiliate->can_recommend,
            ],
            'stats' => [
                'total_clicks' => $totalClicks,
                'total_conversions' => $totalConversions,
                'conversion_rate' => $conversionRate,
                'active_subscribers' => $activeSubscribers,
                'total_commissions' => $totalCommissions,
                'pending_commissions' => $pendingCommissions,
                'paid_commissions' => $paidCommissions,
                'avg_commission' => $totalConversions > 0 ? $totalCommissions / $totalConversions : 0,
            ],
            'chartData' => $filledMonthlyData->map(function ($item) {
                return [
                    'month' => $item['label'],
                    'commissions' => $item['total'],
                    'clicks' => 0, // You can add click data if needed
                    'conversions' => 0, // You can add conversion data if needed
                ];
            }),
            'years' => $years,
        ]);
    }

    /**
     * Show personal information page.
     */
    public function profile()
    {
        $affiliate = $this->getAffiliate();

        return Inertia::render('affiliate/profile', [
            'affiliate' => [
                'id' => $affiliate->id,
                'user' => [
                    'name' => $affiliate->user->name,
                    'email' => $affiliate->user->email,
                    'phone' => $affiliate->user->phone,
                ],
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
     * Update personal information.
     */
    public function updateProfile(Request $request)
    {
        $affiliate = $this->getAffiliate();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $affiliate->user_id,
            'phone' => 'nullable|string|max:20',
            'bank_name' => 'required|string|max:255',
            'account_holder_name' => 'required|string|max:255',
            'iban' => 'required|string|max:34',
            'swift_bic' => 'nullable|string|max:11',
            'company_name' => 'required|string|max:255',
            'company_registration' => 'nullable|string|max:255',
            'tax_id' => 'nullable|string|max:255',
            'company_address' => 'required|string',
        ]);

        DB::beginTransaction();
        try {
            // Update user
            $affiliate->user->update([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'],
            ]);

            // Update affiliate
            $affiliate->update([
                'bank_name' => $validated['bank_name'],
                'account_holder_name' => $validated['account_holder_name'],
                'iban' => $validated['iban'],
                'swift_bic' => $validated['swift_bic'],
                'company_name' => $validated['company_name'],
                'company_registration' => $validated['company_registration'],
                'tax_id' => $validated['tax_id'],
                'company_address' => $validated['company_address'],
            ]);

            DB::commit();

            return back()->with('success', 'Informations mises à jour avec succès.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Une erreur s\'est produite.']);
        }
    }

    /**
     * Show invoices page.
     */
    public function invoices()
    {
        $affiliate = $this->getAffiliate();

        $invoices = $affiliate->invoices()
            ->latest()
            ->paginate(20)
            ->through(function ($invoice) {
                return [
                    'id' => $invoice->id,
                    'invoice_number' => $invoice->invoice_number,
                    'period' => $invoice->getPeriod(),
                    'month' => $invoice->month,
                    'year' => $invoice->year,
                    'total_amount' => $invoice->total_amount,
                    'total_commissions_count' => $invoice->total_commissions_count,
                    'status' => $invoice->status,
                    'paid_at' => $invoice->paid_at?->format('Y-m-d'),
                    'payment_method' => $invoice->payment_method,
                    'created_at' => $invoice->created_at->format('Y-m-d'),
                ];
            });

        return Inertia::render('affiliate/invoices', [
            'invoices' => $invoices,
        ]);
    }

    /**
     * Download invoice PDF.
     */
    public function downloadInvoice($invoiceId)
    {
        $affiliate = $this->getAffiliate();
        $invoice = $affiliate->invoices()->findOrFail($invoiceId);

        // TODO: Generate and return PDF
        // For now, return a placeholder
        return back()->with('info', 'Génération de PDF à implémenter.');
    }

    /**
     * Show recommend affiliate form.
     */
    public function recommendForm()
    {
        $affiliate = $this->getAffiliate();

        if (!$affiliate->can_recommend) {
            abort(403, 'Vous n\'avez pas la permission de recommander d\'autres affiliés.');
        }

        return Inertia::render('affiliate/recommend');
    }

    /**
     * Submit affiliate recommendation.
     */
    public function submitRecommendation(Request $request)
    {
        $affiliate = $this->getAffiliate();

        if (!$affiliate->can_recommend) {
            abort(403, 'Vous n\'avez pas la permission de recommander d\'autres affiliés.');
        }

        $validated = $request->validate([
            'candidate_name' => 'required|string|max:255',
            'candidate_email' => 'required|email|unique:users,email|unique:affiliate_requests,email',
            'candidate_phone' => 'nullable|string|max:20',
            'message' => 'nullable|string|max:1000',
        ]);

        AffiliateRequest::create([
            'recommended_by' => $affiliate->id,
            'first_name' => str($validated['candidate_name'])->before(' ')->toString(),
            'last_name' => str($validated['candidate_name'])->after(' ')->toString(),
            'email' => $validated['candidate_email'],
            'phone' => $validated['candidate_phone'],
            'message' => $validated['message'],
        ]);

        return back()->with('success', 'Demande de recommandation soumise avec succès.');
    }
}
