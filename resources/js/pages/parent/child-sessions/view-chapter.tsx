import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    Download,
    FileQuestion,
    GraduationCap,
    Loader2,
    Paperclip,
    Play,
    Sparkles,
    Target,
    Video,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { ChildProfile } from './index';

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
                            {chapter.exercises.map((exercise: any) => (
                                <Card
                                    key={exercise.id}
                                    className="rounded-3xl border-2 border-orange-100 shadow-lg"
                                >
                                    <CardHeader className="bg-linear-to-r from-orange-50 to-yellow-50 dark:from-orange-950/30 dark:to-yellow-950/30">
                                        <CardTitle className="flex items-center gap-2 text-lg">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500">
                                                <Target className="h-4 w-4 text-white" />
                                            </div>
                                            {exercise.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <div className="rounded-2xl border-2 border-orange-200 bg-orange-50 p-6 text-center dark:border-orange-800 dark:bg-orange-950/20">
                                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-orange-400 to-yellow-500">
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
                                                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 dark:bg-blue-900">
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
                                                className="rounded-2xl bg-linear-to-r from-orange-500 to-yellow-600 px-6 py-3 font-bold shadow-lg hover:scale-105"
                                            >
                                                <Target className="mr-2 h-5 w-5" />
                                                Commencer l'exercice
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
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
