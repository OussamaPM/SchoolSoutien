import ExerciseRenderer from '@/components/exercises/ExerciseRenderer';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    CheckCircle2,
    CheckCircle2 as CheckIcon,
    Circle,
    CircleDot,
    Link2,
    Mic,
    Pencil,
    Target,
    Volume2,
} from 'lucide-react';
import React, { useState } from 'react';

interface ChildProfile {
    id: number;
    first_name: string;
    last_name: string;
}

interface EducationalSubject {
    id: number;
    name: string;
}

interface Chapter {
    id: number;
    title: string;
    description?: string;
}

interface ExerciseScore {
    id: number;
    score: number;
    total: number;
    percentage: number;
    created_at: string;
}

interface ExerciseImage {
    id: number;
    image_path: string;
    audio_path: string;
    is_correct: boolean;
}

interface Exercise {
    id: number;
    title: string;
    description: string | null;
    type: string;
    images: ExerciseImage[];
    word_sequences?: {
        model_word: string;
        other_words: { word: string; is_valid: boolean }[];
    }[];
    word_pairs?: {
        left_text: string;
        right_text: string;
    }[];
    latest_score?: ExerciseScore;
}

interface Props {
    child: ChildProfile;
    subject: EducationalSubject;
    chapter: Chapter & { exercises: Exercise[] };
}

const getExerciseTypeIcon = (type: string) => {
    switch (type) {
        case 'choose_when_hear':
            return Volume2;
        case 'choose_when_read':
            return Mic;
        case 'select_image':
            return CheckCircle2;
        case 'choose_letter':
            return Pencil;
        case 'circle_identical':
            return CircleDot;
        case 'connect_words':
            return Link2;
        default:
            return Target;
    }
};

const getExerciseTypeColor = (type: string) => {
    switch (type) {
        case 'choose_when_hear':
            return 'text-blue-600';
        case 'choose_when_read':
            return 'text-green-600';
        case 'select_image':
            return 'text-purple-600';
        case 'choose_letter':
            return 'text-orange-600';
        case 'circle_identical':
            return 'text-pink-600';
        case 'connect_words':
            return 'text-cyan-600';
        default:
            return 'text-slate-600';
    }
};

const getExerciseTypeStyle = (type: string) => {
    switch (type) {
        case 'choose_when_hear':
            return {
                icon: Volume2,
                borderColor: 'border-blue-100 dark:border-blue-900',
                bgGradient:
                    'from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30',
                cardBg: 'bg-blue-50 dark:bg-blue-950/20',
                cardBorder: 'border-blue-200 dark:border-blue-800',
                iconBg: 'bg-blue-500',
                textColor: 'text-blue-600 dark:text-blue-400',
                buttonGradient: 'from-blue-500 to-indigo-600',
            };
        case 'choose_when_read':
            return {
                icon: Mic,
                borderColor: 'border-green-100 dark:border-green-900',
                bgGradient:
                    'from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30',
                cardBg: 'bg-green-50 dark:bg-green-950/20',
                cardBorder: 'border-green-200 dark:border-green-800',
                iconBg: 'bg-green-500',
                textColor: 'text-green-600 dark:text-green-400',
                buttonGradient: 'from-green-500 to-emerald-600',
            };
        case 'select_image':
            return {
                icon: CheckCircle2,
                borderColor: 'border-purple-100 dark:border-purple-900',
                bgGradient:
                    'from-purple-50 to-fuchsia-50 dark:from-purple-950/30 dark:to-fuchsia-950/30',
                cardBg: 'bg-purple-50 dark:bg-purple-950/20',
                cardBorder: 'border-purple-200 dark:border-purple-800',
                iconBg: 'bg-purple-500',
                textColor: 'text-purple-600 dark:text-purple-400',
                buttonGradient: 'from-purple-500 to-fuchsia-600',
            };
        case 'choose_letter':
            return {
                icon: Pencil,
                borderColor: 'border-orange-100 dark:border-orange-900',
                bgGradient:
                    'from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30',
                cardBg: 'bg-orange-50 dark:bg-orange-950/20',
                cardBorder: 'border-orange-200 dark:border-orange-800',
                iconBg: 'bg-orange-500',
                textColor: 'text-orange-600 dark:text-orange-400',
                buttonGradient: 'from-orange-500 to-amber-600',
            };
        case 'circle_identical':
            return {
                icon: CircleDot,
                borderColor: 'border-pink-100 dark:border-pink-900',
                bgGradient:
                    'from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30',
                cardBg: 'bg-pink-50 dark:bg-pink-950/20',
                cardBorder: 'border-pink-200 dark:border-pink-800',
                iconBg: 'bg-pink-500',
                textColor: 'text-pink-600 dark:text-pink-400',
                buttonGradient: 'from-pink-500 to-rose-600',
            };
        case 'connect_words':
            return {
                icon: Link2,
                borderColor: 'border-cyan-100 dark:border-cyan-900',
                bgGradient:
                    'from-cyan-50 to-teal-50 dark:from-cyan-950/30 dark:to-teal-950/30',
                cardBg: 'bg-cyan-50 dark:bg-cyan-950/20',
                cardBorder: 'border-cyan-200 dark:border-cyan-800',
                iconBg: 'bg-cyan-500',
                textColor: 'text-cyan-600 dark:text-cyan-400',
                buttonGradient: 'from-cyan-500 to-teal-600',
            };
        default:
            return {
                icon: Target,
                borderColor: 'border-slate-100 dark:border-slate-900',
                bgGradient:
                    'from-slate-50 to-gray-50 dark:from-slate-950/30 dark:to-gray-950/30',
                cardBg: 'bg-slate-50 dark:bg-slate-950/20',
                cardBorder: 'border-slate-200 dark:border-slate-800',
                iconBg: 'bg-slate-500',
                textColor: 'text-slate-600 dark:text-slate-400',
                buttonGradient: 'from-slate-500 to-gray-600',
            };
    }
};

