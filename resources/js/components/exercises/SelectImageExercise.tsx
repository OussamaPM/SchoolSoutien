import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle2, Volume2, XCircle } from 'lucide-react';
import { useState } from 'react';

interface ExerciseImage {
    id: number;
    image_path: string;
    audio_path: string | null;
    text?: string | null;
    is_correct: boolean;
}

interface Props {
    images: ExerciseImage[];
    instruction: string;
    onComplete: () => void;
    onRetry: () => void;
    onSubmitScore: (score: number, total: number) => void;
}

export default function SelectImageExercise({
    images,
    instruction,
    onComplete,
    onRetry,
    onSubmitScore,
}: Props) {
    const [selectedImages, setSelectedImages] = useState<Set<number>>(
        new Set(),
    );
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);

    const toggleSelection = (imageId: number) => {
        if (showResults) return;

        const newSelection = new Set(selectedImages);
        if (newSelection.has(imageId)) {
            newSelection.delete(imageId);
        } else {
            newSelection.add(imageId);
        }
        setSelectedImages(newSelection);
    };

    const playAudio = (audioPath: string) => {
        const audio = new Audio(`/storage/${audioPath}`);
        audio.play();
    };

    const handleValidate = () => {
        let correctCount = 0;
        const correctImages = images.filter((img) => img.is_correct);
        const correctImageIds = new Set(correctImages.map((img) => img.id));

        // Count correct selections
        selectedImages.forEach((id) => {
            if (correctImageIds.has(id)) {
                correctCount++;
            }
        });

        // Check if all correct images were selected and no wrong ones
        const allCorrectSelected =
            correctCount === correctImages.length &&
            selectedImages.size === correctImages.length;

        const finalScore = allCorrectSelected ? 100 : 0;
        setScore(finalScore);
        setShowResults(true);

        // Submit score immediately when validation happens
        onSubmitScore(finalScore, 100);
    };

    const handleFinish = () => {
        onComplete();
    };

    const handleRetry = () => {
        setSelectedImages(new Set());
        setShowResults(false);
        setScore(0);
        onRetry();
    };

    if (showResults) {
        const correctImages = images.filter((img) => img.is_correct);
        const correctImageIds = new Set(correctImages.map((img) => img.id));

        return (
            <div className="flex min-h-[400px] flex-col items-center justify-center space-y-6 p-8 text-center">
                <div
                    className={`rounded-full p-6 ${score === 100 ? 'bg-green-100' : 'bg-orange-100'}`}
                >
                    {score === 100 ? (
                        <CheckCircle2 className="h-16 w-16 text-green-600" />
                    ) : (
                        <XCircle className="h-16 w-16 text-orange-600" />
                    )}
                </div>

                <div>
                    <h2 className="mb-2 text-3xl font-bold text-slate-800">
                        {score === 100
                            ? 'Excellent travail ! 🎉'
                            : 'Presque ! 💪'}
                    </h2>
                    <p className="text-xl text-slate-600">
                        Score : {score}/100
                    </p>
                </div>

                <div className="space-y-2">
                    <p className="text-sm text-slate-600">
                        Les bonnes réponses étaient :
                    </p>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                        {images.map((image) => (
                            <div
                                key={image.id}
                                className={`rounded-lg border-2 p-2 ${
                                    image.is_correct
                                        ? 'border-green-500 bg-green-50'
                                        : 'border-slate-200 bg-slate-50 opacity-50'
                                }`}
                            >
                                <img
                                    src={`/storage/${image.image_path}`}
                                    alt={image.text || 'Image'}
                                    className="h-20 w-full rounded object-cover"
                                />
                                {image.text && (
                                    <p className="mt-1 text-xs font-medium text-slate-700">
                                        {image.text}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex gap-4">
                    <Button
                        onClick={handleRetry}
                        variant="outline"
                        size="lg"
                        className="rounded-full px-8"
                    >
                        Réessayer
                    </Button>
                    <Button
                        onClick={handleFinish}
                        size="lg"
                        className="rounded-full bg-gradient-to-r from-green-500 to-emerald-600 px-8 hover:scale-105"
                    >
                        Terminer
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            {/* Instruction */}
            <div className="rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 p-6 text-center dark:from-green-950/30 dark:to-emerald-950/30">
                <h2 className="text-2xl font-bold text-slate-800 md:text-3xl dark:text-slate-200">
                    {instruction}
                </h2>
            </div>

            {/* Images Grid */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {images.map((image) => (
                    <Card
                        key={image.id}
                        className={`cursor-pointer transition-all hover:scale-105 ${
                            selectedImages.has(image.id)
                                ? 'ring-4 ring-green-500 ring-offset-2'
                                : 'hover:shadow-lg'
                        }`}
                        onClick={() => toggleSelection(image.id)}
                    >
                        <div className="relative p-3">
                            {/* Selection indicator */}
                            {selectedImages.has(image.id) && (
                                <div className="absolute top-2 right-2 rounded-full bg-green-500 p-1">
                                    <CheckCircle2 className="h-5 w-5 text-white" />
                                </div>
                            )}

                            {/* Image */}
                            <div className="aspect-square overflow-hidden rounded-lg">
                                <img
                                    src={`/storage/${image.image_path}`}
                                    alt={image.text || "Image d'exercice"}
                                    className="h-full w-full object-cover"
                                />
                            </div>

                            {/* Text label */}
                            {image.text && (
                                <div className="mt-3 text-center">
                                    <p className="text-lg font-bold text-slate-700 dark:text-slate-300">
                                        {image.text}
                                    </p>
                                </div>
                            )}

                            {/* Audio button */}
                            {image.audio_path && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        playAudio(image.audio_path);
                                    }}
                                    className="mt-2 flex w-full items-center justify-center rounded-lg bg-slate-100 p-2 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
                                >
                                    <Volume2 className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                                </button>
                            )}
                        </div>
                    </Card>
                ))}
            </div>

            {/* Validate button */}
            <div className="flex justify-center pt-4">
                <Button
                    onClick={handleValidate}
                    disabled={selectedImages.size === 0}
                    size="lg"
                    className="rounded-full bg-gradient-to-r from-green-500 to-emerald-600 px-12 py-6 text-xl font-bold hover:scale-105"
                >
                    Valider
                </Button>
            </div>

            {/* Selection count */}
            <div className="text-center text-sm text-slate-600 dark:text-slate-400">
                {selectedImages.size} image
                {selectedImages.size !== 1 ? 's' : ''} sélectionnée
                {selectedImages.size !== 1 ? 's' : ''}
            </div>
        </div>
    );
}
