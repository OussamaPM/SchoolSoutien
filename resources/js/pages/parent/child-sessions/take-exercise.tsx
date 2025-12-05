import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Chapter } from '@/pages/admin/educational-programs/chapters';
import { Subject } from '@/pages/admin/educational-programs/subjects';
import parent from '@/routes/parent';
import { Head, router } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowRight,
    BookOpen,
    Check,
    GraduationCap,
    Sparkles,
    Volume2,
    X,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { ChildProfile } from './index';

interface Exercise {
    id: number;
    type: string;
    title: string;
    description: string | null;
    images: ExerciseImage[];
}

interface ExerciseImage {
    id: number;
    image_path: string;
    audio_path: string;
    is_correct: boolean;
}

interface Props {
    child: ChildProfile;
    subject: Subject;
    chapter: Chapter;
    exercise: Exercise;
}

export default function TakeExercise({
    child,
    subject,
    chapter,
    exercise,
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

        // Count correct selections
        const correctCount = Array.from(selectedImages).filter((imageId) => {
            const image = exercise.images.find((img) => img.id === imageId);
            return image?.is_correct;
        }).length;

        const correctImagesCount = exercise.images.filter(
            (img) => img.is_correct,
        ).length;

        // Check if all correct images are selected and no incorrect ones
        const allCorrect =
            correctCount === correctImagesCount &&
            selectedImages.size === correctImagesCount;

        if (allCorrect) {
            toast.success('Bravo ! Toutes les réponses sont correctes ! 🎉', {
                duration: 3000,
            });
        } else {
            toast.error(
                `${correctCount}/${correctImagesCount} réponses correctes. Essaie encore !`,
                { duration: 3000 },
            );
        }
    };

    const handleRetry = () => {
        setSelectedImages(new Set());
        setIsValidated(false);
    };

    const getImageBorderColor = (image: ExerciseImage) => {
        if (!isValidated) {
            return selectedImages.has(image.id)
                ? 'border-purple-500 border-4'
                : 'border-slate-200 border-2';
        }

        const isSelected = selectedImages.has(image.id);
        if (image.is_correct && isSelected) {
            return 'border-green-500 border-4'; // Correct and selected
        } else if (image.is_correct && !isSelected) {
            return 'border-yellow-500 border-4'; // Correct but not selected
        } else if (!image.is_correct && isSelected) {
            return 'border-red-500 border-4'; // Incorrect but selected
        }
        return 'border-slate-200 border-2'; // Incorrect and not selected
    };

    return (
        <AppLayout>
            <Head
                title={`${exercise.title} - ${chapter.title} - ${child.name}`}
            />

            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
                <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                    router.visit(
                                        parent.childSessions.viewChapter.url([
                                            child.id,
                                            subject.id,
                                            chapter.id,
                                        ]),
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
                                        className="border-2 border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/20"
                                    >
                                        <GraduationCap className="mr-1.5 h-3.5 w-3.5" />
                                        {child.education_level.name}
                                    </Badge>
                                )}
                                <Badge
                                    variant="outline"
                                    className="border-2 border-purple-200 bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700 dark:bg-purple-950/20"
                                >
                                    <BookOpen className="mr-1.5 h-3.5 w-3.5" />
                                    {subject.name}
                                </Badge>
                            </div>
                        </div>

                        <div className="mt-6">
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
                                    <Sparkles className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl dark:text-slate-100">
                                        {exercise.title}
                                    </h1>
                                    {exercise.description && (
                                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                            {exercise.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Instructions */}
                    <Card className="mb-6 overflow-hidden rounded-3xl border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 shadow-lg dark:from-purple-950/30 dark:to-pink-950/30">
                        <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-500">
                                    <Volume2 className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="mb-2 font-bold text-purple-900 dark:text-purple-100">
                                        Comment jouer ?
                                    </h3>
                                    <ol className="space-y-1 text-sm text-purple-800 dark:text-purple-200">
                                        <li>
                                            1. Clique sur le bouton{' '}
                                            <Volume2 className="inline h-3.5 w-3.5" />{' '}
                                            pour écouter le mot
                                        </li>
                                        <li>
                                            2. Clique sur l'image si tu entends le son
                                            demandé
                                        </li>
                                        <li>
                                            3. Valide tes réponses pour voir si tu as
                                            bien répondu !
                                        </li>
                                    </ol>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Images Grid */}
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                        {exercise.images.map((image) => (
                            <Card
                                key={image.id}
                                className={`group cursor-pointer overflow-hidden rounded-3xl transition-all duration-300 hover:scale-105 hover:shadow-2xl ${getImageBorderColor(
                                    image,
                                )}`}
                                onClick={() => toggleImageSelection(image.id)}
                            >
                                <CardContent className="p-0">
                                    <div className="relative aspect-square">
                                        <img
                                            src={`/storage/${image.image_path}`}
                                            alt="Exercise"
                                            className="h-full w-full object-cover"
                                        />

                                        {/* Audio Button */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                playAudio(image.id, image.audio_path);
                                            }}
                                            className={`absolute bottom-2 left-2 right-2 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 font-bold text-white shadow-lg transition-all hover:scale-105 ${
                                                playingAudio === image.id
                                                    ? 'animate-pulse'
                                                    : ''
                                            }`}
                                        >
                                            <Volume2 className="h-4 w-4" />
                                            {playingAudio === image.id
                                                ? 'Écoute...'
                                                : 'Écouter'}
                                        </button>

                                        {/* Selection Indicator */}
                                        {selectedImages.has(image.id) && !isValidated && (
                                            <div className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-purple-500 shadow-lg">
                                                <Check className="h-5 w-5 text-white" />
                                            </div>
                                        )}

                                        {/* Validation Result */}
                                        {isValidated && (
                                            <>
                                                {image.is_correct &&
                                                selectedImages.has(image.id) ? (
                                                    <div className="absolute top-2 right-2 flex h-10 w-10 items-center justify-center rounded-full bg-green-500 shadow-lg">
                                                        <Check className="h-6 w-6 text-white" />
                                                    </div>
                                                ) : !image.is_correct &&
                                                  selectedImages.has(image.id) ? (
                                                    <div className="absolute top-2 right-2 flex h-10 w-10 items-center justify-center rounded-full bg-red-500 shadow-lg">
                                                        <X className="h-6 w-6 text-white" />
                                                    </div>
                                                ) : image.is_correct &&
                                                  !selectedImages.has(image.id) ? (
                                                    <div className="absolute top-2 right-2 flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500 shadow-lg">
                                                        <Check className="h-6 w-6 text-white" />
                                                    </div>
                                                ) : null}
                                            </>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-8 flex justify-center gap-4">
                        {!isValidated ? (
                            <Button
                                onClick={handleValidate}
                                disabled={selectedImages.size === 0}
                                className="rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-6 text-lg font-bold shadow-lg hover:scale-105"
                            >
                                <Check className="mr-2 h-6 w-6" />
                                Valider mes réponses
                            </Button>
                        ) : (
                            <>
                                <Button
                                    onClick={handleRetry}
                                    className="rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-6 text-lg font-bold shadow-lg hover:scale-105"
                                >
                                    <ArrowLeft className="mr-2 h-6 w-6" />
                                    Réessayer
                                </Button>
                                <Button
                                    onClick={() =>
                                        router.visit(
                                            parent.childSessions.viewChapter.url([
                                                child.id,
                                                subject.id,
                                                chapter.id,
                                            ]),
                                        )
                                    }
                                    className="rounded-2xl bg-gradient-to-r from-purple-500 to-pink-600 px-8 py-6 text-lg font-bold shadow-lg hover:scale-105"
                                >
                                    Continuer le cours
                                    <ArrowRight className="ml-2 h-6 w-6" />
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
