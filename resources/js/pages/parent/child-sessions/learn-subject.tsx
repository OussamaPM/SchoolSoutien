import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Chapter } from '@/pages/admin/educational-programs/chapters';
import { Subject } from '@/pages/admin/educational-programs/subjects';
import parent from '@/routes/parent';
import { Head, router } from '@inertiajs/react';
import {
    ArrowLeft,
    BookOpen,
    CheckCircle2,
    Circle,
    FileQuestion,
    GraduationCap,
    Lock,
    Sparkles,
    Target,
} from 'lucide-react';
import { ChildProfile } from './index';

interface Props {
    child: ChildProfile;
    subject: Subject;
}

export default function LearnSubject({ child, subject }: Props) {
    const activeChapters = subject.chapters!.filter(
        (chapter) => chapter.is_active,
    );

    const handleChapterClick = (chapter: Chapter, index: number) => {
        router.visit(
            parent.childSessions.viewChapter.url([
                child.id,
                subject.id,
                chapter.id,
            ]),
        );
    };

    return (
        <AppLayout>
            <Head title={`${subject.name} - ${child.name}`} />

            <div className="min-h-screen bg-white dark:bg-slate-950">
                <div className="mx-auto max-w-4xl px-3 py-4 md:px-6 md:py-6">
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                    router.visit(
                                        `/parent/child-sessions/${child.id}`,
                                    )
                                }
                            >
                                <ArrowLeft className="mr-1.5 h-4 w-4" />
                                Retour
                            </Button>

                            <div className="flex items-center gap-2">
                                {child.education_level && (
                                    <Badge
                                        variant="outline"
                                        className="border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-950/20"
                                    >
                                        <GraduationCap className="mr-1 h-3 w-3" />
                                        {child.education_level.name}
                                    </Badge>
                                )}
                            </div>
                        </div>

                        <div className="mt-4 text-center">
                            <div className="mb-2 flex items-center justify-center gap-2">
                                <BookOpen className="h-5 w-5 text-purple-600 md:h-6 md:w-6" />
                                <h1 className="text-xl font-bold text-slate-900 md:text-2xl dark:text-slate-100">
                                    {subject.name}
                                </h1>
                            </div>
                            <p className="text-xs text-slate-600 md:text-sm dark:text-slate-400">
                                {activeChapters.length}{' '}
                                {activeChapters.length > 1
                                    ? 'chapitres'
                                    : 'chapitre'}{' '}
                                à découvrir
                            </p>
                        </div>
                    </div>

                    <div className="relative">
                        {activeChapters.length === 0 ? (
                            <Card className="border-2 border-dashed border-slate-300 bg-slate-50/50 dark:border-slate-700 dark:bg-slate-900/50">
                                <CardContent className="flex flex-col items-center justify-center py-12">
                                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800">
                                        <BookOpen className="h-8 w-8 text-slate-400" />
                                    </div>
                                    <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                                        Aucun chapitre disponible
                                    </h3>
                                    <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                                        Les chapitres seront bientôt ajoutés
                                        pour cette matière.
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-3 md:space-y-4">
                                {activeChapters.map((chapter, index) => {
                                    const isFirst = index === 0;
                                    const isLast =
                                        index === activeChapters.length - 1;
                                    const isCompleted = false;
                                    // const isLocked = index > 0 && !isCompleted;
                                    const isLocked = false;

                                    return (
                                        <div
                                            key={chapter.id}
                                            className="relative"
                                        >
                                            {!isLast && (
                                                <div className="absolute top-10 left-4 h-full w-0.5 bg-linear-to-b from-purple-300 to-blue-300 md:top-12 md:left-5 dark:from-purple-700 dark:to-blue-700" />
                                            )}

                                            <div className="flex gap-2 md:gap-3">
                                                <div className="relative z-10 flex flex-col items-center">
                                                    <div
                                                        className={`flex h-8 w-8 items-center justify-center rounded-full border-4 border-white shadow-lg transition-all duration-300 md:h-10 md:w-10 dark:border-slate-950 ${
                                                            isCompleted
                                                                ? 'bg-linear-to-br from-emerald-400 to-green-500'
                                                                : isLocked
                                                                  ? 'bg-linear-to-br from-slate-300 to-slate-400'
                                                                  : 'bg-linear-to-br from-purple-500 to-blue-500'
                                                        }`}
                                                    >
                                                        {isCompleted ? (
                                                            <CheckCircle2 className="h-4 w-4 text-white md:h-5 md:w-5" />
                                                        ) : isLocked ? (
                                                            <Lock className="h-3 w-3 text-white md:h-4 md:w-4" />
                                                        ) : (
                                                            <Circle className="h-3 w-3 text-white md:h-4 md:w-4" />
                                                        )}
                                                    </div>
                                                </div>

                                                <Card
                                                    className={`group flex-1 transition-all duration-300 ${
                                                        isLocked
                                                            ? 'cursor-not-allowed opacity-60'
                                                            : 'cursor-pointer hover:scale-[1.02] hover:shadow-xl'
                                                    }`}
                                                    onClick={() => {
                                                        !isLocked &&
                                                            handleChapterClick(
                                                                chapter,
                                                                index,
                                                            );
                                                    }}
                                                >
                                                    <CardContent className="p-2 md:p-3">
                                                        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between md:gap-3">
                                                            <div className="flex items-center gap-2">
                                                                <Badge
                                                                    variant="outline"
                                                                    className="text-xs font-semibold"
                                                                >
                                                                    Ch.{' '}
                                                                    {index + 1}
                                                                </Badge>
                                                                {isFirst && (
                                                                    <Badge className="bg-linear-to-r from-purple-500 to-blue-500 text-xs">
                                                                        <Sparkles className="mr-1 h-3 w-3" />
                                                                        Démarrer
                                                                        ici
                                                                    </Badge>
                                                                )}
                                                            </div>

                                                            <h3 className="line-clamp-2 text-xs font-semibold text-slate-900 md:line-clamp-1 md:text-sm dark:text-slate-100">
                                                                {chapter.title}
                                                            </h3>

                                                            <div
                                                                className="flex flex-wrap items-center gap-1.5 md:gap-2"
                                                                onClick={(e) =>
                                                                    e.stopPropagation()
                                                                }
                                                            >
                                                                {chapter.quiz && (
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        className="h-6 gap-1 border-purple-200 bg-purple-50 px-2 text-[10px] text-purple-700 hover:bg-purple-100 hover:text-purple-800 md:h-7 md:gap-1.5 md:px-3 md:text-xs"
                                                                        onClick={() =>
                                                                            router.visit(
                                                                                parent.childSessions.startQuiz.url(
                                                                                    [
                                                                                        child.id,
                                                                                        subject.id,
                                                                                        chapter.id,
                                                                                        chapter
                                                                                            .quiz!
                                                                                            .id,
                                                                                    ],
                                                                                ),
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            isLocked
                                                                        }
                                                                    >
                                                                        <FileQuestion className="h-3 w-3 md:h-3.5 md:w-3.5" />
                                                                        Quiz
                                                                    </Button>
                                                                )}
                                                                {chapter.exercises &&
                                                                    chapter
                                                                        .exercises
                                                                        .length >
                                                                        0 && (
                                                                        <Button
                                                                            size="sm"
                                                                            variant="outline"
                                                                            className="h-6 gap-1 border-orange-200 bg-orange-50 px-2 text-[10px] text-orange-700 hover:bg-orange-100 hover:text-orange-800 md:h-7 md:gap-1.5 md:px-3 md:text-xs"
                                                                            onClick={() =>
                                                                                router.visit(
                                                                                    parent.childSessions.startExercise.url(
                                                                                        [
                                                                                            child.id,
                                                                                            subject.id,
                                                                                            chapter.id,
                                                                                            chapter
                                                                                                .exercises![0]
                                                                                                .id,
                                                                                        ],
                                                                                    ),
                                                                                )
                                                                            }
                                                                            disabled={
                                                                                isLocked
                                                                            }
                                                                        >
                                                                            <Target className="h-3 w-3 md:h-3.5 md:w-3.5" />
                                                                            Exercice
                                                                        </Button>
                                                                    )}
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
