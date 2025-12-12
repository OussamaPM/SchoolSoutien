import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, CheckCircle2, Volume2 } from 'lucide-react';
import { useState } from 'react';

interface ExerciseWord {
    id: number;
    text: string;
    audio_path: string;
}

interface Props {
    words: ExerciseWord[];
    requiredRepetitions: number;
    onComplete: () => void;
    onRetry: () => void;
    onSubmitScore: (score: number, total: number) => void;
}

export default function ChooseWhenReadExercise({
    words,
    requiredRepetitions,
    onComplete,
    onRetry,
    onSubmitScore,
}: Props) {
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [wordProgress, setWordProgress] = useState<Record<number, number>>(
        {},
    );
    const [isCompleted, setIsCompleted] = useState(false);

    const currentWord = words[currentWordIndex];
    const currentProgress = wordProgress[currentWord?.id] || 0;
    const totalProgress = Object.values(wordProgress).reduce(
        (sum, val) => sum + val,
        0,
    );
    const maxProgress = words.length * requiredRepetitions;
    const overallPercentage = (totalProgress / maxProgress) * 100;

    const handlePlayAudio = () => {
        const audio = new Audio(`/storage/${currentWord.audio_path}`);
        audio.play();

        // Increment progress
        const newProgress = Math.min(currentProgress + 1, requiredRepetitions);
        setWordProgress((prev) => ({
            ...prev,
            [currentWord.id]: newProgress,
        }));
    };

    const handleNext = () => {
        if (currentWordIndex < words.length - 1) {
            setCurrentWordIndex(currentWordIndex + 1);
        } else {
            // Check if all words are completed
            const allCompleted = words.every(
                (word) => (wordProgress[word.id] || 0) >= requiredRepetitions,
            );
            if (allCompleted) {
                setIsCompleted(true);
                // Submit score: 100 if all words completed
                const score = words.length;
                const total = words.length;
                onSubmitScore(score, total);
            }
        }
    };

    const handlePrevious = () => {
        if (currentWordIndex > 0) {
            setCurrentWordIndex(currentWordIndex - 1);
        }
    };

    const isCurrentWordComplete = currentProgress >= requiredRepetitions;
    const canGoNext =
        currentWordIndex < words.length - 1 || isCurrentWordComplete;

    if (isCompleted) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <Card className="w-full max-w-md border-2 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20">
                    <CardContent className="p-8 text-center">
                        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-500">
                            <CheckCircle2 className="h-12 w-12 text-white" />
                        </div>
                        <h2 className="mb-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
                            Excellent travail !
                        </h2>
                        <p className="mb-6 text-slate-600 dark:text-slate-400">
                            Tu as lu tous les mots {requiredRepetitions} fois
                        </p>
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                onClick={onRetry}
                                className="flex-1"
                            >
                                Recommencer
                            </Button>
                            <Button onClick={onComplete} className="flex-1">
                                Terminer
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!currentWord) {
        return (
            <div className="rounded-lg border-2 border-dashed border-slate-300 p-12 text-center">
                <p className="text-slate-600">Aucun mot disponible</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Overall Progress */}
            <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                        Progression totale
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">
                        {totalProgress}/{maxProgress}
                    </span>
                </div>
                <Progress value={overallPercentage} className="h-3" />
            </div>

            {/* Word Card */}
            <Card className="border-2 border-blue-200 dark:border-blue-800">
                <CardContent className="p-8 md:p-12">
                    <div className="mb-6 text-center">
                        <div className="mb-2 text-sm font-semibold text-blue-600 dark:text-blue-400">
                            Mot {currentWordIndex + 1} sur {words.length}
                        </div>
                        <h2 className="text-4xl font-bold text-slate-900 md:text-6xl dark:text-slate-100">
                            {currentWord.text}
                        </h2>
                    </div>

                    {/* Repetition Progress */}
                    <div className="mb-6">
                        <div className="mb-2 text-center text-sm font-medium text-slate-700 dark:text-slate-300">
                            Écoute {currentProgress}/{requiredRepetitions} fois
                        </div>
                        <div className="flex justify-center gap-2">
                            {Array.from({ length: requiredRepetitions }).map(
                                (_, i) => (
                                    <div
                                        key={i}
                                        className={`h-3 w-12 rounded-full transition-colors ${
                                            i < currentProgress
                                                ? 'bg-green-500'
                                                : 'bg-slate-200 dark:bg-slate-700'
                                        }`}
                                    />
                                ),
                            )}
                        </div>
                    </div>

                    {/* Play Button */}
                    <div className="mb-8 flex justify-center">
                        <Button
                            size="lg"
                            onClick={handlePlayAudio}
                            disabled={isCurrentWordComplete}
                            className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 hover:scale-105 disabled:opacity-50"
                        >
                            {isCurrentWordComplete ? (
                                <CheckCircle2 className="h-12 w-12" />
                            ) : (
                                <Volume2 className="h-12 w-12" />
                            )}
                        </Button>
                    </div>

                    {/* Navigation */}
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={handlePrevious}
                            disabled={currentWordIndex === 0}
                            className="flex-1"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Précédent
                        </Button>
                        <Button
                            onClick={handleNext}
                            disabled={!canGoNext}
                            className="flex-1"
                        >
                            {currentWordIndex === words.length - 1
                                ? 'Terminer'
                                : 'Suivant'}
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Instructions */}
            <Card className="border-blue-100 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/20">
                <CardContent className="p-4">
                    <p className="text-center text-sm text-blue-900 dark:text-blue-100">
                        📖 Clique sur le bouton pour écouter et répéter le mot{' '}
                        {requiredRepetitions} fois
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
