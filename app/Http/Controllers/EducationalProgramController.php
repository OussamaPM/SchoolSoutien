<?php

namespace App\Http\Controllers;

use App\Models\Chapter;
use App\Models\EducationalSubject;
use App\Models\EducationLevel;
use App\Models\EducationLevelCategory;
use App\RoleEnum;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

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

    public function getEducationLevelsByCategory(EducationLevelCategory $category)
    {
        $levels = $category->educationLevels()->withCount('educationSubjects')->get();

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

    public function getEducationSubjectsByLevel(EducationLevelCategory $category, EducationLevel $level)
    {
        $subjects = $level->educationSubjects()->get();

        return Inertia::render('admin/educational-programs/subjects', [
            'subjects' => $subjects,
            'level' => $level,
            'category' => $category,
        ]);
    }

    public function storeSubject(Request $request, EducationLevelCategory $category, EducationLevel $level)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $level->educationSubjects()->create($validated);

        return redirect()->route('admin.educational-programs.subjects', [$category, $level])
            ->with('success', 'Sujet éducatif créé avec succès.');
    }

    public function updateSubject(Request $request, EducationLevelCategory $category, EducationLevel $level, EducationalSubject $subject)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        if ($subject) {
            $subject->update([
                'name' => $validated['name'],
            ]);
        }

        return redirect()->route('admin.educational-programs.subjects', [$category, $level])
            ->with('success', 'Sujet éducatif mis à jour avec succès.');
    }

    public function deleteSubject(EducationLevelCategory $category, EducationLevel $level, EducationalSubject $subject)
    {
        if ($subject) {
            $subject->delete();
        }

        return redirect()->route('admin.educational-programs.subjects', [$category, $level])
            ->with('success', 'Sujet éducatif supprimé avec succès.');
    }

    public function getChaptersBySubject(EducationLevelCategory $category, EducationLevel $level, EducationalSubject $subject)
    {
        $chapters = $subject->chapters()
            ->when(auth()->user()->role == RoleEnum::TEACHER->value, function ($query) {
                $query->where('created_by', auth()->id());
            })
            ->with(['creator:id,name,email', 'lastUpdater:id,name,email'])
            ->latest()
            ->get();

        return Inertia::render('admin/educational-programs/chapters', [
            'chapters' => $chapters,
            'subject' => $subject,
            'level' => $level,
            'category' => $category,
        ]);
    }

    public function chapterWriter(EducationLevelCategory $category, EducationLevel $level, EducationalSubject $subject, ?Chapter $chapter = null)
    {
        return Inertia::render('admin/educational-programs/chapter-writer', [
            'subject' => $subject,
            'level' => $level,
            'category' => $category,
            'chapter' => $chapter,
        ]);
    }

    public function updateChapter(Request $request, EducationLevelCategory $category, EducationLevel $level, EducationalSubject $subject, ?Chapter $chapter = null)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
        ]);
        $validated['last_updated_by'] = Auth::id();

        if ($chapter) {
            $chapter->update($validated);
        } else {
            $validated['created_by'] = Auth::id();
            $subject->chapters()->create($validated);
        }

        return back();
    }

    public function deleteChapter(EducationLevelCategory $category, EducationLevel $level, EducationalSubject $subject, Chapter $chapter)
    {
        if ($chapter) {
            $chapter->delete();
        }

        return redirect()->route('admin.educational-programs.chapters', [$category, $level, $subject])
            ->with('success', 'Chapitre supprimé avec succès.');
    }

    public function updateChapterStatus(Request $request, EducationLevelCategory $category, EducationLevel $level, EducationalSubject $subject, Chapter $chapter)
    {
        $validated = $request->validate([
            'is_active' => 'required|boolean',
        ]);

        $chapter->update([
            'is_active' => $validated['is_active'],
        ]);

        return back();
    }

    public function updateChapterVideo(Request $request, EducationLevelCategory $category, EducationLevel $level, EducationalSubject $subject, Chapter $chapter)
    {
        $validated = $request->validate([
            'video_url' => 'nullable|url|max:500',
        ]);

        $chapter->update([
            'video_url' => $validated['video_url'] ?? null,
            'last_updated_by' => Auth::id(),
        ]);

        return back();
    }

    public function updateChapterAttachment(Request $request, EducationLevelCategory $category, EducationLevel $level, EducationalSubject $subject, Chapter $chapter)
    {
        $validated = $request->validate([
            'attachment' => 'required|file|mimes:pdf,doc,docx,xls,xlsx,ppt,pptx,zip|max:10240', // 10MB max
        ]);

        if ($chapter->attachment_url) {
            Storage::disk('public')->delete($chapter->attachment_url);
        }

        $path = $request->file('attachment')->store('chapter-attachments', 'public');

        $chapter->update([
            'attachment_url' => $path,
            'last_updated_by' => Auth::id(),
        ]);

        return back();
    }
}
