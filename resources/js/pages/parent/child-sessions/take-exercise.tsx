import ExerciseRenderer from '@/components/exercises/ExerciseRenderer';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Chapter } from '@/pages/admin/educational-programs/chapters';
import { Subject } from '@/pages/admin/educational-programs/subjects';
import parent from '@/routes/parent';
import { Head, router } from '@inertiajs/react';
import { ArrowLeft, BookOpen, GraduationCap } from 'lucide-react';
import { ChildProfile } from './index';

interface Exercise {
    id: number;
    type: string;
    title: string;
    description: string | null;
    images: ExerciseImage[];
    word_sequences?: {
        model_word: string;
        other_words: { word: string; is_valid: boolean }[];
    }[];
    word_pairs?: {
        left_text: string;
        right_text: string;
    }[];
}

interface ExerciseImage {
    id: number;
    image_path: string;
    audio_path: string;
    is_correct: boolean;
}

interface ExerciseScore {
    id: number;
    score: number;
    total: number;
    percentage: number;
    created_at: string;
}

interface Props {
    child: ChildProfile;
    subject: Subject;
    chapter: Chapter;
    exercise: Exercise;
    latestScore: ExerciseScore | null;
}

export default function TakeExercise({
    child,
    subject,
    chapter,
    exercise,
    latestScore,
}: Props) {
    const handleComplete = () => {
        router.visit(
            parent.childSessions.viewChapter.url([
                child.id,
                subject.id,
                chapter.id,
            ]),
            {
                preserveScroll: true,
            },
        );
    };

    const handleRetry = () => {
        // Just reset - the component will handle its own state
    };

    const handleSubmitScore = (score: number, total: number) => {
        router.post(
            `/parent/child-sessions/${child.id}/${subject.id}/chapter/${chapter.id}/exercise/${exercise.id}`,
            { score, total },
            {
                preserveScroll: true,
                onSuccess: () => {
                    console.log('Score submitted successfully');
                },
            },
        );
    };

    return (
        <AppLayout>
            <Head
                title={`${exercise.title} - ${chapter.title} - ${child.name}`}
            />

            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
                <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
                    <div className="mb-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                    router.visit(
                                        parent.childSessions.viewChapter.url([
                                            child.id,
                                            subject.id,
                                            chapter.id,
                                        ]),
                                        {
                                            preserveScroll: true,
                                        },
                                    )
                                }
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Retour au cours
                            </Button>
                        </div>
                    </div>

                    <div className="mb-6 overflow-hidden rounded-3xl border-2 border-purple-200 bg-white shadow-lg dark:border-purple-800 dark:bg-slate-800">
                        <div className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-pink-500">
                                    <GraduationCap className="h-7 w-7 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                                        {exercise.title}
                                    </h1>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        {chapter.title} · {subject.name}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {exercise.description && (
                        <div className="mb-6 rounded-2xl border-2 border-purple-200 bg-white p-6 shadow-lg dark:border-purple-800 dark:bg-slate-800">
                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
                                    <BookOpen className="h-6 w-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="mb-2 text-lg font-bold text-purple-900 dark:text-purple-100">
                                        Instructions
                                    </h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        {exercise.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {latestScore && (
                        <div className="mb-6 rounded-2xl border-2 border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                        Dernier score
                                    </p>
                                    <p className="text-xs text-blue-700 dark:text-blue-300">
                                        {new Date(
                                            latestScore.created_at,
                                        ).toLocaleDateString('fr-FR', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                        })}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                                        {latestScore.score}/{latestScore.total}
                                    </p>
                                    <p className="text-sm text-blue-700 dark:text-blue-300">
                                        {latestScore.percentage}%
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <ExerciseRenderer
                        exercise={exercise}
                        onComplete={handleComplete}
                        onRetry={handleRetry}
                        onSubmitScore={handleSubmitScore}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
