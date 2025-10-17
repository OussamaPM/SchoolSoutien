<?php

namespace App\Http\Controllers\Parent;

use App\Models\Plan;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\ChildProfile;
use App\Models\PurchasedPlan;
use Illuminate\Support\Facades\Auth;

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
            'name' => 'nullable|string|max:255',
            'level_id' => 'nullable|exists:education_levels,id',
            'class' => 'nullable|string|max:255',
            'purchased_plan_id' => 'required|exists:purchased_plans,id',
        ]);


        try {
            $child = Auth::user()->childProfiles()->create([
                'name' => $validated['name'] ?? 'Profil Enfant',
                'education_level_id' => $validated['level_id'] ?? null,
                'class' => $validated['class'] ?? null,
            ]);

            $plan = PurchasedPlan::findOrFail($validated['purchased_plan_id']);

            Auth::user()->assignPlanToChild($plan, $child);
        } catch (\Throwable $e) {
            return back()->withErrors(['message' => 'Le Plan sélectionné est invalide.']);
        }

        return back();
    }
}
