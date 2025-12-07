import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, Sparkles, Volume2, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface ExerciseImage {
    id: number;
    image_path: string;
    audio_path: string;
    is_correct: boolean;
}

interface Props {
    images: ExerciseImage[];
    onComplete: () => void;
    onRetry: () => void;
    onSubmitScore: (score: number, total: number) => void;
}

export default function ChooseWhenHearExercise({
    images,
    onComplete,
    onRetry,
    onSubmitScore,
}: Props) {
    const [selectedImages, setSelectedImages] = useState<Set<number>>(
        new Set(),
    );
    const [isValidated, setIsValidated] = useState(false);
    const [playingAudio, setPlayingAudio] = useState<number | null>(null);

    const toggleImageSelection = (imageId: number) => {
        if (isValidated) return;

        const newSelection = new Set(selectedImages);
        if (newSelection.has(imageId)) {
            newSelection.delete(imageId);
        } else {
            newSelection.add(imageId);
        }
        setSelectedImages(newSelection);
    };

    const playAudio = (imageId: number, audioPath: string) => {
        const audio = new Audio(`/storage/${audioPath}`);
        setPlayingAudio(imageId);
        audio.play();
        audio.onended = () => setPlayingAudio(null);
    };

    const handleValidate = () => {
        if (selectedImages.size === 0) {
            toast.error('Veuillez sélectionner au moins une image');
            return;
        }
        setIsValidated(true);

        const correctSelections = Array.from(selectedImages).filter(
            (imageId) => {
                const image = images.find((img) => img.id === imageId);
                return image?.is_correct;
            },
        ).length;

        const totalCorrect = images.filter((img) => img.is_correct).length;

        // Score is based on: correct selections + not selecting incorrect ones
        const wrongSelections = Array.from(selectedImages).filter((imageId) => {
            const image = images.find((img) => img.id === imageId);
            return !image?.is_correct;
        }).length;

        const score = correctSelections;
        const total = totalCorrect;

        onSubmitScore(score, total);
    };

    const handleRetry = () => {
        setSelectedImages(new Set());
        setIsValidated(false);
        onRetry();
    };

    const getImageState = (image: ExerciseImage) => {
        if (!isValidated) return 'unselected';

        const isSelected = selectedImages.has(image.id);
        if (isSelected && image.is_correct) return 'correct';
        if (isSelected && !image.is_correct) return 'wrong';
        if (!isSelected && image.is_correct) return 'missed';
        return 'unselected';
    };

    const allCorrect =
        isValidated &&
        images.every((img) =>
            img.is_correct
                ? selectedImages.has(img.id)
                : !selectedImages.has(img.id),
        );

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {images.map((image) => {
                    const state = getImageState(image);
                    const isSelected = selectedImages.has(image.id);

                    return (
                        <Card
                            key={image.id}
                            className={`cursor-pointer transition-all ${
                                state === 'correct'
                                    ? 'border-green-500 bg-green-50'
                                    : state === 'wrong'
                                      ? 'border-red-500 bg-red-50'
                                      : state === 'missed'
                                        ? 'border-yellow-500 bg-yellow-50'
                                        : isSelected
                                          ? 'border-orange-500 bg-orange-50'
                                          : 'hover:border-orange-300'
                            }`}
                            onClick={() => toggleImageSelection(image.id)}
                        >
                            <CardContent className="p-4">
                                <div className="relative aspect-square overflow-hidden rounded-lg">
                                    <img
                                        src={`/storage/${image.image_path}`}
                                        alt="Exercise"
                                        className="h-full w-full object-cover"
                                        loading="lazy"
                                        decoding="async"
                                    />
                                    {isValidated && (
                                        <div
                                            className={`absolute top-2 right-2 rounded-full p-2 ${
                                                state === 'correct'
                                                    ? 'bg-green-500'
                                                    : state === 'wrong'
                                                      ? 'bg-red-500'
                                                      : state === 'missed'
                                                        ? 'bg-yellow-500'
                                                        : 'bg-slate-300'
                                            }`}
                                        >
                                            {state === 'correct' && (
                                                <Check className="h-5 w-5 text-white" />
                                            )}
                                            {state === 'wrong' && (
                                                <X className="h-5 w-5 text-white" />
                                            )}
                                            {state === 'missed' && (
                                                <Sparkles className="h-5 w-5 text-white" />
                                            )}
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        playAudio(image.id, image.audio_path);
                                    }}
                                    className={`mt-3 flex w-full items-center justify-center gap-2 rounded-lg p-2 transition-colors ${
                                        playingAudio === image.id
                                            ? 'bg-orange-500 text-white'
                                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                    }`}
                                >
                                    <Volume2 className="h-4 w-4" />
                                    <span className="text-sm font-medium">
                                        {playingAudio === image.id
                                            ? 'En cours...'
                                            : 'Écouter'}
                                    </span>
                                </button>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="flex justify-center gap-4">
                {!isValidated ? (
                    <Button
                        onClick={handleValidate}
                        disabled={selectedImages.size === 0}
                        size="lg"
                        className="bg-gradient-to-r from-orange-500 to-pink-500 px-8"
                    >
                        <Check className="mr-2 h-5 w-5" />
                        Valider ma réponse
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
                            onClick={onComplete}
                            size="lg"
                            className="bg-gradient-to-r from-green-500 to-emerald-500 px-8"
                        >
                            Continuer
                        </Button>
                    </>
                )}
            </div>

            {isValidated && (
                <div className="flex justify-center">
                    {allCorrect ? (
                        <Badge className="bg-green-500 px-6 py-2 text-base">
                            <Check className="mr-2 h-5 w-5" />
                            Bravo ! Toutes les réponses sont correctes !
                        </Badge>
                    ) : (
                        <Badge
                            variant="outline"
                            className="border-yellow-500 px-6 py-2 text-base text-yellow-700"
                        >
                            <Sparkles className="mr-2 h-5 w-5" />
                            Certaines réponses sont à revoir
                        </Badge>
                    )}
                </div>
            )}
        </div>
    );
}
