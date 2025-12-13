import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle2, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ExerciseImage {
    id: number;
    image_path: string;
    full_text: string;
    masked_position: number;
    correct_letter: string;
    decoy_letters: string[];
}

interface Props {
    images: ExerciseImage[];
    instruction: string;
    onComplete: () => void;
    onRetry: () => void;
    onSubmitScore: (score: number, total: number) => void;
}

export default function ChooseLetterExercise({
    images,
    instruction,
    onComplete,
    onRetry,
    onSubmitScore,
}: Props) {
    const [selectedLetters, setSelectedLetters] = useState<
        Record<number, string>
    >({});
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [shuffledLetters, setShuffledLetters] = useState<string[]>([]);

    const currentImage = images[currentImageIndex];

    // Shuffle letters when current image changes
    useEffect(() => {
        if (currentImage && !showResults) {
            const letters = [
                currentImage.correct_letter,
                ...currentImage.decoy_letters,
            ].filter((letter, index, self) => self.indexOf(letter) === index); // Remove duplicates
            const shuffled = [...letters].sort(() => Math.random() - 0.5);
            setShuffledLetters(shuffled);
        }
    }, [currentImageIndex, currentImage, showResults]);

    // Generate masked text for display
    const getMaskedText = (fullText: string, position: number) => {
        return (
            fullText.substring(0, position) +
            '...' +
            fullText.substring(position + 1)
        );
    };

    const handleLetterSelect = (letter: string) => {
        if (showResults) return;

        setSelectedLetters((prev) => ({
            ...prev,
            [currentImage.id]: letter,
        }));

        // Move to next image if not the last one
        if (currentImageIndex < images.length - 1) {
            setTimeout(() => {
                setCurrentImageIndex(currentImageIndex + 1);
            }, 300);
        }
    };

    const handleValidate = () => {
        // Check if all images have a selected letter
        const allSelected = images.every((img) => selectedLetters[img.id]);
        if (!allSelected) {
            return;
        }

        // Calculate score
        let correctCount = 0;
        images.forEach((img) => {
            if (
                selectedLetters[img.id]?.toLowerCase() ===
                img.correct_letter.toLowerCase()
            ) {
                correctCount++;
            }
        });

        const finalScore = correctCount;
        const totalScore = images.length;
        setScore(finalScore);
        setShowResults(true);

        // Submit score immediately when validation happens
        onSubmitScore(finalScore, totalScore);
    };

    const handleFinish = () => {
        onComplete();
    };

    const handleRetry = () => {
        setSelectedLetters({});
        setShowResults(false);
        setScore(0);
        setCurrentImageIndex(0);
        onRetry();
    };

    const allLettersSelected = images.every((img) => selectedLetters[img.id]);

    const isCorrect = (imageId: number) => {
        const image = images.find((img) => img.id === imageId);
        if (!image) return false;
        return (
            selectedLetters[imageId]?.toLowerCase() ===
            image.correct_letter.toLowerCase()
        );
    };

    return (
        <div className="mx-auto max-w-5xl space-y-6 p-6">
            <Card className="p-6">
                <h2 className="mb-6 text-center text-2xl font-bold text-slate-800">
                    {instruction}
                </h2>

                {/* Images Grid */}
                <div className="mb-6 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
                    {images.map((image) => (
                        <div
                            key={image.id}
                            className="relative flex flex-col items-center"
                        >
                            {/* Image */}
                            <div className="relative mb-2 h-32 w-32 overflow-hidden rounded-lg border-2 border-slate-200">
                                <img
                                    src={`/storage/${image.image_path}`}
                                    alt="Exercise"
                                    className="h-full w-full object-cover"
                                />
                                {showResults && (
                                    <div
                                        className={`absolute inset-0 flex items-center justify-center ${
                                            isCorrect(image.id)
                                                ? 'bg-green-500/20'
                                                : 'bg-red-500/20'
                                        }`}
                                    >
                                        {isCorrect(image.id) ? (
                                            <CheckCircle2 className="h-12 w-12 text-green-600" />
                                        ) : (
                                            <XCircle className="h-12 w-12 text-red-600" />
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Masked Text */}
                            <div className="text-center">
                                <p className="text-lg font-semibold text-slate-800">
                                    {getMaskedText(
                                        image.full_text,
                                        image.masked_position,
                                    )}
                                </p>
                                {showResults && (
                                    <p className="mt-1 text-sm text-slate-600">
                                        Correct: {image.correct_letter}
                                    </p>
                                )}
                            </div>

                            {/* Selected Letter Display */}
                            {selectedLetters[image.id] && (
                                <div
                                    className={`mt-2 rounded-md px-3 py-1 text-lg font-bold ${
                                        showResults
                                            ? isCorrect(image.id)
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-red-100 text-red-700'
                                            : 'bg-blue-100 text-blue-700'
                                    }`}
                                >
                                    {selectedLetters[image.id]}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Keyboard - Letter Options for Current Image */}
                {!showResults && currentImage && shuffledLetters.length > 0 && (
                    <div className="mb-6">
                        <h3 className="mb-3 text-center text-lg font-semibold text-slate-700">
                            Image {currentImageIndex + 1} sur {images.length} -
                            Choisis la bonne lettre:
                        </h3>
                        <div className="flex flex-wrap justify-center gap-3">
                            {shuffledLetters.map((letter) => (
                                <Button
                                    key={letter}
                                    variant="outline"
                                    size="lg"
                                    className="h-16 w-16 text-2xl font-bold"
                                    onClick={() => handleLetterSelect(letter)}
                                >
                                    {letter}
                                </Button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Score Display */}
                {showResults && (
                    <div className="mb-6 rounded-lg bg-slate-100 p-4 text-center">
                        <p className="text-xl font-bold text-slate-800">
                            Score: {score} / {images.length}
                        </p>
                        <p
                            className={`mt-1 text-lg ${
                                score === images.length
                                    ? 'text-green-600'
                                    : 'text-orange-600'
                            }`}
                        >
                            {score === images.length
                                ? 'Excellent! Toutes les réponses sont correctes! 🎉'
                                : 'Continue à pratiquer! 💪'}
                        </p>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-center gap-4">
                    {!showResults ? (
                        <Button
                            onClick={handleValidate}
                            size="lg"
                            disabled={!allLettersSelected}
                            className="px-8"
                        >
                            Valider
                        </Button>
                    ) : (
                        <>
                            <Button
                                onClick={handleRetry}
                                variant="outline"
                                size="lg"
                                className="px-8"
                            >
                                Réessayer
                            </Button>
                            <Button
                                onClick={handleFinish}
                                size="lg"
                                className="px-8"
                            >
                                Terminer
                            </Button>
                        </>
                    )}
                </div>
            </Card>
        </div>
    );
}
