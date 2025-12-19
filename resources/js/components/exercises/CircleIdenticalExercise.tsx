import { Card } from '@/components/ui/card';
import { CheckCircle2, CircleDot, XCircle } from 'lucide-react';
import { useState } from 'react';

interface OtherWord {
    word: string;
    is_valid: boolean;
}

interface WordSequence {
    model_word: string;
    other_words: OtherWord[];
}

interface CircleIdenticalExerciseProps {
    instruction: string;
    wordSequences: WordSequence[];
    onSubmitScore: (score: number, total: number) => void;
    onNext?: () => void;
}

export default function CircleIdenticalExercise({
    instruction,
    wordSequences,
    onSubmitScore,
    onNext,
}: CircleIdenticalExerciseProps) {
    const [selectedWords, setSelectedWords] = useState<
        Record<number, Set<number>>
    >({});
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);

    const handleWordClick = (seqIndex: number, wordIndex: number) => {
        if (showResults) return;

        setSelectedWords((prev) => {
            const newSelected = { ...prev };
            if (!newSelected[seqIndex]) {
                newSelected[seqIndex] = new Set();
            }
            const seqSet = new Set(newSelected[seqIndex]);
            if (seqSet.has(wordIndex)) {
                seqSet.delete(wordIndex);
            } else {
                seqSet.add(wordIndex);
            }
            newSelected[seqIndex] = seqSet;
            return newSelected;
        });
    };

    const handleValidate = () => {
        let correctCount = 0;
        let totalCount = 0;

        wordSequences.forEach((sequence, seqIndex) => {
            sequence.other_words.forEach((wordItem, wordIndex) => {
                totalCount++;
                const isSelected =
                    selectedWords[seqIndex]?.has(wordIndex) || false;
                // Correct if: (is_valid AND selected) OR (!is_valid AND !selected)
                if (
                    (wordItem.is_valid && isSelected) ||
                    (!wordItem.is_valid && !isSelected)
                ) {
                    correctCount++;
                }
            });
        });

        setScore(correctCount);
        setShowResults(true);
        onSubmitScore(correctCount, totalCount);
    };

    const handleRetry = () => {
        setSelectedWords({});
        setShowResults(false);
        setScore(0);
    };

    const handleFinish = () => {
        if (onNext) {
            onNext();
        }
    };

    const isWordCorrectlyAnswered = (
        seqIndex: number,
        wordIndex: number,
    ): boolean => {
        if (!showResults) return false;
        const wordItem = wordSequences[seqIndex].other_words[wordIndex];
        const isSelected = selectedWords[seqIndex]?.has(wordIndex) || false;
        return (
            (wordItem.is_valid && isSelected) ||
            (!wordItem.is_valid && !isSelected)
        );
    };

    const getTotalWords = () => {
        return wordSequences.reduce(
            (sum, seq) => sum + seq.other_words.length,
            0,
        );
    };

    return (
        <div className="mx-auto max-w-6xl space-y-4 p-4">
            <Card className="overflow-hidden rounded-3xl border-0 bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 p-5 shadow-xl">
                <div className="mb-4 flex items-center justify-center gap-3">
                    <CircleDot className="h-8 w-8 text-pink-600" />
                    <h2 className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-center text-2xl font-bold text-transparent">
                        {instruction}
                    </h2>
                </div>

                <p className="mb-6 text-center text-lg font-medium text-slate-700">
                    Clique sur tous les mots identiques au mot modèle
                </p>

                {/* Word Sequences */}
                <div className="mb-5 space-y-6">
                    {wordSequences.map((sequence, seqIndex) => (
                        <div
                            key={seqIndex}
                            className="rounded-3xl bg-white/60 p-5 shadow-lg"
                        >
                            {/* Model Word */}
                            <div className="mb-4 flex justify-center">
                                <div className="inline-block rounded-2xl bg-white px-6 py-3 shadow-xl ring-4 ring-pink-500 ring-offset-2">
                                    <p className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
                                        {sequence.model_word}
                                    </p>
                                </div>
                            </div>

                            {/* Other Words */}
                            <div className="flex flex-wrap justify-center gap-3">
                                {sequence.other_words.map(
                                    (wordItem, wordIndex) => (
                                        <button
                                            key={wordIndex}
                                            onClick={() =>
                                                handleWordClick(
                                                    seqIndex,
                                                    wordIndex,
                                                )
                                            }
                                            disabled={showResults}
                                            className={`group relative overflow-hidden rounded-2xl px-6 py-3 text-xl font-bold shadow-lg transition-all duration-300 hover:shadow-2xl active:scale-95 disabled:cursor-default ${
                                                showResults
                                                    ? wordItem.is_valid
                                                        ? 'bg-gradient-to-br from-green-400 to-green-500 text-white'
                                                        : 'bg-gradient-to-br from-red-400 to-red-500 text-white'
                                                    : selectedWords[
                                                            seqIndex
                                                        ]?.has(wordIndex)
                                                      ? 'scale-105 bg-gradient-to-br from-orange-400 to-yellow-500 text-white ring-4 ring-orange-400 ring-offset-2'
                                                      : 'bg-white text-slate-800 hover:scale-105'
                                            }`}
                                        >
                                            <span className="relative z-10">
                                                {wordItem.word}
                                            </span>
                                            {showResults && (
                                                <span className="ml-2">
                                                    {wordItem.is_valid ? (
                                                        <CheckCircle2 className="inline h-5 w-5" />
                                                    ) : (
                                                        <XCircle className="inline h-5 w-5" />
                                                    )}
                                                </span>
                                            )}
                                            {!showResults && (
                                                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                            )}
                                        </button>
                                    ),
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Results */}
                {showResults && (
                    <div className="mb-5 rounded-3xl bg-gradient-to-br from-pink-100 via-rose-100 to-purple-100 p-5 text-center shadow-xl">
                        <p className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
                            Score: {score} / {getTotalWords()}
                        </p>
                        <p
                            className={`mt-3 text-xl font-bold ${
                                score === getTotalWords()
                                    ? 'text-green-600'
                                    : 'text-orange-600'
                            }`}
                        >
                            {score === getTotalWords()
                                ? 'Parfait! Tu as tout trouvé! 🎉'
                                : "Continue à t'entraîner! 💪"}
                        </p>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-center gap-4">
                    {!showResults ? (
                        <button
                            onClick={handleValidate}
                            className="rounded-full bg-gradient-to-r from-green-500 to-emerald-600 px-10 py-3 text-lg font-bold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95"
                        >
                            Valider
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={handleRetry}
                                className="rounded-full bg-gradient-to-r from-orange-400 to-orange-500 px-8 py-3 text-lg font-bold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95"
                            >
                                Réessayer
                            </button>
                            <button
                                onClick={handleFinish}
                                className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-3 text-lg font-bold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95"
                            >
                                Terminer
                            </button>
                        </>
                    )}
                </div>
            </Card>
        </div>
    );
}
