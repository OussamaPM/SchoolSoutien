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
    GraduationCap,
    Lock,
    Sparkles,
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
                <div className="mx-auto max-w-4xl px-6 py-6">
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
                                <BookOpen className="h-6 w-6 text-purple-600" />
                                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                                    {subject.name}
                                </h1>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
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
                            <div className="space-y-4">
                                {activeChapters.map((chapter, index) => {
                                    const isFirst = index === 0;
                                    const isLast =
                                        index === activeChapters.length - 1;
                                    const isCompleted = false;
                                    const isLocked = index > 0 && !isCompleted;

                                    return (
                                        <div
                                            key={chapter.id}
                                            className="relative"
                                        >
                                            {!isLast && (
                                                <div className="absolute top-12 left-5 h-full w-0.5 bg-linear-to-b from-purple-300 to-blue-300 dark:from-purple-700 dark:to-blue-700" />
                                            )}

                                            <div className="flex gap-3">
                                                <div className="relative z-10 flex flex-col items-center">
                                                    <div
                                                        className={`flex h-10 w-10 items-center justify-center rounded-full border-4 border-white shadow-lg transition-all duration-300 dark:border-slate-950 ${
                                                            isCompleted
                                                                ? 'bg-linear-to-br from-emerald-400 to-green-500'
                                                                : isLocked
                                                                  ? 'bg-linear-to-br from-slate-300 to-slate-400'
                                                                  : 'bg-linear-to-br from-purple-500 to-blue-500'
                                                        }`}
                                                    >
                                                        {isCompleted ? (
                                                            <CheckCircle2 className="h-5 w-5 text-white" />
                                                        ) : isLocked ? (
                                                            <Lock className="h-4 w-4 text-white" />
                                                        ) : (
                                                            <Circle className="h-4 w-4 text-white" />
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
                                                    <CardContent className="p-3">
                                                        <div className="flex items-center gap-2">
                                                            <Badge
                                                                variant="outline"
                                                                className="text-xs font-semibold"
                                                            >
                                                                Ch. {index + 1}
                                                            </Badge>
                                                            {isFirst && (
                                                                <Badge className="bg-linear-to-r from-purple-500 to-blue-500 text-xs">
                                                                    <Sparkles className="mr-1 h-3 w-3" />
                                                                    Démarrer ici
                                                                </Badge>
                                                            )}

                                                            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                                                {chapter.title}
                                                            </h3>
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
