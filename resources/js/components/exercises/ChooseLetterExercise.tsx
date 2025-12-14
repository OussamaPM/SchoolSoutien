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

        // Don't auto-advance, let user navigate manually
    };

    const handleNext = () => {
        if (currentImageIndex < images.length - 1) {
            setCurrentImageIndex(currentImageIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentImageIndex > 0) {
            setCurrentImageIndex(currentImageIndex - 1);
        }
    };

    const handleImageClick = (index: number) => {
        if (!showResults) {
            setCurrentImageIndex(index);
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
        <div className="mx-auto max-w-6xl space-y-4 p-4">
            <Card className="overflow-hidden rounded-3xl border-0 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-5 shadow-xl">
                <h2 className="mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-center text-2xl font-bold text-transparent">
                    {instruction}
                </h2>

                {!showResults && (
                    <div className="mb-4 text-center">
                        <div className="inline-block rounded-full bg-white px-5 py-2 shadow-lg">
                            <p className="text-lg font-bold text-slate-800">
                                Image {currentImageIndex + 1} sur{' '}
                                {images.length}
                            </p>
                        </div>
                        <div className="mx-auto mt-3 flex justify-center gap-2">
                            {images.map((_, index) => (
                                <div
                                    key={index}
                                    className={`h-3 w-3 rounded-full transition-all duration-300 ${
                                        index === currentImageIndex
                                            ? 'w-10 bg-gradient-to-r from-purple-500 to-blue-500 shadow-lg'
                                            : selectedLetters[images[index].id]
                                              ? 'bg-green-500 shadow-md'
                                              : 'bg-slate-300'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                )}

                <div className="mb-5 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {images.map((image, index) => (
                        <div
                            key={image.id}
                            className={`group relative flex cursor-pointer flex-col items-center transition-all duration-300 ${
                                !showResults && index === currentImageIndex
                                    ? 'scale-105'
                                    : 'hover:scale-105'
                            }`}
                            onClick={() => handleImageClick(index)}
                        >
                            <div
                                className={`relative mb-2 h-28 w-28 overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 ${
                                    !showResults && index === currentImageIndex
                                        ? 'shadow-2xl ring-3 ring-purple-500 ring-offset-2'
                                        : ''
                                }`}
                            >
                                <img
                                    src={`/storage/${image.image_path}`}
                                    alt="Exercise"
                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                                {showResults && (
                                    <div
                                        className={`absolute inset-0 flex items-center justify-center backdrop-blur-sm ${
                                            isCorrect(image.id)
                                                ? 'bg-green-500/30'
                                                : 'bg-red-500/30'
                                        }`}
                                    >
                                        {isCorrect(image.id) ? (
                                            <CheckCircle2 className="h-16 w-16 text-green-600 drop-shadow-lg" />
                                        ) : (
                                            <XCircle className="h-16 w-16 text-red-600 drop-shadow-lg" />
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="text-center">
                                <p className="text-lg font-bold text-slate-800">
                                    {getMaskedText(
                                        image.full_text,
                                        image.masked_position,
                                    )}
                                </p>
                                {showResults && (
                                    <p className="mt-1 text-xs font-medium text-green-600">
                                        ✓ {image.correct_letter}
                                    </p>
                                )}
                            </div>

                            {selectedLetters[image.id] && (
                                <div
                                    className={`mt-2 rounded-xl px-3 py-1 text-lg font-bold shadow-md ${
                                        showResults
                                            ? isCorrect(image.id)
                                                ? 'bg-gradient-to-r from-green-400 to-green-500 text-white'
                                                : 'bg-gradient-to-r from-red-400 to-red-500 text-white'
                                            : 'bg-gradient-to-r from-blue-400 to-purple-500 text-white'
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
                    <div className="mb-4 rounded-3xl bg-white p-5 shadow-xl">
                        <h3 className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-center text-xl font-bold text-transparent">
                            Choisis la lettre manquante pour cette image:
                        </h3>
                        <div className="flex flex-wrap justify-center gap-3">
                            {shuffledLetters.map((letter) => (
                                <button
                                    key={letter}
                                    onClick={() => handleLetterSelect(letter)}
                                    className={`group relative h-16 w-16 overflow-hidden rounded-xl text-2xl font-bold uppercase shadow-lg transition-all duration-300 hover:shadow-2xl active:scale-95 ${
                                        selectedLetters[currentImage.id] ===
                                        letter
                                            ? 'scale-105 bg-gradient-to-br from-purple-500 to-blue-600 text-white ring-4 ring-purple-400 ring-offset-2'
                                            : 'bg-gradient-to-br from-yellow-300 via-pink-300 to-purple-300 text-slate-800 hover:scale-105'
                                    }`}
                                >
                                    <span className="relative z-10">
                                        {letter}
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                </button>
                            ))}
                        </div>

                        <div className="mt-5 flex justify-center gap-4">
                            <button
                                onClick={handlePrevious}
                                disabled={currentImageIndex === 0}
                                className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-slate-500 to-slate-600 px-6 py-2 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:cursor-not-allowed disabled:from-slate-300 disabled:to-slate-400 disabled:opacity-50"
                            >
                                <span className="transition-transform group-hover:-translate-x-1">
                                    ←
                                </span>
                                Précédent
                            </button>
                            <button
                                onClick={handleNext}
                                disabled={
                                    currentImageIndex === images.length - 1
                                }
                                className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-slate-500 to-slate-600 px-6 py-2 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:cursor-not-allowed disabled:from-slate-300 disabled:to-slate-400 disabled:opacity-50"
                            >
                                Suivant
                                <span className="transition-transform group-hover:translate-x-1">
                                    →
                                </span>
                            </button>
                        </div>
                    </div>
                )}

                {showResults && (
                    <div className="mb-5 rounded-3xl bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 p-5 text-center shadow-xl">
                        <p className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-3xl font-bold text-transparent">
                            Score: {score} / {images.length}
                        </p>
                        <p
                            className={`mt-3 text-xl font-bold ${
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

                <div className="flex justify-center gap-4">
                    {!showResults ? (
                        <button
                            onClick={handleValidate}
                            disabled={!allLettersSelected}
                            className="rounded-full bg-gradient-to-r from-green-500 to-emerald-600 px-10 py-3 text-lg font-bold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95 disabled:cursor-not-allowed disabled:from-slate-300 disabled:to-slate-400 disabled:opacity-50"
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
