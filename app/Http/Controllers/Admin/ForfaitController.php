<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ForfaitController extends Controller
{
    /**
     * Display a listing of the plans.
     */
    public function index()
    {
        $plans = Plan::orderBy('created_at', 'desc')->get();

        return Inertia::render('admin/forfaits/index', [
            'plans' => $plans,
        ]);
    }

    /**
     * Show the form for creating a new plan.
     */
    public function create()
    {
        return Inertia::render('admin/forfaits/create');
    }

    /**
     * Store a newly created plan in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'duration_days' => 'required|integer|min:1',
            'is_active' => 'boolean',
        ]);

        Plan::create($validated);

        return redirect()->route('admin.forfaits.index')
            ->with('success', 'Forfait créé avec succès.');
    }

    /**
     * Show the form for editing the specified plan.
     */
    public function edit(Plan $forfait)
    {
        return Inertia::render('admin/forfaits/edit', [
            'plan' => $forfait,
        ]);
    }

    /**
     * Update the specified plan in storage.
     */
    public function update(Request $request, Plan $forfait)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'duration_days' => 'required|integer|min:1',
            'is_active' => 'boolean',
        ]);

        $forfait->update($validated);

        return redirect()->route('admin.forfaits.index')
            ->with('success', 'Forfait mis à jour avec succès.');
    }

    /**
     * Remove the specified plan from storage.
     */
    public function destroy(Plan $forfait)
    {
        $forfait->delete();

        return redirect()->route('admin.forfaits.index')
            ->with('success', 'Forfait supprimé avec succès.');
    }
}
