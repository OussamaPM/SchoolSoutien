<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\EducationLevel;
use App\Models\EducationLevelCategory;

class EducationalProgramController extends Controller
{
    /**
     * Retrieve all education level categories.
     */
    public function getAllEducationLevelCategories()
    {
        $categories = EducationLevelCategory::query()
            ->withCount('educationLevels')
            ->get();

        return Inertia::render('admin/educational-programs/index', [
            'categories' => $categories,
        ]);
    }

    /**
     * Retrieve education levels by category.
     */
    public function getEducationLevelsByCategory(EducationLevelCategory $category)
    {
        $levels = $category->educationLevels()->get();

        return Inertia::render('admin/educational-programs/levels', [
            'levels' => $levels,
            'category' => $category,
        ]);
    }

    public function storeLevel(Request $request, EducationLevelCategory $category)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $category->educationLevels()->create($validated);

        return redirect()->route('admin.educational-programs.levels', $category)
            ->with('success', 'Niveau éducatif créé avec succès.');
    }

    public function updateLevel(Request $request, EducationLevelCategory $category, EducationLevel $level)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        if ($level) {
            $level->update([
                'name' => $validated['name'],
                'description' => $validated['description'] ?? null,
            ]);
        }

        return redirect()->route('admin.educational-programs.levels', $category)
            ->with('success', 'Niveau éducatif mis à jour avec succès.');
    }

    public function deleteLevel(EducationLevelCategory $category, EducationLevel $level)
    {
        if ($level) {
            $level->delete();
        }

        return redirect()->route('admin.educational-programs.levels', $category)
            ->with('success', 'Niveau éducatif supprimé avec succès.');
    }
}
