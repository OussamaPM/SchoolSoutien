<?php

namespace App\Http\Controllers\Admin;

use App\RoleEnum;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Affiliate;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Models\AffiliateRequest;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;

class AffiliateController extends Controller
{
    /**
     * Display a listing of affiliates.
     */
    public function index(Request $request)
    {
        $query = Affiliate::with(['user', 'recommender.user'])
            ->latest();

        // Search
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Filter by status
        if ($request->has('status')) {
            if ($request->status === 'active') {
                $query->where('is_active', true);
            } elseif ($request->status === 'inactive') {
                $query->where('is_active', false);
            }
        }

        $affiliates = $query->paginate(20)->through(function ($affiliate) {
            return [
                'id' => $affiliate->id,
                'user' => [
                    'id' => $affiliate->user->id,
                    'name' => $affiliate->user->name,
                    'email' => $affiliate->user->email,
                    'phone' => $affiliate->user->phone,
                ],
                'unique_code' => $affiliate->unique_code,
                'commission_rate' => $affiliate->commission_rate,
                'referral_bonus_rate' => $affiliate->referral_bonus_rate,
                'is_active' => $affiliate->is_active,
                'can_recommend' => $affiliate->can_recommend,
                'onboarding_complete' => $affiliate->isOnboardingComplete(),
                'total_clicks' => $affiliate->clicks()->count(),
                'total_conversions' => $affiliate->clicks()->whereNotNull('converted_user_id')->count(),
                'total_commissions' => $affiliate->commissions()->sum('amount'),
                'recommended_by' => $affiliate->recommender ? [
                    'id' => $affiliate->recommender->id,
                    'name' => $affiliate->recommender->user->name,
                ] : null,
                'created_at' => $affiliate->created_at->format('Y-m-d'),
            ];
        });

        // Get pending requests count
        $pendingRequestsCount = AffiliateRequest::where('status', 'pending')->count();

        return Inertia::render('admin/affiliates/index', [
            'affiliates' => $affiliates,
            'filters' => $request->only(['search', 'status']),
            'pendingRequestsCount' => $pendingRequestsCount,
        ]);
    }

    /**
     * Show the form for creating a new affiliate.
     */
    public function create()
    {
        return Inertia::render('admin/affiliates/create');
    }

    /**
     * Store a newly created affiliate.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'nullable|string|max:20',
            'commission_rate' => 'required|numeric|min:0|max:100',
            'can_recommend' => 'boolean',
        ]);

        DB::beginTransaction();
        try {
            // Create user account
            $user = User::create([
                'name' => $validated['first_name'] . ' ' . $validated['last_name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'] ?? null,
                'password' => Hash::make('password'),
                'role' => RoleEnum::AFFILIATE,
                'is_active' => true,
            ]);

            // Create affiliate profile
            $affiliate = Affiliate::create([
                'user_id' => $user->id,
                'commission_rate' => $validated['commission_rate'],
                'referral_bonus_rate' => config('affiliate.default_referral_bonus_rate'),
                'can_recommend' => $validated['can_recommend'] ?? false,
            ]);

            DB::commit();

            // TODO: Send welcome email with password reset link

            return redirect()->route('admin.affiliates.index')
                ->with('success', 'Affilié créé avec succès. Un email a été envoyé avec les instructions de connexion.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Une erreur s\'est produite lors de la création de l\'affilié.']);
        }
    }

    /**
     * Show the form for editing an affiliate.
     */
    public function edit(Affiliate $affiliate)
    {
        return Inertia::render('admin/affiliates/edit', [
            'affiliate' => [
                'id' => $affiliate->id,
                'user' => [
                    'id' => $affiliate->user->id,
                    'name' => $affiliate->user->name,
                    'email' => $affiliate->user->email,
                    'phone' => $affiliate->user->phone,
                ],
                'commission_rate' => $affiliate->commission_rate,
                'referral_bonus_rate' => $affiliate->referral_bonus_rate,
                'is_active' => $affiliate->is_active,
                'can_recommend' => $affiliate->can_recommend,
                'unique_code' => $affiliate->unique_code,
            ],
        ]);
    }

