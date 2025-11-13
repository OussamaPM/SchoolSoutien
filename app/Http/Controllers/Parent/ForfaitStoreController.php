<?php

namespace App\Http\Controllers\Parent;

use App\Http\Controllers\Controller;
use App\Models\ChildProfile;
use App\Models\Plan;
use App\Models\PurchasedPlan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ForfaitStoreController extends Controller
{
    public function index()
    {
        $plans = Plan::orderBy('created_at', 'desc')->get();

        return Inertia::render('parent/forfaits/index', [
            'plans' => $plans,
            'activePurchasedPlans' => Auth::user()->activePurchasedPlans()->with(['childProfile', 'plan'])->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'plan_id' => 'required|exists:plans,id',
        ]);

        try {
            $plan = Plan::findOrFail($validated['plan_id']);
            Auth::user()->buyPlan($plan);
        } catch (\Throwable $e) {
            return back()->withErrors(['message' => 'Le Plan sélectionné est invalide.']);
        }

        return back();
    }

    public function storeChildProfilePlan(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'level_id' => 'required|exists:education_levels,id',
            'programme_id' => 'required|exists:education_level_categories,id',
            'purchased_plan_id' => 'required|exists:purchased_plans,id',
            'avatar_icon' => 'nullable|integer|min:0|max:9',
            'avatar_color' => 'nullable|integer|min:0|max:9',
        ]);

        try {
            $child = Auth::user()->childProfiles()->create([
                'name' => $validated['name'] ?? 'Profil Enfant',
                'education_level_id' => $validated['level_id'] ?? null,
                'class' => $validated['class'] ?? null,
                'education_level_category_id' => $validated['programme_id'] ?? null,
                'avatar_icon' => $validated['avatar_icon'] ?? 0,
                'avatar_color' => $validated['avatar_color'] ?? 0,
            ]);

            $plan = PurchasedPlan::findOrFail($validated['purchased_plan_id']);

            Auth::user()->assignPlanToChild($plan, $child);
        } catch (\Throwable $e) {
            return back()->withErrors(['message' => 'Le Plan sélectionné est invalide.']);
        }

        return back();
    }
    /**
     * Update child profile (name, avatar_icon, avatar_color only)
     */
    public function updateChildProfile(Request $request, ChildProfile $childProfile)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'avatar_icon' => 'nullable|integer|min:0|max:9',
            'avatar_color' => 'nullable|integer|min:0|max:9',
        ]);

        $childProfile->update([
            'name' => $validated['name'],
            'avatar_icon' => $validated['avatar_icon'] ?? $childProfile->avatar_icon,
            'avatar_color' => $validated['avatar_color'] ?? $childProfile->avatar_color,
        ]);

        return back();
    }
}
