<?php

namespace App\Http\Controllers\Parent;

use App\Http\Controllers\Controller;
use App\Models\Chapter;
use App\Models\ChildProfile;
use App\Models\EducationalSubject;
use App\Models\Exercise;
use App\Models\Quiz;
use App\Models\QuizAttempt;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ChildSessionController extends Controller
{
    public function show(ChildProfile $child)
    {
        $child->load([
            'currentPlan.plan',
            'educationLevel.educationSubjects',
            'educationLevel.category',
        ]);

        return Inertia::render('parent/child-sessions/index', [
            'child' => $child,
        ]);
    }

    public function learnSubject(ChildProfile $child, EducationalSubject $subject)
    {
        if (! $subject) {
            return back()->withErrors(['message' => 'Matière non trouvée.']);
        }

        $child->load([
            'currentPlan.plan',
            'educationLevel.educationSubjects.chapters',
            'educationLevel.category',
        ]);

        $subject->load([
            'chapters' => function ($query) {
                $query->active()->orderByPosition();
            },
            'chapters.quiz',
            'chapters.exercises',
        ]);

        return Inertia::render('parent/child-sessions/learn-subject', [
            'child' => $child,
            'subject' => $subject,
        ]);
    }

    public function viewChapter(ChildProfile $child, EducationalSubject $subject, Chapter $chapter)
    {
        if ($chapter->educational_subject_id !== $subject->id || ! $chapter->is_active) {
            return back()->withErrors(['message' => 'Chapitre non disponible.']);
        }

        $child->load([
            'currentPlan.plan',
            'educationLevel.category',
        ]);

        $chapter->load(['quiz.questions.answers', 'exercises.images', 'exercises.words']);

        $chapter->exercises->each(function ($exercise) use ($child) {
            $exercise->latest_score = $exercise->scores()
                ->where('child_profile_id', $child->id)
                ->latest()
                ->first();

            $exercise->score_history = $exercise->scores()
                ->where('child_profile_id', $child->id)
                ->orderBy('created_at', 'desc')
                ->limit(10)
                ->get();
        });

        if ($chapter->quiz) {
            $chapter->quiz->attempts_history = QuizAttempt::where('child_profile_id', $child->id)
                ->where('quiz_id', $chapter->quiz->id)
                ->whereNotNull('completed_at')
                ->orderBy('completed_at', 'desc')
                ->limit(10)
                ->get();
        }

        return Inertia::render('parent/child-sessions/view-chapter', [
            'child' => $child,
            'subject' => $subject,
            'chapter' => $chapter,
        ]);
    }

    public function startQuiz(ChildProfile $child, EducationalSubject $subject, Chapter $chapter, Quiz $quiz)
    {
        if ($quiz->chapter_id !== $chapter->id || ! $chapter->is_active) {
            return back()->withErrors(['message' => 'Quiz non disponible.']);
        }

        $child->load(['currentPlan.plan', 'educationLevel.category']);
        $quiz->load(['questions.answers']);

        $previousAttempts = QuizAttempt::where('child_profile_id', $child->id)
            ->where('quiz_id', $quiz->id)
            ->whereNotNull('completed_at')
            ->orderBy('completed_at', 'desc')
            ->limit(5)
            ->get();

        $lastAttempt = $previousAttempts->first();

        return Inertia::render('parent/child-sessions/take-quiz', [
            'child' => $child,
            'subject' => $subject,
            'chapter' => $chapter,
            'quiz' => $quiz,
            'lastAttempt' => $lastAttempt,
            'attemptCount' => $previousAttempts->count(),
        ]);
    }

    public function submitQuiz(Request $request, ChildProfile $child, EducationalSubject $subject, Chapter $chapter, Quiz $quiz)
    {
        $validated = $request->validate([
            'answers' => 'required|array',
            'time_spent' => 'nullable|integer',
            'started_at' => 'nullable|date',
        ]);

        $quiz->load(['questions.answers']);

        $correctAnswers = 0;
        $totalQuestions = $quiz->questions->count();
        $answers = $validated['answers'];

        foreach ($quiz->questions as $question) {
            $userAnswerId = $answers[$question->id] ?? null;
            if ($userAnswerId) {
                $correctAnswer = $question->answers->where('is_correct', true)->first();
                if ($correctAnswer && $correctAnswer->id == $userAnswerId) {
                    $correctAnswers++;
                }
            }
        }

        $score = $totalQuestions > 0 ? round(($correctAnswers / $totalQuestions) * 100) : 0;

        $attempt = QuizAttempt::create([
            'child_profile_id' => $child->id,
            'quiz_id' => $quiz->id,
            'chapter_id' => $chapter->id,
            'answers' => $answers,
            'score' => $score,
            'total_questions' => $totalQuestions,
            'correct_answers' => $correctAnswers,
            'time_spent' => $validated['time_spent'] ?? null,
            'started_at' => $validated['started_at'] ?? now(),
            'completed_at' => now(),
        ]);

        return redirect()->route('parent.child-sessions.quiz-results', [
            'child' => $child->id,
            'subject' => $subject->id,
            'chapter' => $chapter->id,
            'quiz' => $quiz->id,
            'attempt' => $attempt->id,
        ]);
    }

    public function quizResults(ChildProfile $child, EducationalSubject $subject, Chapter $chapter, Quiz $quiz, QuizAttempt $attempt)
    {
        if ($attempt->child_profile_id !== $child->id || $attempt->quiz_id !== $quiz->id) {
            return back()->withErrors(['message' => 'Résultat non disponible.']);
        }

        $child->load(['currentPlan.plan', 'educationLevel.category']);
        $quiz->load(['questions.answers']);
        $attempt->load(['quiz.questions.answers']);

        $previousAttempt = QuizAttempt::where('child_profile_id', $child->id)
            ->where('quiz_id', $quiz->id)
            ->where('id', '!=', $attempt->id)
            ->whereNotNull('completed_at')
            ->orderBy('completed_at', 'desc')
            ->first();

        $questionResults = [];
        foreach ($quiz->questions as $question) {
            $userAnswerId = $attempt->answers[$question->id] ?? null;
            $correctAnswer = $question->answers->where('is_correct', true)->first();
            $userAnswer = $question->answers->where('id', $userAnswerId)->first();

            $questionResults[] = [
                'question' => $question,
                'userAnswer' => $userAnswer,
                'correctAnswer' => $correctAnswer,
                'isCorrect' => $userAnswer && $correctAnswer && $userAnswer->id === $correctAnswer->id,
            ];
        }

        return Inertia::render('parent/child-sessions/quiz-results', [
            'child' => $child,
            'subject' => $subject,
            'chapter' => $chapter,
            'quiz' => $quiz,
            'attempt' => $attempt,
            'previousAttempt' => $previousAttempt,
            'questionResults' => $questionResults,
        ]);
    }

    public function startExercise(ChildProfile $child, EducationalSubject $subject, Chapter $chapter, Exercise $exercise)
    {
        if ($exercise->chapter_id !== $chapter->id || ! $chapter->is_active) {
            return back()->withErrors(['message' => 'Exercice non disponible.']);
        }

        $child->load(['currentPlan.plan', 'educationLevel.category']);
        $exercise->load(['images', 'words']);

        $latestScore = $exercise->scores()
            ->where('child_profile_id', $child->id)
            ->latest()
            ->first();

        return Inertia::render('parent/child-sessions/take-exercise', [
            'child' => $child,
            'subject' => $subject,
            'chapter' => $chapter,
            'exercise' => $exercise,
            'latestScore' => $latestScore,
        ]);
    }

    public function submitExercise(Request $request, ChildProfile $child, EducationalSubject $subject, Chapter $chapter, Exercise $exercise)
    {
        $validated = $request->validate([
            'score' => 'required|integer|min:0',
            'total' => 'required|integer|min:1',
        ]);

        $percentage = round(($validated['score'] / $validated['total']) * 100);

        $exercise->scores()->create([
            'child_profile_id' => $child->id,
            'score' => $validated['score'],
            'total' => $validated['total'],
            'percentage' => $percentage,
        ]);

        return back()->with('success', 'Score enregistré avec succès!');
    }

    public function viewChapterExercises(ChildProfile $child, EducationalSubject $subject, Chapter $chapter)
    {
        if ($chapter->educational_subject_id !== $subject->id || ! $chapter->is_active) {
            return back()->withErrors(['message' => 'Chapitre non disponible.']);
        }

        $child->load([
            'currentPlan.plan',
            'educationLevel.category',
        ]);

        $chapter->load(['exercises.images', 'exercises.words']);

        $chapter->exercises->each(function ($exercise) use ($child) {
            $exercise->latest_score = $exercise->scores()
                ->where('child_profile_id', $child->id)
                ->latest()
                ->first();

            $exercise->score_history = $exercise->scores()
                ->where('child_profile_id', $child->id)
                ->orderBy('created_at', 'desc')
                ->limit(10)
                ->get();
        });

        return Inertia::render('parent/child-sessions/view-chapter-exercises', [
            'child' => $child,
            'subject' => $subject,
            'chapter' => $chapter,
        ]);
    }

    public function viewChapterQuizzes(ChildProfile $child, EducationalSubject $subject, Chapter $chapter)
    {
        if ($chapter->educational_subject_id !== $subject->id || ! $chapter->is_active) {
            return back()->withErrors(['message' => 'Chapitre non disponible.']);
        }

        $child->load([
            'currentPlan.plan',
            'educationLevel.category',
        ]);

        $chapter->load(['quiz.questions.answers']);

        if ($chapter->quiz) {
            $chapter->quiz->attempts_history = QuizAttempt::where('child_profile_id', $child->id)
                ->where('quiz_id', $chapter->quiz->id)
                ->whereNotNull('completed_at')
                ->orderBy('completed_at', 'desc')
                ->limit(10)
                ->get();
        }

        return Inertia::render('parent/child-sessions/view-chapter-quizzes', [
            'child' => $child,
            'subject' => $subject,
            'chapter' => $chapter,
        ]);
    }
}
