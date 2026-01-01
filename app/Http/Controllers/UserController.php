<?php

namespace App\Http\Controllers;

use App\Models\EducationLevelCategory;
use App\Models\User;
use App\RoleEnum;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('admin/users/index', [
            'users' => User::with(['teacherSubjects.educationLevel.category'])->latest()->get(),
            'roles' => RoleEnum::allRoles(),
            'educationCategories' => EducationLevelCategory::with(['educationLevels.educationSubjects'])->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:' . User::class],
            'role' => ['required', 'string', Rule::in(RoleEnum::allRoles())],
            'city' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
            'is_active' => ['boolean'],
            'teacher_subject_ids' => ['nullable', 'array'],
            'teacher_subject_ids.*' => ['exists:educational_subjects,id'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make('password'),
            'role' => $validated['role'],
            'city' => $validated['city'] ?? null,
            'phone' => $validated['phone'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        if ($validated['role'] === RoleEnum::TEACHER->value && ! empty($validated['teacher_subject_ids'])) {
            $user->teacherSubjects()->sync($validated['teacher_subject_ids']);
        }

        if ($validated['role'] === RoleEnum::AFFILIATE->value) {
            $user->affiliate()->create([
                'commission_rate' => config('affiliate.default_commission_rate', 10.00),
                'referral_bonus_rate' => config('affiliate.default_referral_bonus_rate', 5.00),
                'is_active' => false, // Inactive until they complete onboarding
            ]);
        }

        return back();
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', Rule::unique(User::class)->ignore($user->id)],
            'role' => ['required', 'string', Rule::in(RoleEnum::allRoles())],
            'city' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
            'is_active' => ['boolean'],
            'teacher_subject_ids' => ['nullable', 'array'],
            'teacher_subject_ids.*' => ['exists:educational_subjects,id'],
        ]);

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
            'city' => $validated['city'] ?? null,
            'phone' => $validated['phone'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        if ($validated['role'] === RoleEnum::TEACHER->value) {
            $user->teacherSubjects()->sync($validated['teacher_subject_ids'] ?? []);
        } else {
            $user->teacherSubjects()->detach();
        }

        return redirect()->back()->with('success', 'Utilisateur mis à jour avec succès');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        if ($user->id === Auth::id()) {
            return redirect()->back()->withErrors(['error' => 'Vous ne pouvez pas supprimer votre propre compte']);
        }

        $user->delete();

        return redirect()->back()->with('success', 'Utilisateur supprimé avec succès');
    }
}