    /**
     * Update the specified affiliate.
     */
    public function update(Request $request, Affiliate $affiliate)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', Rule::unique('users', 'email')->ignore($affiliate->user_id)],
            'phone' => 'nullable|string|max:20',
            'commission_rate' => 'required|numeric|min:0|max:100',
            'can_recommend' => 'boolean',
            'is_active' => 'boolean',
        ]);

        DB::beginTransaction();
        try {
            // Update user
            $affiliate->user->update([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'] ?? null,
            ]);

            // Update affiliate
            $affiliate->update([
                'commission_rate' => $validated['commission_rate'],
                'can_recommend' => $validated['can_recommend'] ?? false,
                'is_active' => $validated['is_active'] ?? true,
            ]);

            DB::commit();

            return redirect()->route('admin.affiliates.index')
                ->with('success', 'Affilié mis à jour avec succès.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Une erreur s\'est produite lors de la mise à jour.']);
        }
    }

    /**
     * Remove the specified affiliate.
     */
    public function destroy(Affiliate $affiliate)
    {
        try {
            $affiliate->user->delete(); // This will cascade delete the affiliate
            return redirect()->route('admin.affiliates.index')
                ->with('success', 'Affilié supprimé avec succès.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Une erreur s\'est produite lors de la suppression.']);
        }
    }

    /**
     * Display pending affiliate requests.
     */
    public function requests(Request $request)
    {
        $query = AffiliateRequest::with(['recommender.user'])
            ->where('status', 'pending')
            ->latest();

        $requests = $query->paginate(20)->through(function ($affiliateRequest) {
            return [
                'id' => $affiliateRequest->id,
                'first_name' => $affiliateRequest->first_name,
                'last_name' => $affiliateRequest->last_name,
                'email' => $affiliateRequest->email,
                'phone' => $affiliateRequest->phone,
                'message' => $affiliateRequest->message,
                'recommended_by' => [
                    'id' => $affiliateRequest->recommender->id,
                    'name' => $affiliateRequest->recommender->user->name,
                    'email' => $affiliateRequest->recommender->user->email,
                ],
                'created_at' => $affiliateRequest->created_at->format('Y-m-d H:i'),
            ];
        });

        return Inertia::render('admin/affiliates/requests', [
            'requests' => $requests,
        ]);
    }

    /**
     * Approve an affiliate request.
     */
    public function approveRequest(AffiliateRequest $request)
    {
        DB::beginTransaction();
        try {
            // Create user account
            $user = User::create([
                'name' => $request->first_name . ' ' . $request->last_name,
                'email' => $request->email,
                'phone' => $request->phone,
                'password' => Hash::make('password'),
                'role' => RoleEnum::AFFILIATE,
                'is_active' => true,
            ]);

            // Create affiliate profile
            $affiliate = Affiliate::create([
                'user_id' => $user->id,
                'commission_rate' => config('affiliate.default_commission_rate'),
                'referral_bonus_rate' => config('affiliate.default_referral_bonus_rate'),
                'recommended_by' => $request->recommended_by,
                'can_recommend' => false, // New affiliates can't recommend by default
            ]);

            // Approve the request
            $request->approve(auth()->user());

            DB::commit();

            // TODO: Send welcome email to new affiliate
            // TODO: Send notification to recommender

            return redirect()->route('admin.affiliates.requests')
                ->with('success', 'Demande approuvée et affilié créé avec succès.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Une erreur s\'est produite lors de l\'approbation.']);
        }
    }

    /**
     * Reject an affiliate request.
     */
    public function rejectRequest(Request $request, AffiliateRequest $affiliateRequest)
    {
        $validated = $request->validate([
            'rejection_reason' => 'nullable|string|max:500',
        ]);

        $affiliateRequest->reject(
            auth()->user(),
            $validated['rejection_reason'] ?? null
        );

        // TODO: Send notification to recommender

        return redirect()->route('admin.affiliates.requests')
            ->with('success', 'Demande rejetée.');
    }
}
