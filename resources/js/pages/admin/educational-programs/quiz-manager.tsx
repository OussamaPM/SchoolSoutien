import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { GripVertical, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Category } from '.';
import { Chapter } from './chapters';
import { EducationLevel } from './levels';
import { Subject } from './subjects';

const breadcrumbs = (
    levelId?: number,
    levelName?: string,
    categoryId?: number,
    categoryName?: string,
    subjectId?: number,
    subjectName?: string,
    chapterId?: number,
    chapterTitle?: string,
): BreadcrumbItem[] => [
    {
        title: 'Programmes',
        href: `/admin/educational-programs/education-level-categories`,
    },
    {
        title: categoryName || 'Niveaux',
        href: `/admin/educational-programs/education-level-categories/${categoryId}`,
    },
    {
        title: levelName || 'Matières',
        href: `/admin/educational-programs/education-level-categories/${categoryId}/${levelId}`,
    },
    {
        title: subjectName || 'Chapitres',
        href: `/admin/educational-programs/education-level-categories/${categoryId}/${levelId}/subjects/${subjectId}`,
    },
    {
        title: chapterTitle || 'Chapitre',
        href: `/admin/educational-programs/education-level-categories/${categoryId}/${levelId}/subjects/${subjectId}/chapter/${chapterId}`,
    },
    {
        title: 'Quiz',
        href: '#',
    },
];

interface Answer {
    id?: number;
    answer: string;
    is_correct: boolean;
    position: number;
}

interface Question {
    id?: number;
    question: string;
    position: number;
    answers: Answer[];
}

interface QuizData {
    title: string;
    description: string;
    questions: Question[];
}

interface Props {
    category: Category;
    level: EducationLevel;
    subject: Subject;
    chapter: Chapter;
    quiz?: {
        id: number;
        title: string;
        description: string;
        questions: {
            id: number;
            question: string;
            position: number;
            answers: {
                id: number;
                answer: string;
                is_correct: boolean;
                position: number;
            }[];
        }[];
    };
}