const ViewChapterExercises: React.FC<Props> = ({ child, subject, chapter }) => {
    const [selectedExercise, setSelectedExercise] = useState<Exercise>(
        chapter.exercises[0] || null,
    );

    const handleExerciseSelect = (exercise: Exercise) => {
        setSelectedExercise(exercise);
    };

    const handleComplete = () => {
        // Could navigate back or show completion message
        console.log('Exercise completed');
    };

    const handleRetry = () => {
        // Reset exercise state if needed
        console.log('Exercise retry');
    };

    const handleSubmitScore = (score: number, total: number) => {
        router.post(
            `/parent/child-sessions/${child.id}/${subject.id}/chapter/${chapter.id}/exercise/${selectedExercise.id}`,
            { score, total },
            {
                preserveScroll: true,
                onSuccess: () => {
                    console.log('Score submitted successfully');
                    // Could refresh the page or update local state
                },
            },
        );
    };
    return (
        <AppLayout>
            <Head title={`Exercices - ${chapter.title}`} />

            <div className="min-h-screen dark:from-gray-900 dark:to-gray-800">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
                    {/* Header with Back Button and Title */}
                    <div className="mb-8 flex items-center justify-between">
                        <Button
                            variant="outline"
                            asChild
                            className="bg-white/80 backdrop-blur-sm hover:bg-white/90 dark:bg-gray-800/80 dark:hover:bg-gray-800/90"
                        >
                            <Link
                                href={`/parent/child-sessions/${child.id}/${subject.id}/chapter/${chapter.id}`}
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Retour au chapitre
                            </Link>
                        </Button>

                        <div className="text-right">
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                                🎯 Exercices
                            </h1>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                                Chapitre :{' '}
                                <span className="font-semibold text-blue-600 dark:text-blue-400">
                                    {chapter.title}
                                </span>{' '}
                                - Matière :{' '}
                                <span className="font-semibold text-green-600 dark:text-green-400">
                                    {subject.name}
                                </span>
                            </p>
                        </div>
                    </div>

                    {chapter.exercises.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-10">
                            {/* Left Column: Exercise Renderer (70%) */}
                            <div className="lg:col-span-7">
                                <Card className="overflow-hidden rounded-3xl border-2 border-blue-200 bg-white shadow-xl dark:border-blue-800 dark:bg-gray-800">
                                    <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500">
                                                <Target className="h-6 w-6 text-white" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-xl font-bold text-blue-900 dark:text-blue-100">
                                                    {selectedExercise?.title ||
                                                        'Sélectionnez un exercice'}
                                                </CardTitle>
                                                <CardDescription className="text-blue-700 dark:text-blue-300">
                                                    {
                                                        selectedExercise?.description
                                                    }
                                                </CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        {selectedExercise ? (
                                            <ExerciseRenderer
                                                exercise={selectedExercise}
                                                onComplete={handleComplete}
                                                onRetry={handleRetry}
                                                onSubmitScore={
                                                    handleSubmitScore
                                                }
                                            />
                                        ) : (
                                            <div className="flex min-h-[400px] items-center justify-center">
                                                <div className="text-center">
                                                    <Target className="mx-auto h-16 w-16 text-gray-400" />
                                                    <p className="mt-4 text-gray-600 dark:text-gray-400">
                                                        Sélectionnez un exercice
                                                        dans la liste à droite
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Right Column: Exercise List (30%) */}
                            <div className="lg:col-span-3">
                                <Card className="sticky top-6 overflow-hidden rounded-3xl border-2 border-indigo-200 bg-white shadow-xl dark:border-indigo-800 dark:bg-gray-800">
                                    <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30">
                                        <CardTitle className="flex items-center gap-2 text-lg font-bold text-indigo-900 dark:text-indigo-100">
                                            <CheckCircle2 className="h-5 w-5" />
                                            Liste des exercices
                                        </CardTitle>
                                        <CardDescription className="text-indigo-700 dark:text-indigo-300">
                                            {
                                                chapter.exercises.filter(
                                                    (ex) => ex.latest_score,
                                                ).length
                                            }{' '}
                                            sur {chapter.exercises.length}{' '}
                                            complétés
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="max-h-[600px] overflow-y-auto p-4">
                                        <div className="space-y-3">
                                            {chapter.exercises.map(
                                                (exercise) => {
                                                    const Icon =
                                                        getExerciseTypeIcon(
                                                            exercise.type,
                                                        );
                                                    const style =
                                                        getExerciseTypeStyle(
                                                            exercise.type,
                                                        );
                                                    const isSelected =
                                                        selectedExercise?.id ===
                                                        exercise.id;
                                                    const isCompleted =
                                                        !!exercise.latest_score;

                                                    return (
                                                        <div
                                                            key={exercise.id}
                                                            onClick={() =>
                                                                handleExerciseSelect(
                                                                    exercise,
                                                                )
                                                            }
                                                            className={`cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 hover:shadow-md ${
                                                                isSelected
                                                                    ? `${style.cardBorder} ${style.cardBg} shadow-lg`
                                                                    : 'border-gray-200 bg-gray-50 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800/50'
                                                            }`}
                                                        >
                                                            <div className="flex items-start gap-3">
                                                                <div
                                                                    className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                                                                        isCompleted
                                                                            ? 'bg-green-500'
                                                                            : 'bg-gray-300 dark:bg-gray-600'
                                                                    }`}
                                                                >
                                                                    {isCompleted ? (
                                                                        <CheckIcon className="h-4 w-4 text-white" />
                                                                    ) : (
                                                                        <Circle className="h-4 w-4 text-white" />
                                                                    )}
                                                                </div>
                                                                <div className="min-w-0 flex-1">
                                                                    <h4
                                                                        className={`truncate font-semibold ${
                                                                            isSelected
                                                                                ? style.textColor
                                                                                : 'text-gray-900 dark:text-white'
                                                                        }`}
                                                                    >
                                                                        {
                                                                            exercise.title
                                                                        }
                                                                    </h4>
                                                                    <div className="mt-1 flex items-center gap-2">
                                                                        <div
                                                                            className={`flex h-5 w-5 items-center justify-center rounded ${style.iconBg}`}
                                                                        >
                                                                            <Icon className="h-3 w-3 text-white" />
                                                                        </div>
                                                                        {exercise.latest_score && (
                                                                            <span className="text-xs font-medium text-green-600 dark:text-green-400">
                                                                                {
                                                                                    exercise
                                                                                        .latest_score
                                                                                        .percentage
                                                                                }

                                                                                %
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                },
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    ) : (
                        <div className="flex min-h-[400px] items-center justify-center">
                            <div className="text-center">
                                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                                    <Target className="h-10 w-10 text-gray-400" />
                                </div>
                                <h3 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">
                                    Aucun exercice disponible
                                </h3>
                                <p className="mt-2 text-gray-600 dark:text-gray-300">
                                    Ce chapitre ne contient pas encore
                                    d'exercices.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
};

export default ViewChapterExercises;
