<?php

namespace App\Http\Controllers;

use App\Models\Chapter;
use App\Models\EducationalSubject;
use App\Models\EducationLevel;
use App\Models\EducationLevelCategory;
use App\Models\Quiz;
use App\Models\Exercise;
use App\Models\ExerciseImage;
use App\Models\QuizQuestion;
use App\Models\QuizAnswer;
use App\RoleEnum;
use App\ExerciseTypeEnum;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Spatie\Image\Image;

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
            ->with(['creator:id,name,email', 'lastUpdater:id,name,email', 'quiz:id,chapter_id,title', 'exercises:id,chapter_id,type'])
            ->orderByPosition()
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
        if ($chapter) {
            $chapter->load(['quiz:id,chapter_id,title', 'exercises:id,chapter_id,type']);
        }

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

    public function moveChapterUp(Request $request, EducationLevelCategory $category, EducationLevel $level, EducationalSubject $subject, Chapter $chapter)
    {
        $chapter->moveUp();

        return back();
    }

    public function moveChapterDown(Request $request, EducationLevelCategory $category, EducationLevel $level, EducationalSubject $subject, Chapter $chapter)
    {
        $chapter->moveDown();

        return back();
    }

    public function manageQuiz(EducationLevelCategory $category, EducationLevel $level, EducationalSubject $subject, Chapter $chapter)
    {
        $quiz = $chapter->quiz()->with(['questions.answers'])->first();

        return Inertia::render('admin/educational-programs/quiz-manager', [
            'category' => $category,
            'level' => $level,
            'subject' => $subject,
            'chapter' => $chapter,
            'quiz' => $quiz,
        ]);
    }

    public function storeQuiz(Request $request, EducationLevelCategory $category, EducationLevel $level, EducationalSubject $subject, Chapter $chapter)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'questions' => 'required|array|min:1',
            'questions.*.question' => 'required|string',
            'questions.*.answers' => 'required|array|min:2',
            'questions.*.answers.*.answer' => 'required|string',
            'questions.*.answers.*.is_correct' => 'required|boolean',
        ]);

        $quiz = $chapter->quiz()->create([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
        ]);

        foreach ($validated['questions'] as $index => $questionData) {
            $question = $quiz->questions()->create([
                'question' => $questionData['question'],
                'position' => $index,
            ]);

            foreach ($questionData['answers'] as $answerIndex => $answerData) {
                $question->answers()->create([
                    'answer' => $answerData['answer'],
                    'is_correct' => $answerData['is_correct'],
                    'position' => $answerIndex,
                ]);
            }
        }

        return redirect()->route('admin.educational-programs.chapter.quiz', [
            'category' => $category->id,
            'level' => $level->id,
            'subject' => $subject->id,
            'chapter' => $chapter->id,
        ])->with('success', 'Quiz créé avec succès.');
    }

    public function updateQuiz(Request $request, EducationLevelCategory $category, EducationLevel $level, EducationalSubject $subject, Chapter $chapter, Quiz $quiz)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'questions' => 'required|array|min:1',
            'questions.*.id' => 'nullable|exists:quiz_questions,id',
            'questions.*.question' => 'required|string',
            'questions.*.answers' => 'required|array|min:2',
            'questions.*.answers.*.id' => 'nullable|exists:quiz_answers,id',
            'questions.*.answers.*.answer' => 'required|string',
            'questions.*.answers.*.is_correct' => 'required|boolean',
        ]);

        $quiz->update([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
        ]);

        $quiz->questions()->delete();

        foreach ($validated['questions'] as $index => $questionData) {
            $question = $quiz->questions()->create([
                'question' => $questionData['question'],
                'position' => $index,
            ]);

            foreach ($questionData['answers'] as $answerIndex => $answerData) {
                $question->answers()->create([
                    'answer' => $answerData['answer'],
                    'is_correct' => $answerData['is_correct'],
                    'position' => $answerIndex,
                ]);
            }
        }

        return redirect()->route('admin.educational-programs.chapter.quiz', [
            'category' => $category->id,
            'level' => $level->id,
            'subject' => $subject->id,
            'chapter' => $chapter->id,
        ])->with('success', 'Quiz mis à jour avec succès.');
    }

    public function deleteQuiz(EducationLevelCategory $category, EducationLevel $level, EducationalSubject $subject, Chapter $chapter, Quiz $quiz)
    {
        $quiz->delete();

        return redirect()->route('admin.educational-programs.chapters', [
            'category' => $category->id,
            'level' => $level->id,
            'subject' => $subject->id,
        ])->with('success', 'Quiz supprimé avec succès.');
    }

    public function manageExercises(EducationLevelCategory $category, EducationLevel $level, EducationalSubject $subject, Chapter $chapter)
    {
        $chapter->load(['exercises.images']);

        $exerciseTypes = collect(ExerciseTypeEnum::cases())->map(fn($type) => [
            'value' => $type->value,
            'label' => $type->label(),
            'description' => $type->description(),
        ]);

        return Inertia::render('admin/educational-programs/manage-exercises', [
            'category' => $category,
            'level' => $level,
            'subject' => $subject,
            'chapter' => $chapter,
            'exerciseTypes' => $exerciseTypes,
        ]);
    }

    public function storeExercise(Request $request, EducationLevelCategory $category, EducationLevel $level, EducationalSubject $subject, Chapter $chapter)
    {
        $validated = $request->validate([
            'type' => 'required|string',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $position = $chapter->exercises()->max('position') + 1;

        $exercise = $chapter->exercises()->create([
            'type' => ExerciseTypeEnum::from($validated['type']),
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'position' => $position,
        ]);

        return back()->with('success', 'Exercice créé avec succès');
    }

    public function updateExercise(Request $request, EducationLevelCategory $category, EducationLevel $level, EducationalSubject $subject, Chapter $chapter, Exercise $exercise)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $exercise->update($validated);

        return back()->with('success', 'Exercice mis à jour avec succès');
    }

    public function deleteExercise(EducationLevelCategory $category, EducationLevel $level, EducationalSubject $subject, Chapter $chapter, Exercise $exercise)
    {
        $exercise->delete();

        return back()->with('success', 'Exercice supprimé avec succès');
    }

    public function storeExerciseImage(Request $request, EducationLevelCategory $category, EducationLevel $level, EducationalSubject $subject, Chapter $chapter, Exercise $exercise)
    {
        $validated = $request->validate([
            'image' => 'required|image|max:2048',
            'audio' => 'required|file|mimes:mp3,wav,ogg,webm|max:5120',
            'is_correct' => 'required|boolean',
        ]);

        $imagePath = $request->file('image')->store('exercises/images', 'public');
        $fullImagePath = storage_path('app/public/' . $imagePath);

        Image::load($fullImagePath)
            ->optimize()
            ->format('webp')
            ->save();

        $webpPath = str_replace(['.jpg', '.jpeg', '.png'], '.webp', $imagePath);
        if ($imagePath !== $webpPath) {
            Storage::disk('public')->move($imagePath, $webpPath);
            $imagePath = $webpPath;
        }

        $audioPath = $request->file('audio')->store('exercises/audio', 'public');

        $position = $exercise->images()->max('position') + 1;

        $exercise->images()->create([
            'image_path' => $imagePath,
            'audio_path' => $audioPath,
            'is_correct' => $validated['is_correct'],
            'position' => $position,
        ]);

        return back()->with('success', 'Image ajoutée avec succès');
    }

    public function updateExerciseImage(Request $request, EducationLevelCategory $category, EducationLevel $level, EducationalSubject $subject, Chapter $chapter, Exercise $exercise, ExerciseImage $image)
    {
        $validated = $request->validate([
            'is_correct' => 'required|boolean',
        ]);

        $image->update($validated);

        return back()->with('success', 'Image mise à jour avec succès');
    }

    public function deleteExerciseImage(EducationLevelCategory $category, EducationLevel $level, EducationalSubject $subject, Chapter $chapter, Exercise $exercise, ExerciseImage $image)
    {
        Storage::disk('public')->delete($image->image_path);
        Storage::disk('public')->delete($image->audio_path);

        $image->delete();

        return back()->with('success', 'Image supprimée avec succès');
    }
}