export default function QuizManager({
    category,
    level,
    subject,
    chapter,
    quiz,
}: Props) {
    const [questions, setQuestions] = useState<Question[]>(
        quiz?.questions || [
            {
                question: '',
                position: 0,
                answers: [
                    { answer: '', is_correct: false, position: 0 },
                    { answer: '', is_correct: false, position: 1 },
                ],
            },
        ],
    );

    const { data, setData, post, put, processing } = useForm<QuizData>({
        title: quiz?.title || '',
        description: quiz?.description || '',
        questions: questions,
    });

    const addQuestion = () => {
        const newQuestion: Question = {
            question: '',
            position: questions.length,
            answers: [
                { answer: '', is_correct: false, position: 0 },
                { answer: '', is_correct: false, position: 1 },
            ],
        };
        const updatedQuestions = [...questions, newQuestion];
        setQuestions(updatedQuestions);
        setData('questions', updatedQuestions);
    };

    const removeQuestion = (questionIndex: number) => {
        const updatedQuestions = questions.filter(
            (_, idx) => idx !== questionIndex,
        );
        setQuestions(updatedQuestions);
        setData('questions', updatedQuestions);
    };

    const updateQuestion = (questionIndex: number, value: string) => {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].question = value;
        setQuestions(updatedQuestions);
        setData('questions', updatedQuestions);
    };

    const addAnswer = (questionIndex: number) => {
        const updatedQuestions = [...questions];
        const newAnswer: Answer = {
            answer: '',
            is_correct: false,
            position: updatedQuestions[questionIndex].answers.length,
        };
        updatedQuestions[questionIndex].answers.push(newAnswer);
        setQuestions(updatedQuestions);
        setData('questions', updatedQuestions);
    };

    const removeAnswer = (questionIndex: number, answerIndex: number) => {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].answers = updatedQuestions[
            questionIndex
        ].answers.filter((_, idx) => idx !== answerIndex);
        setQuestions(updatedQuestions);
        setData('questions', updatedQuestions);
    };

    const updateAnswer = (
        questionIndex: number,
        answerIndex: number,
        value: string,
    ) => {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].answers[answerIndex].answer = value;
        setQuestions(updatedQuestions);
        setData('questions', updatedQuestions);
    };

    const toggleCorrectAnswer = (
        questionIndex: number,
        answerIndex: number,
    ) => {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].answers[answerIndex].is_correct =
            !updatedQuestions[questionIndex].answers[answerIndex].is_correct;
        setQuestions(updatedQuestions);
        setData('questions', updatedQuestions);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!data.title) {
            toast.error('Le titre du quiz est obligatoire');
            return;
        }

        if (questions.length === 0) {
            toast.error('Ajoutez au moins une question');
            return;
        }

        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            if (!q.question.trim()) {
                toast.error(`La question ${i + 1} est vide`);
                return;
            }

            if (q.answers.length < 2) {
                toast.error(
                    `La question ${i + 1} doit avoir au moins 2 réponses`,
                );
                return;
            }

            const hasCorrectAnswer = q.answers.some((a) => a.is_correct);
            if (!hasCorrectAnswer) {
                toast.error(
                    `La question ${i + 1} doit avoir au moins une bonne réponse`,
                );
                return;
            }

            for (let j = 0; j < q.answers.length; j++) {
                if (!q.answers[j].answer.trim()) {
                    toast.error(
                        `La réponse ${j + 1} de la question ${i + 1} est vide`,
                    );
                    return;
                }
            }
        }

        const url = quiz
            ? `/admin/educational-programs/education-level-categories/${category.id}/${level.id}/subjects/${subject.id}/chapter/${chapter.id}/quiz/${quiz.id}`
            : `/admin/educational-programs/education-level-categories/${category.id}/${level.id}/subjects/${subject.id}/chapter/${chapter.id}/quiz`;

        const method = quiz ? 'put' : 'post';

        router[method](url, data, {
            onSuccess: () => {
                toast.success(
                    quiz
                        ? 'Quiz mis à jour avec succès'
                        : 'Quiz créé avec succès',
                );
            },
            onError: (errors) => {
                toast.error('Erreur lors de la sauvegarde du quiz');
                console.error(errors);
            },
        });
    };

    return (
        <AppLayout
            breadcrumbs={breadcrumbs(
                level?.id,
                level?.name,
                category?.id,
                category?.name,
                subject?.id,
                subject?.name,
                chapter?.id,
                chapter?.title,
            )}
        >
            <Head title={`Quiz — ${chapter?.title || ''}`} />

            <div className="mx-auto w-full max-w-4xl px-6 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        {quiz ? 'Modifier le quiz' : 'Créer un quiz'}
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Chapitre: {chapter.title}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Quiz Title & Description */}
                    <div className="rounded-2xl border-2 border-blue-100 bg-white p-6 shadow-sm">
                        <div className="space-y-4">
                            <div>
                                <Label
                                    htmlFor="title"
                                    className="text-base font-semibold"
                                >
                                    Titre du quiz *
                                </Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) =>
                                        setData('title', e.target.value)
                                    }
                                    placeholder="Ex: Quiz sur l'algèbre"
                                    className="mt-2"
                                />
                            </div>
                            <div>
                                <Label
                                    htmlFor="description"
                                    className="text-base font-semibold"
                                >
                                    Description
                                </Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                    placeholder="Description du quiz (optionnel)"
                                    className="mt-2"
                                    rows={3}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Questions */}
                    <div className="space-y-6">
                        {questions.map((question, questionIndex) => (
                            <div
                                key={questionIndex}
                                className="rounded-2xl border-2 border-purple-100 bg-white p-6 shadow-sm"
                            >
                                <div className="mb-4 flex items-start justify-between">
                                    <div className="flex items-center gap-2">
                                        <GripVertical className="h-5 w-5 text-gray-400" />
                                        <Label className="text-lg font-semibold">
                                            Question {questionIndex + 1}
                                        </Label>
                                    </div>
                                    {questions.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                removeQuestion(questionIndex)
                                            }
                                            className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>

                                <Textarea
                                    value={question.question}
                                    onChange={(e) =>
                                        updateQuestion(
                                            questionIndex,
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Entrez votre question"
                                    className="mb-4"
                                    rows={2}
                                />

                                <div className="space-y-3">
                                    <Label className="text-sm font-medium text-gray-700">
                                        Réponses (cochez les bonnes réponses)
                                    </Label>
                                    {question.answers.map(
                                        (answer, answerIndex) => (
                                            <div
                                                key={answerIndex}
                                                className="flex items-center gap-3"
                                            >
                                                <Checkbox
                                                    checked={answer.is_correct}
                                                    onCheckedChange={() =>
                                                        toggleCorrectAnswer(
                                                            questionIndex,
                                                            answerIndex,
                                                        )
                                                    }
                                                    className="h-5 w-5"
                                                />
                                                <Input
                                                    value={answer.answer}
                                                    onChange={(e) =>
                                                        updateAnswer(
                                                            questionIndex,
                                                            answerIndex,
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder={`Réponse ${answerIndex + 1}`}
                                                    className={
                                                        answer.is_correct
                                                            ? 'border-green-300 bg-green-50'
                                                            : ''
                                                    }
                                                />
                                                {question.answers.length >
                                                    2 && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            removeAnswer(
                                                                questionIndex,
                                                                answerIndex,
                                                            )
                                                        }
                                                        className="shrink-0 text-red-600 hover:bg-red-50"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        ),
                                    )}

                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => addAnswer(questionIndex)}
                                        className="mt-2"
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Ajouter une réponse
                                    </Button>
                                </div>
                            </div>
                        ))}

                        <Button
                            type="button"
                            variant="outline"
                            onClick={addQuestion}
                            className="w-full rounded-xl border-2 border-dashed border-purple-200 py-6 text-purple-600 hover:border-purple-300 hover:bg-purple-50"
                        >
                            <Plus className="mr-2 h-5 w-5" />
                            Ajouter une question
                        </Button>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                                router.visit(
                                    `/admin/educational-programs/education-level-categories/${category.id}/${level.id}/subjects/${subject.id}/chapter/${chapter.id}`,
                                )
                            }
                        >
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-linear-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                        >
                            {processing
                                ? 'Enregistrement...'
                                : quiz
                                  ? 'Mettre à jour'
                                  : 'Créer le quiz'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
