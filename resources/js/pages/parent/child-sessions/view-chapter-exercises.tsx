import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    CheckCircle2,
    CircleDot,
    Link2,
    Mic,
    Pencil,
    Play,
    Target,
    Trophy,
    Volume2,
} from 'lucide-react';
import React from 'react';

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

interface Exercise {
    id: number;
    title: string;
    description: string | null;
    type: string;
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
    return (
        <AppLayout>
            <Head title={`Exercices - ${chapter.title}`} />

            <div className="min-h-screen dark:from-gray-900 dark:to-gray-800">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
                    {/* Back Button */}
                    <div className="mb-6">
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
                    </div>

                    <div className="mb-8 text-center">
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                            🎯 Exercices
                        </h1>
                        <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
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

                    {chapter.exercises.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {chapter.exercises.map((exercise) => {
                                const Icon = getExerciseTypeIcon(exercise.type);
                                const style = getExerciseTypeStyle(
                                    exercise.type,
                                );
                                const IconComponent = style.icon;

                                return (
                                    <Card
                                        key={exercise.id}
                                        className={`group relative overflow-hidden rounded-3xl border-2 ${style.cardBorder} ${style.cardBg} shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl`}
                                    >
                                        <div
                                            className={`absolute inset-0 bg-gradient-to-br ${style.bgGradient} opacity-50`}
                                        />
                                        <CardHeader className="relative z-10">
                                            <div className="flex items-center justify-between">
                                                <CardTitle
                                                    className={`text-xl font-bold ${style.textColor}`}
                                                >
                                                    {exercise.title}
                                                </CardTitle>
                                                <div
                                                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${style.iconBg}`}
                                                >
                                                    <IconComponent className="h-5 w-5 text-white" />
                                                </div>
                                            </div>
                                            <CardDescription className="text-gray-600 dark:text-gray-300">
                                                {exercise.description}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="relative z-10 flex-1">
                                            {exercise.latest_score ? (
                                                <div className="flex items-center space-x-3 rounded-lg bg-white/80 p-3 backdrop-blur-sm dark:bg-gray-800/80">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-500">
                                                        <Trophy className="h-4 w-4 text-white" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                            Dernier score
                                                        </p>
                                                        <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                                                            {
                                                                exercise
                                                                    .latest_score
                                                                    .score
                                                            }
                                                            /
                                                            {
                                                                exercise
                                                                    .latest_score
                                                                    .total
                                                            }{' '}
                                                            (
                                                            {
                                                                exercise
                                                                    .latest_score
                                                                    .percentage
                                                            }
                                                            %)
                                                        </p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center space-x-3 rounded-lg bg-gray-100/80 p-3 backdrop-blur-sm dark:bg-gray-700/80">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-400">
                                                        <Target className="h-4 w-4 text-white" />
                                                    </div>
                                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                                        Aucun score enregistré
                                                    </p>
                                                </div>
                                            )}
                                        </CardContent>
                                        <CardFooter className="relative z-10">
                                            <Button
                                                asChild
                                                className={`w-full bg-gradient-to-r ${style.buttonGradient} text-white transition-all duration-300 hover:shadow-lg`}
                                            >
                                                <Link
                                                    href={`/parent/child-sessions/${child.id}/${subject.id}/chapter/${chapter.id}/exercise/${exercise.id}`}
                                                >
                                                    <Play className="mr-2 h-4 w-4" />
                                                    Commencer l'exercice
                                                </Link>
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                );
                            })}
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
