import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Chapter } from '@/pages/admin/educational-programs/chapters';
import { Subject } from '@/pages/admin/educational-programs/subjects';
import { Head, router } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowRight,
    BookOpen,
    CheckCircle,
    Clock,
    FileQuestion,
    GraduationCap,
    RefreshCw,
    Sparkles,
    Star,
    TrendingDown,
    TrendingUp,
    Trophy,
    X,
} from 'lucide-react';
import { ChildProfile } from './index';

export interface Answer {
    id: number;
    answer: string;
    is_correct: boolean;
}

export interface Question {
    id: number;
    question: string;
    answers: Answer[];
}

export interface QuizAttempt {
    id: number;
    score: number;
    correct_answers: number;
    total_questions: number;
    time_spent: number;
    completed_at: string;
}

export interface QuestionResult {
    question: Question;
    userAnswer: Answer | null;
    correctAnswer: Answer;
    isCorrect: boolean;
}

interface Props {
    child: ChildProfile;
    subject: Subject;
    chapter: Chapter;
    quiz: any;
    attempt: QuizAttempt;
    previousAttempt: QuizAttempt | null;
    questionResults: QuestionResult[];
}

export default function QuizResults({
    child,
    subject,
    chapter,
    quiz,
    attempt,
    previousAttempt,
    questionResults,
}: Props) {
    const percentage = Math.round(
        (attempt.correct_answers / attempt.total_questions) * 100,
    );
    const isPassed = percentage >= 70;
    const hasImproved =
        previousAttempt && attempt.score > previousAttempt.score;
    const scoreDifference = previousAttempt
        ? attempt.score - previousAttempt.score
        : 0;

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    const handleRetakeQuiz = () => {
        router.visit(
            `/parent/child-sessions/${child.id}/${subject.id}/chapter/${chapter.id}/quiz/${quiz.id}`,
        );
    };

    const handleBackToChapter = () => {
        router.visit(
            `/parent/child-sessions/${child.id}/${subject.id}/chapter/${chapter.id}`,
        );
    };

    return (
        <AppLayout>
            <Head title={`Résultats - ${quiz.title} - ${child.name}`} />

            <div className="min-h-screen">
                <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
                    <div className="mb-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleBackToChapter}
                                className="w-fit"
                            >
                                <ArrowLeft className="mr-1.5 h-4 w-4" />
                                Retour au chapitre
                            </Button>

                            <div className="flex flex-wrap items-center gap-2">
                                {child.education_level && (
                                    <Badge
                                        variant="outline"
                                        className="border-2 border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
                                    >
                                        <GraduationCap className="mr-1.5 h-3.5 w-3.5" />
                                        {child.education_level.name}
                                    </Badge>
                                )}
                                <Badge
                                    variant="outline"
                                    className="border-2 border-purple-200 bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700"
                                >
                                    <BookOpen className="mr-1.5 h-3.5 w-3.5" />
                                    {subject.name}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    <Card
                        className={`mb-6 overflow-hidden rounded-3xl border-2 shadow-2xl ${
                            isPassed
                                ? 'border-green-200 bg-linear-to-br from-green-50 to-emerald-50'
                                : 'border-amber-200 bg-linear-to-br from-amber-50 to-orange-50'
                        }`}
                    >
                        <CardContent className="p-8 text-center">
                            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-lg">
                                {isPassed ? (
                                    <Trophy className="h-12 w-12 text-green-600" />
                                ) : (
                                    <Star className="h-12 w-12 text-amber-600" />
                                )}
                            </div>
                            <h1 className="mb-2 text-3xl font-bold text-slate-900">
                                {isPassed
                                    ? 'Félicitations ! 🎉'
                                    : 'Continuez vos efforts ! 💪'}
                            </h1>
                            <p className="mb-6 text-lg text-slate-600">
                                {isPassed
                                    ? 'Vous avez réussi le quiz avec brio !'
                                    : 'Vous pouvez réessayer pour améliorer votre score !'}
                            </p>
                            <div className="flex items-center justify-center gap-2">
                                <div
                                    className={`rounded-full px-6 py-3 text-4xl font-black ${
                                        isPassed
                                            ? 'bg-green-500 text-white'
                                            : 'bg-amber-500 text-white'
                                    }`}
                                >
                                    {percentage}%
                                </div>
                                {hasImproved && (
                                    <div className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
                                        <TrendingUp className="h-4 w-4" />+
                                        {scoreDifference}%
                                    </div>
                                )}
                                {previousAttempt &&
                                    !hasImproved &&
                                    scoreDifference < 0 && (
                                        <div className="flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">
                                            <TrendingDown className="h-4 w-4" />
                                            {scoreDifference}%
                                        </div>
                                    )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Stats Grid */}
                    <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                        <Card className="border-2 border-green-100 bg-green-50/50">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                    <div>
                                        <p className="text-xs text-slate-600">
                                            Correctes
                                        </p>
                                        <p className="text-lg font-bold text-green-600">
                                            {attempt.correct_answers}/
                                            {attempt.total_questions}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-2 border-red-100 bg-red-50/50">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-2">
                                    <X className="h-5 w-5 text-red-600" />
                                    <div>
                                        <p className="text-xs text-slate-600">
                                            Incorrectes
                                        </p>
                                        <p className="text-lg font-bold text-red-600">
                                            {attempt.total_questions -
                                                attempt.correct_answers}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-2 border-blue-100 bg-blue-50/50">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-blue-600" />
                                    <div>
                                        <p className="text-xs text-slate-600">
                                            Temps
                                        </p>
                                        <p className="text-lg font-bold text-blue-600">
                                            {formatTime(
                                                attempt.time_spent || 0,
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {previousAttempt && (
                            <Card className="border-2 border-purple-100 bg-purple-50/50">
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="h-5 w-5 text-purple-600" />
                                        <div>
                                            <p className="text-xs text-slate-600">
                                                Ancien score
                                            </p>
                                            <p className="text-lg font-bold text-purple-600">
                                                {previousAttempt.score}%
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Question Results */}
                    <Card className="mb-6 rounded-3xl border-2 border-slate-100 shadow-lg">
                        <CardHeader className="bg-linear-to-r from-slate-50 to-blue-50">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <FileQuestion className="h-5 w-5 text-purple-600" />
                                Détails des réponses
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                {questionResults.map((result, index) => (
                                    <div
                                        key={result.question.id}
                                        className={`rounded-2xl border-2 p-4 ${
                                            result.isCorrect
                                                ? 'border-green-200 bg-green-50/50'
                                                : 'border-red-200 bg-red-50/50'
                                        }`}
                                    >
                                        <div className="mb-3 flex items-start gap-3">
                                            <div
                                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white ${
                                                    result.isCorrect
                                                        ? 'bg-green-500'
                                                        : 'bg-red-500'
                                                }`}
                                            >
                                                {result.isCorrect ? (
                                                    <CheckCircle className="h-5 w-5" />
                                                ) : (
                                                    <X className="h-5 w-5" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-semibold text-slate-900">
                                                    Question {index + 1}
                                                </p>
                                                <p className="mt-1 text-slate-700">
                                                    {result.question.question}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="ml-11 space-y-2">
                                            {result.userAnswer && (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <span className="font-medium text-slate-600">
                                                        Votre réponse :
                                                    </span>
                                                    <span
                                                        className={`rounded-lg px-2 py-1 ${
                                                            result.isCorrect
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-red-100 text-red-800'
                                                        }`}
                                                    >
                                                        {
                                                            result.userAnswer
                                                                .answer
                                                        }
                                                    </span>
                                                </div>
                                            )}
                                            {!result.isCorrect && (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <span className="font-medium text-slate-600">
                                                        Bonne réponse :
                                                    </span>
                                                    <span className="rounded-lg bg-green-100 px-2 py-1 text-green-800">
                                                        {
                                                            result.correctAnswer
                                                                .answer
                                                        }
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-4">
                        <Button
                            onClick={handleRetakeQuiz}
                            className="flex-1 rounded-2xl bg-linear-to-r from-purple-500 to-pink-600 px-6 py-3 font-bold shadow-lg hover:scale-105"
                        >
                            <RefreshCw className="mr-2 h-5 w-5" />
                            Refaire le quiz
                        </Button>
                        <Button
                            onClick={handleBackToChapter}
                            variant="outline"
                            className="flex-1 rounded-2xl border-2 px-6 py-3 font-semibold"
                        >
                            <ArrowRight className="mr-2 h-5 w-5" />
                            Continuer le cours
                        </Button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
