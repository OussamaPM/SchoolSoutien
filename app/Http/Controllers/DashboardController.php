<?php

namespace App\Http\Controllers;

use App\DashboardInterface;
use App\RoleEnum;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller implements DashboardInterface
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $data = RoleEnum::tryFrom(Auth::user()->role)->getCorrespondingFunction()($this);

        return Inertia::render('dashboard', [
            'data' => $data,
        ]);
    }

    public function getParentData(): array
    {
        return [
            'activeUnassignedPlans' => Auth::user()->activePurchasedPlans()->unassigned()->with(['childProfile', 'plan'])->get(),
            'childProfiles' => Auth::user()->childProfiles()->with('currentPlan.plan')->get(),
        ];
    }

    public function getTeacherData(): array
    {
        return [];
    }

    public function getAdminData(): array
    {
        return [];
    }
}
