import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { ChapterPreviewIFrame } from '@/pages/admin/educational-programs/chapter-preview-iframe';
import { Chapter } from '@/pages/admin/educational-programs/chapters';
import { Subject } from '@/pages/admin/educational-programs/subjects';
import parent from '@/routes/parent';
import { Head, router } from '@inertiajs/react';
import { render } from '@maily-to/render';
import {
    ArrowLeft,
    Award,
    BookOpen,
    CheckSquare,
    CircleDot,
    Download,
    FileQuestion,
    GraduationCap,
    Headphones,
    History,
    Link2,
    Loader2,
    Paperclip,
    Pencil,
    Play,
    Sparkles,
    Target,
    Video,
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

interface Props {
    child: ChildProfile;
    subject: Subject;
    chapter: Chapter;
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

            <div className="min-h-screen">
                <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
                    <div className="mb-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                    router.visit(
                                        `/parent/child-sessions/${child.id}/${subject.id}`,
                                    )
                                }
                                className="w-fit"
                            >
                                <ArrowLeft className="mr-1.5 h-4 w-4" />
                                Retour aux chapitres
                            </Button>

                            <div className="flex flex-wrap items-center gap-2">
                                {child.education_level && (
                                    <Badge
                                        variant="outline"
                                        className="border-2 border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/20"
                                    >
                                        <GraduationCap className="mr-1.5 h-3.5 w-3.5" />
                                        {child.education_level.name}
                                    </Badge>
                                )}
                                <Badge
                                    variant="outline"
                                    className="border-2 border-purple-200 bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700 dark:bg-purple-950/20"
                                >
                                    <BookOpen className="mr-1.5 h-3.5 w-3.5" />
                                    {subject.name}
                                </Badge>
                            </div>
                        </div>

                        <div className="mt-6">
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-purple-500 to-blue-500 shadow-lg">
                                    <Sparkles className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl dark:text-slate-100">
                                        {chapter.title}
                                    </h1>
                                    <div className="mt-1 flex flex-wrap items-center gap-2">
                                        {chapter.video_url && (
                                            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                                                <Video className="mr-1 h-3 w-3" />
                                                Vidéo
                                            </Badge>
                                        )}
                                        {chapter.attachment_url && (
                                            <Badge className="bg-green-100 text-green-700 hover:bg-green-200">
                                                <Paperclip className="mr-1 h-3 w-3" />
                                                Pièce jointe
                                            </Badge>
                                        )}
                                        {chapter.quiz && (
                                            <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200">
                                                <FileQuestion className="mr-1 h-3 w-3" />
                                                Quiz disponible
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {videoEmbedUrl && (
                        <Card className="mb-6 overflow-hidden rounded-3xl border-2 border-blue-100 shadow-lg">
                            <CardHeader className="bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30">
                                <CardTitle className="flex items-center gap-2 text-lg">
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

                    <Card className="mb-6 rounded-3xl border-2 border-slate-100 shadow-lg">
                        <CardHeader className="bg-linear-to-r from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-700">
                                    <BookOpen className="h-4 w-4 text-white" />
                                </div>
                                Contenu du chapitre
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
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

                    {chapter.attachment_url && (
                        <Card className="mb-6 rounded-3xl border-2 border-green-100 shadow-lg">
                            <CardHeader className="bg-linear-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500">
                                        <Paperclip className="h-4 w-4 text-white" />
                                    </div>
                                    Pièce jointe
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between rounded-2xl border-2 border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950/20">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500">
                                            <Download className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900 dark:text-slate-100">
                                                {chapter.attachment_url
                                                    .split('/')
                                                    .pop()}
                                            </p>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                Fichier téléchargeable
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        asChild
                                        className="rounded-2xl bg-linear-to-r from-green-500 to-emerald-600 font-bold shadow-lg hover:scale-105"
                                    >
                                        <a
                                            href={`/storage/${chapter.attachment_url}`}
                                            download
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <Download className="mr-2 h-4 w-4" />
                                            Télécharger
                                        </a>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {chapter.exercises && chapter.exercises.length > 0 && (
                        <div className="mb-6 space-y-4">
                            <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-slate-100">
                                <Target className="h-6 w-6 text-orange-600" />
                                Exercices
                            </h2>
                            {chapter.exercises.map((exercise: any) => {
                                const style = getExerciseTypeStyle(
                                    exercise.type,
                                );
                                const ExerciseIcon = style.icon;
                                return (
                                    <Card
                                        key={exercise.id}
                                        className={`rounded-3xl border-2 ${style.borderColor} shadow-lg`}
                                    >
                                        <CardHeader
                                            className={`bg-linear-to-r ${style.bgGradient}`}
                                        >
                                            <CardTitle className="flex items-center gap-2 text-lg">
                                                <div
                                                    className={`flex h-8 w-8 items-center justify-center rounded-lg ${style.iconBg}`}
                                                >
                                                    <ExerciseIcon className="h-4 w-4 text-white" />
                                                </div>
                                                {exercise.title}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-6">
                                            <div
                                                className={`rounded-2xl border-2 ${style.cardBorder} ${style.cardBg} p-6 text-center`}
                                            >
                                                <div className="${style.buttonGradient} mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br">
                                                    <Sparkles className="h-8 w-8 text-white" />
                                                </div>
                                                <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-slate-100">
                                                    Entraîne-toi !
                                                </h3>
                                                {exercise.description && (
                                                    <p className="mb-4 text-slate-600 dark:text-slate-400">
                                                        {exercise.description}
                                                    </p>
                                                )}

                                                {exercise.latest_score && (
                                                    <div className="mb-4 flex items-center justify-center gap-2">
                                                        <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 dark:bg-blue-900">
                                                            <Award className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                            <span className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                                                                Dernier score:{' '}
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
                                                            </span>
                                                        </div>
                                                        {exercise.score_history &&
                                                            exercise
                                                                .score_history
                                                                .length > 0 && (
                                                                <Dialog>
                                                                    <DialogTrigger
                                                                        asChild
                                                                    >
                                                                        <Button
                                                                            variant="outline"
                                                                            size="sm"
                                                                            className="rounded-full"
                                                                        >
                                                                            <History className="h-4 w-4" />
                                                                        </Button>
                                                                    </DialogTrigger>
                                                                    <DialogContent className="max-h-[80vh] overflow-y-auto">
                                                                        <DialogHeader>
                                                                            <DialogTitle>
                                                                                Historique
                                                                                des
                                                                                scores
                                                                            </DialogTitle>
                                                                            <DialogDescription>
                                                                                Vos
                                                                                10
                                                                                dernières
                                                                                tentatives
                                                                                pour
                                                                                cet
                                                                                exercice
                                                                            </DialogDescription>
                                                                        </DialogHeader>
                                                                        <div className="space-y-3">
                                                                            {exercise.score_history.map(
                                                                                (
                                                                                    score: any,
                                                                                    index: number,
                                                                                ) => (
                                                                                    <div
                                                                                        key={
                                                                                            score.id
                                                                                        }
                                                                                        className={
                                                                                            index ===
                                                                                            0
                                                                                                ? 'rounded-lg border-2 border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/20'
                                                                                                : 'rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50'
                                                                                        }
                                                                                    >
                                                                                        <div className="flex items-center justify-between">
                                                                                            <div className="flex items-center gap-3">
                                                                                                <div
                                                                                                    className={
                                                                                                        index ===
                                                                                                        0
                                                                                                            ? 'flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white'
                                                                                                            : 'flex h-10 w-10 items-center justify-center rounded-full bg-slate-300 text-slate-700 dark:bg-slate-600 dark:text-slate-300'
                                                                                                    }
                                                                                                >
                                                                                                    <Award className="h-5 w-5" />
                                                                                                </div>
                                                                                                <div>
                                                                                                    <div className="flex items-center gap-2">
                                                                                                        <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                                                                                                            {
                                                                                                                score.score
                                                                                                            }

                                                                                                            /
                                                                                                            {
                                                                                                                score.total
                                                                                                            }
                                                                                                        </span>
                                                                                                        <Badge
                                                                                                            variant={
                                                                                                                score.percentage >=
                                                                                                                80
                                                                                                                    ? 'default'
                                                                                                                    : score.percentage >=
                                                                                                                        50
                                                                                                                      ? 'secondary'
                                                                                                                      : 'destructive'
                                                                                                            }
                                                                                                        >
                                                                                                            {
                                                                                                                score.percentage
                                                                                                            }

                                                                                                            %
                                                                                                        </Badge>
                                                                                                    </div>
                                                                                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                                                                                        {new Date(
                                                                                                            score.created_at,
                                                                                                        ).toLocaleDateString(
                                                                                                            'fr-FR',
                                                                                                            {
                                                                                                                day: 'numeric',
                                                                                                                month: 'long',
                                                                                                                year: 'numeric',
                                                                                                                hour: '2-digit',
                                                                                                                minute: '2-digit',
                                                                                                            },
                                                                                                        )}
                                                                                                    </p>
                                                                                                </div>
                                                                                            </div>
                                                                                            {index ===
                                                                                                0 && (
                                                                                                <Badge className="bg-blue-500">
                                                                                                    Plus
                                                                                                    récent
                                                                                                </Badge>
                                                                                            )}
                                                                                        </div>
                                                                                    </div>
                                                                                ),
                                                                            )}
                                                                        </div>
                                                                    </DialogContent>
                                                                </Dialog>
                                                            )}
                                                    </div>
                                                )}

                                                <Button
                                                    onClick={() =>
                                                        router.visit(
                                                            parent.childSessions.startExercise.url(
                                                                [
                                                                    child.id,
                                                                    subject.id,
                                                                    chapter.id,
                                                                    exercise.id,
                                                                ],
                                                            ),
                                                        )
                                                    }
                                                    className={`rounded-2xl bg-linear-to-r ${style.buttonGradient} px-6 py-3 font-bold shadow-lg hover:scale-105`}
                                                >
                                                    <Target className="mr-2 h-5 w-5" />
                                                    Commencer l'exercice
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    )}

                    {chapter.quiz && (
                        <Card className="mb-6 rounded-3xl border-2 border-purple-100 shadow-lg">
                            <CardHeader className="bg-linear-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500">
                                        <FileQuestion className="h-4 w-4 text-white" />
                                    </div>
                                    Quiz - {chapter.quiz.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="rounded-2xl border-2 border-purple-200 bg-purple-50 p-6 text-center dark:border-purple-800 dark:bg-purple-950/20">
                                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-purple-400 to-pink-500">
                                        <Sparkles className="h-8 w-8 text-white" />
                                    </div>
                                    <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-slate-100">
                                        Testez vos connaissances !
                                    </h3>
                                    <p className="mb-4 text-slate-600 dark:text-slate-400">
                                        {chapter.quiz.description ||
                                            'Répondez aux questions pour valider ce chapitre'}
                                    </p>

                                    {chapter.quiz.attempts_history &&
                                        chapter.quiz.attempts_history.length >
                                            0 && (
                                            <div className="mb-4 flex items-center justify-center gap-2">
                                                <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-2 dark:bg-purple-900">
                                                    <Award className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                                    <span className="text-sm font-semibold text-purple-900 dark:text-purple-100">
                                                        Meilleur score:{' '}
                                                        {Math.max(
                                                            ...chapter.quiz.attempts_history.map(
                                                                (a: any) =>
                                                                    a.score,
                                                            ),
                                                        )}
                                                        %
                                                    </span>
                                                </div>
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="rounded-full"
                                                        >
                                                            <History className="h-4 w-4" />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="max-h-[80vh] overflow-y-auto">
                                                        <DialogHeader>
                                                            <DialogTitle>
                                                                Historique des
                                                                tentatives
                                                            </DialogTitle>
                                                            <DialogDescription>
                                                                Vos 10 dernières
                                                                tentatives pour
                                                                ce quiz
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <div className="space-y-3">
                                                            {chapter.quiz.attempts_history.map(
                                                                (
                                                                    attempt: any,
                                                                    index: number,
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            attempt.id
                                                                        }
                                                                        className={
                                                                            index ===
                                                                            0
                                                                                ? 'rounded-lg border-2 border-purple-200 bg-purple-50 p-4 dark:border-purple-800 dark:bg-purple-950/20'
                                                                                : 'rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50'
                                                                        }
                                                                    >
                                                                        <div className="flex items-center justify-between">
                                                                            <div className="flex items-center gap-3">
                                                                                <div
                                                                                    className={
                                                                                        index ===
                                                                                        0
                                                                                            ? 'flex h-10 w-10 items-center justify-center rounded-full bg-purple-500 text-white'
                                                                                            : 'flex h-10 w-10 items-center justify-center rounded-full bg-slate-300 text-slate-700 dark:bg-slate-600 dark:text-slate-300'
                                                                                    }
                                                                                >
                                                                                    <FileQuestion className="h-5 w-5" />
                                                                                </div>
                                                                                <div>
                                                                                    <div className="flex items-center gap-2">
                                                                                        <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                                                                                            {
                                                                                                attempt.correct_answers
                                                                                            }

                                                                                            /
                                                                                            {
                                                                                                attempt.total_questions
                                                                                            }
                                                                                        </span>
                                                                                        <Badge
                                                                                            variant={
                                                                                                attempt.score >=
                                                                                                80
                                                                                                    ? 'default'
                                                                                                    : attempt.score >=
                                                                                                        50
                                                                                                      ? 'secondary'
                                                                                                      : 'destructive'
                                                                                            }
                                                                                        >
                                                                                            {
                                                                                                attempt.score
                                                                                            }

                                                                                            %
                                                                                        </Badge>
                                                                                    </div>
                                                                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                                                                        {new Date(
                                                                                            attempt.completed_at,
                                                                                        ).toLocaleDateString(
                                                                                            'fr-FR',
                                                                                            {
                                                                                                day: 'numeric',
                                                                                                month: 'long',
                                                                                                year: 'numeric',
                                                                                                hour: '2-digit',
                                                                                                minute: '2-digit',
                                                                                            },
                                                                                        )}
                                                                                    </p>
                                                                                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                                                                        Temps:{' '}
                                                                                        {Math.floor(
                                                                                            attempt.time_spent /
                                                                                                60,
                                                                                        )}
                                                                                        min{' '}
                                                                                        {attempt.time_spent %
                                                                                            60}

                                                                                        s
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                            {index ===
                                                                                0 && (
                                                                                <Badge className="bg-purple-500">
                                                                                    Plus
                                                                                    récent
                                                                                </Badge>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                ),
                                                            )}
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                        )}

                                    <Button
                                        onClick={() =>
                                            router.visit(
                                                parent.childSessions.startQuiz.url(
                                                    [
                                                        child.id,
                                                        subject.id,
                                                        chapter.id,
                                                        chapter.quiz!.id,
                                                    ],
                                                ),
                                            )
                                        }
                                        className="rounded-2xl bg-linear-to-r from-purple-500 to-pink-600 px-6 py-3 font-bold shadow-lg hover:scale-105"
                                    >
                                        <FileQuestion className="mr-2 h-5 w-5" />
                                        Commencer le quiz
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
