import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { ChapterPreviewIFrame } from '@/pages/admin/educational-programs/chapter-preview-iframe';
import { Chapter } from '@/pages/admin/educational-programs/chapters';
import { Subject } from '@/pages/admin/educational-programs/subjects';
import {
    viewChapterExercises,
    viewChapterQuizzes,
} from '@/routes/parent/child-sessions';
import { Head, Link, router } from '@inertiajs/react';
import { render } from '@maily-to/render';
import {
    ArrowLeft,
    BookOpen,
    CheckSquare,
    CircleDot,
    FileQuestion,
    Headphones,
    Link2,
    Loader2,
    Pencil,
    Play,
    Target,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { ChildProfile } from './index';

const getExerciseTypeStyle = (type: string) => {
    switch (type) {
        case 'choose_when_hear':
            return {
                icon: Headphones,
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
                icon: BookOpen,
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
                icon: CheckSquare,
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
    score_history?: ExerciseScore[];
}

interface QuizAttempt {
    id: number;
    score: number;
    total_questions: number;
    correct_answers: number;
    completed_at: string;
}

interface Quiz {
    id: number;
    title: string;
    description: string | null;
    attempts_history?: QuizAttempt[];
}

interface Props {
    child: ChildProfile;
    subject: Subject;
    chapter: Chapter & {
        exercises: Exercise[];
        quiz?: Quiz;
    };
}

export default function ViewChapter({ child, subject, chapter }: Props) {
    const [html, setHtml] = useState('');
    const [isLoadingContent, setIsLoadingContent] = useState(true);

    useEffect(() => {
        const loadContent = async () => {
            setIsLoadingContent(true);
            try {
                if (chapter.content) {
                    const json = JSON.parse(chapter.content);
                    const renderedHtml = await render(json);
                    setHtml(renderedHtml);
                }
            } catch (error) {
                console.error('Error rendering chapter content:', error);
                setHtml(chapter.content || '');
            } finally {
                setIsLoadingContent(false);
            }
        };

        loadContent();
    }, [chapter.content]);

    const getVideoEmbedUrl = (url: string) => {
        if (!url) return null;

        const youtubeRegex =
            /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/;
        const youtubeMatch = url.match(youtubeRegex);
        if (youtubeMatch) {
            return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
        }

        const vimeoRegex = /vimeo\.com\/(\d+)/;
        const vimeoMatch = url.match(vimeoRegex);
        if (vimeoMatch) {
            return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
        }

        return url;
    };

    const videoEmbedUrl = chapter.video_url
        ? getVideoEmbedUrl(chapter.video_url)
        : null;

    return (
        <AppLayout>
            <Head
                title={`${chapter.title} - ${subject.name} - ${child.name}`}
            />

            <div className="min-h-screen bg-gradient-to-br dark:from-gray-900 dark:to-gray-800">
                <div className="mx-auto max-w-5xl px-4 py-3 sm:px-6 sm:py-6">
                    <Button
                        variant="ghost"
                        onClick={() =>
                            router.visit(
                                window.history.state?.url ||
                                    `/parent/child-sessions/${child.id}`,
                            )
                        }
                        className="mb-2 gap-2 sm:mb-4"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Retour
                    </Button>
                </div>
                <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 px-4 pb-6 sm:gap-6 sm:px-6 lg:grid-cols-10">
                    {/* Left Column: Video and Chapter Content */}
                    <div className="space-y-4 sm:space-y-6 lg:col-span-7">
                        {videoEmbedUrl && (
                            <Card className="overflow-hidden rounded-2xl border-2 border-blue-100 shadow-lg sm:rounded-3xl">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500">
                                            <Play className="h-4 w-4 text-white" />
                                        </div>
                                        Vidéo du chapitre
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="relative aspect-video w-full">
                                        <iframe
                                            src={videoEmbedUrl}
                                            className="absolute inset-0 h-full w-full"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        <Card className="rounded-2xl border-2 border-slate-100 shadow-lg sm:rounded-3xl">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-700">
                                        <BookOpen className="h-4 w-4 text-white" />
                                    </div>
                                    Contenu du chapitre
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 sm:p-6">
                                {isLoadingContent ? (
                                    <div className="flex min-h-[300px] items-center justify-center">
                                        <div className="text-center">
                                            <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-blue-500" />
                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                Chargement du contenu...
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="max-w-none">
                                        <ChapterPreviewIFrame
                                            wrapperClassName="w-full min-h-[200px]"
                                            className="w-full border-0"
                                            innerHTML={html}
                                            showOpenInNewTab={false}
                                            autoHeight={true}
                                        />
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Exercises and Quizzes */}
                    <div className="space-y-4 sm:space-y-6 lg:col-span-3">
                        {/* Exercises Card */}
                        <Card className="rounded-2xl border-2 border-orange-100 shadow-lg sm:rounded-3xl">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500">
                                        <Target className="h-4 w-4 text-white" />
                                    </div>
                                    Exercices
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 p-4 sm:p-6">
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    Nombre d'exercices:{' '}
                                    {chapter.exercises?.length || 0}
                                </p>
                                <div className="space-y-2">
                                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                        Progression :
                                    </p>
                                    <div className="h-2.5 w-full rounded-full bg-orange-100 dark:bg-orange-900">
                                        <div
                                            className="h-2.5 rounded-full bg-orange-500"
                                            style={{
                                                width: `${((chapter.exercises?.filter((ex: any) => ex.latest_score).length || 0) / (chapter.exercises?.length || 1)) * 100}%`,
                                            }}
                                        ></div>
                                    </div>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">
                                        {chapter.exercises?.filter(
                                            (ex: any) => ex.latest_score,
                                        ).length || 0}{' '}
                                        sur {chapter.exercises?.length || 0}{' '}
                                        complétés
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                        Score moyen :
                                    </p>
                                    <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
                                        {chapter.exercises?.filter(
                                            (ex: any) => ex.latest_score,
                                        ).length > 0
                                            ? Math.round(
                                                  chapter.exercises
                                                      .filter(
                                                          (ex: any) =>
                                                              ex.latest_score,
                                                      )
                                                      .reduce(
                                                          (sum, ex: any) =>
                                                              sum +
                                                              (ex.latest_score
                                                                  ?.percentage ||
                                                                  0),
                                                          0,
                                                      ) /
                                                      chapter.exercises.filter(
                                                          (ex: any) =>
                                                              ex.latest_score,
                                                      ).length,
                                              )
                                            : 0}{' '}
                                        / 100
                                    </p>
                                </div>
                                <Link
                                    as={Button}
                                    className="w-full bg-orange-500 text-white hover:bg-orange-600"
                                    href={viewChapterExercises.url([
                                        child.id,
                                        subject.id,
                                        chapter.id,
                                    ])}
                                >
                                    Accéder aux exercices
                                </Link>
                            </CardContent>
                        </Card>

                        {/* Quizzes Card */}
                        <Card className="rounded-2xl border-2 border-purple-100 shadow-lg sm:rounded-3xl">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500">
                                        <FileQuestion className="h-4 w-4 text-white" />
                                    </div>
                                    Quiz
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 p-4 sm:p-6">
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    Nombre de quiz: {chapter.quiz ? 1 : 0}
                                </p>
                                {chapter.quiz && (
                                    <div className="space-y-2">
                                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                            Progression :
                                        </p>
                                        <div className="h-2.5 w-full rounded-full bg-purple-100 dark:bg-purple-900">
                                            <div
                                                className="h-2.5 rounded-full bg-purple-500"
                                                style={{
                                                    width: `${(chapter.quiz as any).attempts_history?.length > 0 ? 100 : 0}%`,
                                                }}
                                            ></div>
                                        </div>
                                        <p className="text-xs text-slate-600 dark:text-slate-400">
                                            {(chapter.quiz as any)
                                                .attempts_history?.length ||
                                                0}{' '}
                                            tentative(s) complétée(s)
                                        </p>
                                    </div>
                                )}
                                {chapter.quiz && (
                                    <div className="space-y-2">
                                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                            Score moyen :
                                        </p>
                                        <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                                            {(chapter.quiz as any)
                                                .attempts_history?.length > 0
                                                ? Math.round(
                                                      (
                                                          chapter.quiz as any
                                                      ).attempts_history.reduce(
                                                          (
                                                              sum: number,
                                                              attempt: any,
                                                          ) =>
                                                              sum +
                                                              (attempt.score ||
                                                                  0),
                                                          0,
                                                      ) /
                                                          (chapter.quiz as any)
                                                              .attempts_history
                                                              .length,
                                                  )
                                                : 0}{' '}
                                            / 100
                                        </p>
                                    </div>
                                )}
                                <Link
                                    as={Button}
                                    className="w-full bg-purple-500 text-white hover:bg-purple-600"
                                    href={viewChapterQuizzes.url([
                                        child.id,
                                        subject.id,
                                        chapter.id,
                                    ])}
                                >
                                    Accéder au quiz
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
