<?php

namespace App\Http\Controllers\Parent;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\ChildProfile;
use Inertia\Inertia;

class ChildSessionController extends Controller
{
    public function show(ChildProfile $child)
    {
        $child->load([
            'currentPlan.plan',
            'educationLevel.educationSubjects',
            'educationLevel.category'
        ]);

        return Inertia::render('parent/child-sessions/index', [
            'child' => $child,
        ]);
    }
}
