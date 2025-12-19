<?php

namespace App\Http\Controllers;

use App\DashboardInterface;
use App\Models\EducationLevelCategory;
use App\RoleEnum;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

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
            'childProfiles' => Auth::user()->childProfiles()->with(['currentPlan.plan', 'educationLevelCategory:id,name', 'educationLevel:id,name'])->get(),
            'programmes' => EducationLevelCategory::with(['educationLevels'])->get(),
        ];
    }

    public function getTeacherData(): array
    {
        return [
            'subjects' => Auth::user()->teacherSubjects()
                ->with(['educationLevel.category'])
                ->withCount([
                    'chapters' => function ($query) {
                        $query->where('created_by', Auth::id());
                    },
                    'chapters as published_chapters_count' => function ($query) {
                        $query->where('is_active', true)->where('created_by', Auth::id());
                    },
                    'chapters as draft_chapters_count' => function ($query) {
                        $query->where('is_active', false)->where('created_by', Auth::id());
                    },
                ])
                ->get(),
        ];
    }

    public function getAdminData(): array
    {
        return [];
    }
}
