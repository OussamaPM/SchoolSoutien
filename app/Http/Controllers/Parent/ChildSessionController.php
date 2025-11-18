<?php

namespace App\Http\Controllers\Parent;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\ChildProfile;
use App\Models\EducationalSubject;
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

    public function learnSubject(ChildProfile $child, EducationalSubject $subject)
    {
        if (!$subject) {
            return back()->withErrors(['message' => 'Matière non trouvée.']);
        }

        $child->load([
            'currentPlan.plan',
            'educationLevel.educationSubjects.chapters',
            'educationLevel.category'
        ]);

        $subject->load(['chapters' => function ($query) {
            $query->active()->orderByPosition();
        }]);

        return Inertia::render('parent/child-sessions/learn-subject', [
            'child' => $child,
            'subject' => $subject,
        ]);
    }
}
