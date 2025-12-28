import { Badge } from '@/components/ui/badge';
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
import { ArrowLeft, Clock, FileQuestion, Play, Trophy } from 'lucide-react';
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

interface QuizAttempt {
    id: number;
    score: number;
    completed_at: string;
}

interface Quiz {
    id: number;
    title: string;
    description: string | null;
    attempts_history: QuizAttempt[];
}

interface Props {
    child: ChildProfile;
    subject: EducationalSubject;
    chapter: Chapter & { quiz?: Quiz };
}

const ViewChapterQuizzes: React.FC<Props> = ({ child, subject, chapter }) => {
    return (
        <AppLayout>
            <Head title={`Quiz - ${chapter.title}`} />

            <div className="min-h-screen dark:from-gray-900 dark:to-gray-800">
                <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
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
                            🧠 Quiz !
                        </h1>
                        <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
                            Chapitre :{' '}
                            <span className="font-semibold text-purple-600 dark:text-purple-400">
                                {chapter.title}
                            </span>{' '}
                            - Matière :{' '}
                            <span className="font-semibold text-pink-600 dark:text-pink-400">
                                {subject.name}
                            </span>
                        </p>
                    </div>

                    {chapter.quiz ? (
                        <div className="mx-auto max-w-2xl">
                            <Card className="group relative overflow-hidden rounded-3xl border-2 border-purple-200 bg-purple-50 shadow-xl dark:border-purple-800 dark:bg-purple-950/20">
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 opacity-50 dark:from-purple-950/30 dark:to-pink-950/30" />
                                <CardHeader className="relative z-10 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                            {chapter.quiz.title}
                                        </CardTitle>
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500">
                                            <FileQuestion className="h-6 w-6 text-white" />
                                        </div>
                                    </div>
                                    <CardDescription className="text-gray-600 dark:text-gray-300">
                                        {chapter.quiz.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="relative z-10 p-6">
                                    <div className="space-y-6">
                                        {chapter.quiz.attempts_history.length >
                                        0 ? (
                                            <div className="rounded-2xl bg-white/80 p-4 backdrop-blur-sm dark:bg-gray-800/80">
                                                <h4 className="mb-4 flex items-center text-lg font-semibold text-gray-900 dark:text-white">
                                                    <Trophy className="mr-3 h-5 w-5 text-yellow-500" />
                                                    Historique des tentatives
                                                </h4>
                                                <div className="space-y-3">
                                                    {chapter.quiz.attempts_history
                                                        .slice(0, 5)
                                                        .map((attempt) => (
                                                            <div
                                                                key={attempt.id}
                                                                className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-700"
                                                            >
                                                                <div className="flex items-center space-x-3">
                                                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500">
                                                                        <Clock className="h-4 w-4 text-white" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                                            {new Date(
                                                                                attempt.completed_at,
                                                                            ).toLocaleDateString(
                                                                                'fr-FR',
                                                                                {
                                                                                    day: '2-digit',
                                                                                    month: '2-digit',
                                                                                    year: 'numeric',
                                                                                    hour: '2-digit',
                                                                                    minute: '2-digit',
                                                                                },
                                                                            )}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <Badge
                                                                    variant={
                                                                        attempt.score >=
                                                                        70
                                                                            ? 'default'
                                                                            : attempt.score >=
                                                                                50
                                                                              ? 'secondary'
                                                                              : 'destructive'
                                                                    }
                                                                    className="text-sm font-bold"
                                                                >
                                                                    {
                                                                        attempt.score
                                                                    }
                                                                    %
                                                                </Badge>
                                                            </div>
                                                        ))}
                                                </div>
                                                {chapter.quiz.attempts_history
                                                    .length > 5 && (
                                                    <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                                                        Et{' '}
                                                        {chapter.quiz
                                                            .attempts_history
                                                            .length - 5}{' '}
                                                        autres tentatives...
                                                    </p>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="rounded-2xl bg-gray-100/80 p-4 text-center backdrop-blur-sm dark:bg-gray-700/80">
                                                <div className="flex justify-center">
                                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-400">
                                                        <FileQuestion className="h-6 w-6 text-white" />
                                                    </div>
                                                </div>
                                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                                                    Aucune tentative enregistrée
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                                <CardFooter className="relative z-10 p-6">
                                    <Button
                                        asChild
                                        className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white transition-all duration-300 hover:shadow-lg"
                                    >
                                        <Link
                                            href={`/parent/child-sessions/${child.id}/${subject.id}/chapter/${chapter.id}/quiz/${chapter.quiz.id}`}
                                        >
                                            <Play className="mr-2 h-5 w-5" />
                                            Commencer le quiz
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>
                    ) : (
                        <div className="flex min-h-[400px] items-center justify-center">
                            <div className="text-center">
                                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                                    <FileQuestion className="h-10 w-10 text-gray-400" />
                                </div>
                                <h3 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">
                                    Aucun quiz disponible
                                </h3>
                                <p className="mt-2 text-gray-600 dark:text-gray-300">
                                    Ce chapitre ne contient pas encore de quiz.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
};

export default ViewChapterQuizzes;
