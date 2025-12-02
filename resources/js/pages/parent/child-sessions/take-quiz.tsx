import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import AppLayout from '@/layouts/app-layout';
import { Chapter } from '@/pages/admin/educational-programs/chapters';
import { Subject } from '@/pages/admin/educational-programs/subjects';
import { Head, router, useForm } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowLeft,
    ArrowRight,
    BookOpen,
    CheckCircle,
    Clock,
    FileQuestion,
    GraduationCap,
    Sparkles,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ChildProfile } from './index';

interface QuizAttempt {
    id: number;
    score: number;
    correct_answers: number;
    total_questions: number;
    completed_at: string;
}

interface Props {
    child: ChildProfile;
    subject: Subject;
    chapter: Chapter;
    quiz: {
        id: number;
        title: string;
        description: string | null;
        questions: {
            id: number;
            question: string;
            answers: {
                id: number;
                answer: string;
                is_correct: boolean;
            }[];
        }[];
    };
    lastAttempt: QuizAttempt | null;
    attemptCount: number;
}

export default function TakeQuiz({
    child,
    subject,
    chapter,
    quiz,
    lastAttempt,
    attemptCount,
}: Props) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [startTime] = useState(new Date());
    const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

    const { data, setData, post, processing } = useForm({
        answers: {} as Record<number, number>,
        time_spent: 0,
        started_at: startTime.toISOString(),
    });

    const questions = quiz.questions || [];
    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    const answeredCount = Object.keys(data.answers).length;

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeElapsed(
                Math.floor((new Date().getTime() - startTime.getTime()) / 1000),
            );
        }, 1000);

        return () => clearInterval(timer);
    }, [startTime]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSelectAnswer = (answerId: number) => {
        if (!currentQuestion) return;

        setData('answers', {
            ...data.answers,
            [currentQuestion.id]: answerId,
        });
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleSubmit = () => {
        if (answeredCount < questions.length) {
            setShowConfirmSubmit(true);
            return;
        }

        submitQuiz();
    };

    const submitQuiz = () => {
        setData('time_spent', timeElapsed);

        post(
            `/parent/child-sessions/${child.id}/${subject.id}/chapter/${chapter.id}/quiz/${quiz.id}`,
            {
                preserveScroll: true,
                onError: () => {
                    toast.error('Erreur lors de la soumission du quiz');
                },
            },
        );
    };

    if (!currentQuestion) {
        return <div>No questions available</div>;
    }

    return (
        <AppLayout>
            <Head title={`Quiz - ${quiz.title} - ${child.name}`} />

            <div className="min-h-screen">
                <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
                    <div className="mb-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                    router.visit(
                                        `/parent/child-sessions/${child.id}/${subject.id}/chapter/${chapter.id}`,
                                    )
                                }
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

                        <div className="mt-6">
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-purple-500 to-pink-500 shadow-lg">
                                    <FileQuestion className="h-6 w-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl dark:text-slate-100">
                                        {quiz.title}
                                    </h1>
                                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                        {quiz.description || chapter.title}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Bar */}
                    <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                        <Card className="border-2 border-blue-100 bg-blue-50/50">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-blue-600" />
                                    <div>
                                        <p className="text-xs text-slate-600">
                                            Temps écoulé
                                        </p>
                                        <p className="text-lg font-bold text-blue-600">
                                            {formatTime(timeElapsed)}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-2 border-purple-100 bg-purple-50/50">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-2">
                                    <FileQuestion className="h-5 w-5 text-purple-600" />
                                    <div>
                                        <p className="text-xs text-slate-600">
                                            Questions
                                        </p>
                                        <p className="text-lg font-bold text-purple-600">
                                            {currentQuestionIndex + 1}/
                                            {questions.length}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-2 border-green-100 bg-green-50/50">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                    <div>
                                        <p className="text-xs text-slate-600">
                                            Répondues
                                        </p>
                                        <p className="text-lg font-bold text-green-600">
                                            {answeredCount}/{questions.length}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {lastAttempt && (
                            <Card className="border-2 border-amber-100 bg-amber-50/50">
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="h-5 w-5 text-amber-600" />
                                        <div>
                                            <p className="text-xs text-slate-600">
                                                Dernier score
                                            </p>
                                            <p className="text-lg font-bold text-amber-600">
                                                {lastAttempt.score}%
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-6">
                        <div className="mb-2 flex items-center justify-between text-sm">
                            <span className="font-medium text-slate-700">
                                Progression
                            </span>
                            <span className="font-bold text-purple-600">
                                {Math.round(progress)}%
                            </span>
                        </div>
                        <Progress value={progress} className="h-3" />
                    </div>

                    {/* Question Card */}
                    <Card className="mb-6 rounded-3xl border-2 border-purple-100 shadow-lg">
                        <CardHeader className="bg-linear-to-r from-purple-50 to-pink-50">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500 text-white">
                                    {currentQuestionIndex + 1}
                                </div>
                                Question {currentQuestionIndex + 1}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <h2 className="mb-6 text-xl font-semibold text-slate-900">
                                {currentQuestion.question}
                            </h2>

                            <div className="space-y-3">
                                {currentQuestion.answers?.map((answer) => {
                                    const isSelected =
                                        data.answers[currentQuestion.id] ===
                                        answer.id;

                                    return (
                                        <button
                                            key={answer.id}
                                            onClick={() =>
                                                handleSelectAnswer(answer.id)
                                            }
                                            className={`w-full rounded-2xl border-2 p-4 text-left transition-all ${
                                                isSelected
                                                    ? 'border-purple-500 bg-purple-50 shadow-md'
                                                    : 'border-slate-200 bg-white hover:border-purple-300 hover:bg-purple-50/50'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                                                        isSelected
                                                            ? 'border-purple-500 bg-purple-500'
                                                            : 'border-slate-300'
                                                    }`}
                                                >
                                                    {isSelected && (
                                                        <div className="h-2 w-2 rounded-full bg-white" />
                                                    )}
                                                </div>
                                                <span
                                                    className={`font-medium ${
                                                        isSelected
                                                            ? 'text-purple-900'
                                                            : 'text-slate-700'
                                                    }`}
                                                >
                                                    {answer.answer}
                                                </span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Navigation */}
                    <div className="flex items-center justify-between gap-4">
                        <Button
                            variant="outline"
                            onClick={handlePrevious}
                            disabled={currentQuestionIndex === 0}
                            className="rounded-2xl border-2"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Précédent
                        </Button>

                        {currentQuestionIndex === questions.length - 1 ? (
                            <Button
                                onClick={handleSubmit}
                                disabled={processing}
                                className="rounded-2xl bg-linear-to-r from-green-500 to-emerald-600 px-6 font-bold shadow-lg hover:scale-105"
                            >
                                {processing ? (
                                    <>
                                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        Soumission...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="mr-2 h-5 w-5" />
                                        Terminer le quiz
                                    </>
                                )}
                            </Button>
                        ) : (
                            <Button
                                onClick={handleNext}
                                className="rounded-2xl bg-linear-to-r from-purple-500 to-pink-600 px-6 font-bold"
                            >
                                Suivant
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        )}
                    </div>

                    {/* Confirmation Dialog */}
                    {showConfirmSubmit && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                            <Card className="w-full max-w-md rounded-3xl border-2 border-amber-200">
                                <CardHeader className="bg-linear-to-r from-amber-50 to-orange-50">
                                    <CardTitle className="flex items-center gap-2">
                                        <AlertCircle className="h-6 w-6 text-amber-600" />
                                        Questions non répondues
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <p className="mb-6 text-slate-700">
                                        Vous n'avez répondu qu'à {answeredCount}{' '}
                                        question(s) sur {questions.length}.
                                        Voulez-vous vraiment soumettre le quiz ?
                                    </p>
                                    <div className="flex gap-3">
                                        <Button
                                            variant="outline"
                                            onClick={() =>
                                                setShowConfirmSubmit(false)
                                            }
                                            className="flex-1 rounded-2xl border-2"
                                        >
                                            Continuer
                                        </Button>
                                        <Button
                                            onClick={submitQuiz}
                                            className="flex-1 rounded-2xl bg-linear-to-r from-green-500 to-emerald-600 font-bold"
                                        >
                                            Soumettre
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
