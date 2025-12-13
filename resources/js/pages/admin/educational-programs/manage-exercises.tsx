import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import programs from '@/routes/admin/educational-programs';
import { BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import {
    Check,
    Mic,
    Pencil,
    Plus,
    Target,
    Trash2,
    Upload,
    Volume2,
    X,
} from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { Category } from '.';
import { Chapter } from './chapters';
import { EducationLevel } from './levels';
import { Subject } from './subjects';

interface Exercise {
    id: number;
    type: string;
    title: string;
    description: string | null;
    is_active: boolean;
    position: number;
    letter_options?: string[];
    images?: ExerciseImage[];
}

interface ExerciseImage {
    id: number;
    exercise_id: number;
    image_path: string;
    audio_path: string;
    text?: string | null;
    full_text?: string | null;
    masked_position?: number | null;
    correct_letter?: string | null;
    decoy_letters?: string[] | null;
    is_correct: boolean;
    position: number;
}

interface ExerciseType {
    value: string;
    label: string;
    description: string;
}

interface Props {
    category: Category;
    level: EducationLevel;
    subject: Subject;
    chapter: Chapter & { exercises: Exercise[] };
    exerciseTypes: ExerciseType[];
}

const breadcrumbs = (
    levelId: number,
    levelName: string,
    categoryId: number,
    categoryName: string,
    subjectId: number,
    subjectName: string,
): BreadcrumbItem[] => [
    { title: 'Programmes', href: programs.levelCategories.url() },
    { title: categoryName, href: programs.levels.url(categoryId) },
    { title: levelName, href: programs.subjects.url([categoryId, levelId]) },
    {
        title: subjectName,
        href: programs.chapters.url([categoryId, levelId, subjectId]),
    },
    { title: 'Exercices', href: '#' },
];

export default function ManageExercises({
    category,
    level,
    subject,
    chapter,
    exerciseTypes,
}: Props) {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [createStep, setCreateStep] = useState<'type' | 'details'>('type');
    const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
        null,
    );
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isAddImageDialogOpen, setIsAddImageDialogOpen] = useState(false);
    const [isAddWordDialogOpen, setIsAddWordDialogOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [selectedAudio, setSelectedAudio] = useState<File | null>(null);
    const [selectedWordAudio, setSelectedWordAudio] = useState<File | null>(
        null,
    );
    const [isRecording, setIsRecording] = useState(false);
    const [isRecordingWord, setIsRecordingWord] = useState(false);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [wordAudioBlob, setWordAudioBlob] = useState<Blob | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const wordMediaRecorderRef = useRef<MediaRecorder | null>(null);
    const wordAudioChunksRef = useRef<Blob[]>([]);

    const {
        data: newExerciseData,
        setData: setNewExerciseData,
        post: createExercise,
        processing: isCreating,
        reset: resetExerciseForm,
    } = useForm({
        type: '',
        title: '',
        description: '',
        required_repetitions: 5,
        letter_options: [] as string[],
    });

    const {
        data: editExerciseData,
        setData: setEditExerciseData,
        put: updateExercise,
        processing: isUpdating,
        reset: resetEditForm,
    } = useForm({
        title: '',
        description: '',
    });

    const {
        data: imageData,
        setData: setImageData,
        post: postImage,
        processing: isAddingImage,
        reset: resetImageForm,
        errors: imageErrors,
        clearErrors: clearImageErrors,
    } = useForm<{
        image: File | null;
        audio: File | null;
        text: string;
        full_text: string;
        masked_position: number | null;
        correct_letter: string;
        decoy_letters: string[];
        is_correct: boolean;
    }>({
        image: null,
        audio: null,
        text: '',
        full_text: '',
        masked_position: null,
        correct_letter: '',
        decoy_letters: [],
        is_correct: false,
    });

    const {
        data: wordData,
        setData: setWordData,
        post: postWord,
        processing: isAddingWord,
        reset: resetWordForm,
        errors: wordErrors,
        clearErrors: clearWordErrors,
    } = useForm<{
        text: string;
        audio: File | null;
    }>({
        text: '',
        audio: null,
    });

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
            });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(audioChunksRef.current, {
                    type: 'audio/webm',
                });
                const audioFile = new File([blob], 'recording.webm', {
                    type: 'audio/webm',
                });
                setAudioBlob(blob);
                setImageData('audio', audioFile);
                stream.getTracks().forEach((track) => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (error) {
            toast.error("Erreur lors de l'accès au microphone");
            console.error(error);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const startWordRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
            });
            const mediaRecorder = new MediaRecorder(stream);
            wordMediaRecorderRef.current = mediaRecorder;
            wordAudioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                wordAudioChunksRef.current.push(event.data);
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(wordAudioChunksRef.current, {
                    type: 'audio/webm',
                });
                const audioFile = new File([blob], 'word-recording.webm', {
                    type: 'audio/webm',
                });
                setWordAudioBlob(blob);
                setWordData('audio', audioFile);
                stream.getTracks().forEach((track) => track.stop());
            };

            mediaRecorder.start();
            setIsRecordingWord(true);
        } catch (error) {
            toast.error("Erreur lors de l'accès au microphone");
            console.error(error);
        }
    };

    const stopWordRecording = () => {
        if (wordMediaRecorderRef.current && isRecordingWord) {
            wordMediaRecorderRef.current.stop();
            setIsRecordingWord(false);
        }
    };

    const handleCreateExercise = () => {
        createExercise(
            `/admin/educational-programs/education-level-categories/${category.id}/${level.id}/subjects/${subject.id}/chapter/${chapter.id}/exercise`,
            {
                onSuccess: () => {
                    setIsCreateDialogOpen(false);
                    setCreateStep('type');
                    resetExerciseForm();
                    toast.success('Exercice créé avec succès');
                },
            },
        );
    };

    const handleAddImage = (exercise: Exercise) => {
        if (!imageData.image) {
            toast.error('Veuillez sélectionner une image');
            return;
        }

        // For choose_when_hear exercises, audio is required
        if (exercise.type === 'choose_when_hear' && !imageData.audio) {
            toast.error('Veuillez sélectionner un audio');
            return;
        }

        // For choose_letter exercises, validate required fields
        if (exercise.type === 'choose_letter') {
            if (!imageData.full_text) {
                toast.error('Veuillez entrer le mot complet');
                return;
            }
            if (imageData.masked_position === null) {
                toast.error(
                    'Veuillez entrer la position de la lettre à masquer',
                );
                return;
            }
            // Auto-calculate correct_letter
            if (imageData.full_text && imageData.masked_position !== null) {
                const letter = imageData.full_text[imageData.masked_position];
                if (letter) {
                    imageData.correct_letter = letter;
                }
            }
        }

        postImage(
            `/admin/educational-programs/education-level-categories/${category.id}/${level.id}/subjects/${subject.id}/chapter/${chapter.id}/exercise/${exercise.id}/image`,
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Image ajoutée avec succès');
                    setIsAddImageDialogOpen(false);
                    setSelectedImage(null);
                    setSelectedAudio(null);
                    setAudioBlob(null);
                    resetImageForm();
                    clearImageErrors();
                },
                onError: () => {
                    toast.error("Erreur lors de l'ajout de l'image");
                },
            },
        );
    };

    const toggleCorrect = (exercise: Exercise, image: ExerciseImage) => {
        router.put(
            `/admin/educational-programs/education-level-categories/${category.id}/${level.id}/subjects/${subject.id}/chapter/${chapter.id}/exercise/${exercise.id}/image/${image.id}`,
            { is_correct: !image.is_correct },
            {
                preserveScroll: true,
                onError: () => {
                    toast.error('Erreur lors de la mise à jour');
                },
            },
        );
    };

    const handleAddWord = (exercise: Exercise) => {
        if (!wordData.text || !wordData.audio) {
            toast.error('Veuillez saisir un texte et sélectionner un audio');
            return;
        }

        postWord(
            `/admin/educational-programs/education-level-categories/${category.id}/${level.id}/subjects/${subject.id}/chapter/${chapter.id}/exercise/${exercise.id}/word`,
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Mot ajouté avec succès');
                    setIsAddWordDialogOpen(false);
                    setSelectedWordAudio(null);
                    setWordAudioBlob(null);
                    setIsRecordingWord(false);
                    resetWordForm();
                    clearWordErrors();
                },
                onError: () => {
                    toast.error("Erreur lors de l'ajout du mot");
                },
            },
        );
    };

    const deleteWord = (exercise: Exercise, word: any) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce mot ?')) return;

        router.delete(
            `/admin/educational-programs/education-level-categories/${category.id}/${level.id}/subjects/${subject.id}/chapter/${chapter.id}/exercise/${exercise.id}/word/${word.id}`,
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Mot supprimé avec succès');
                },
                onError: () => {
                    toast.error('Erreur lors de la suppression');
                },
            },
        );
    };

    const deleteImage = (exercise: Exercise, image: ExerciseImage) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette image ?'))
            return;

        router.delete(
            `/admin/educational-programs/education-level-categories/${category.id}/${level.id}/subjects/${subject.id}/chapter/${chapter.id}/exercise/${exercise.id}/image/${image.id}`,
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Image supprimée avec succès');
                },
                onError: () => {
                    toast.error('Erreur lors de la suppression');
                },
            },
        );
    };

    const handleEditExercise = (exercise: Exercise) => {
        setSelectedExercise(exercise);
        setEditExerciseData({
            title: exercise.title,
            description: exercise.description,
        });
        setIsEditDialogOpen(true);
    };

    const handleUpdateExercise = () => {
        if (!selectedExercise) return;

        updateExercise(
            `/admin/educational-programs/education-level-categories/${category.id}/${level.id}/subjects/${subject.id}/chapter/${chapter.id}/exercise/${selectedExercise.id}`,
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Exercice modifié avec succès');
                    setIsEditDialogOpen(false);
                    setSelectedExercise(null);
                    resetEditForm();
                },
                onError: () => {
                    toast.error('Erreur lors de la modification');
                },
            },
        );
    };

    const deleteExercise = (exercise: Exercise) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cet exercice ?'))
            return;

        router.delete(
            `/admin/educational-programs/education-level-categories/${category.id}/${level.id}/subjects/${subject.id}/chapter/${chapter.id}/exercise/${exercise.id}`,
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Exercice supprimé avec succès');
                },
                onError: () => {
                    toast.error('Erreur lors de la suppression');
                },
            },
        );
    };

    return (
        <AppLayout
            breadcrumbs={breadcrumbs(
                level.id,
                level.name,
                category.id,
                category.name,
                subject.id,
                subject.name,
            )}
        >
            <Head title={`Exercices - ${chapter.title}`} />

            <div className="mx-auto max-w-6xl p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                                Exercices - {chapter.title}
                            </h1>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Gérez les exercices pour ce chapitre
                            </p>
                        </div>
                    </div>

                    <Dialog
                        open={isCreateDialogOpen}
                        onOpenChange={(open) => {
                            setIsCreateDialogOpen(open);
                            if (!open) {
                                setCreateStep('type');
                                resetExerciseForm();
                            }
                        }}
                    >
                        <DialogTrigger asChild>
                            <Button className="bg-gradient-to-r from-purple-500 to-blue-500">
                                <Plus className="mr-2 h-4 w-4" />
                                Nouvel exercice
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>
                                    {createStep === 'type'
                                        ? "Choisir le type d'exercice"
                                        : 'Créer un nouvel exercice'}
                                </DialogTitle>
                                <DialogDescription>
                                    {createStep === 'type'
                                        ? "Sélectionnez le type d'exercice que vous souhaitez créer"
                                        : exerciseTypes.find(
                                              (t) =>
                                                  t.value ===
                                                  newExerciseData.type,
                                          )?.description}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                {createStep === 'type' ? (
                                    <div className="space-y-3">
                                        {exerciseTypes.map((type) => (
                                            <button
                                                key={type.value}
                                                onClick={() => {
                                                    setNewExerciseData(
                                                        'type',
                                                        type.value,
                                                    );
                                                    setCreateStep('details');
                                                }}
                                                className="flex w-full flex-col items-start rounded-lg border-2 border-slate-200 p-4 text-left transition-all hover:border-purple-500 hover:bg-purple-50 dark:border-slate-700 dark:hover:border-purple-500 dark:hover:bg-purple-950"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Target className="h-5 w-5 text-purple-600" />
                                                    <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                                                        {type.label}
                                                    </h4>
                                                </div>
                                                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                                    {type.description}
                                                </p>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <>
                                        <div className="space-y-2">
                                            <Label htmlFor="title">
                                                Titre de l'exercice
                                            </Label>
                                            <Input
                                                id="title"
                                                placeholder="Ex: Je choisis quand j'entends i"
                                                value={newExerciseData.title}
                                                onChange={(e) =>
                                                    setNewExerciseData(
                                                        'title',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="description">
                                                Description (optionnelle)
                                            </Label>
                                            <Textarea
                                                id="description"
                                                placeholder="Expliquer davantage l'exercice..."
                                                value={
                                                    newExerciseData.description
                                                }
                                                onChange={(e) =>
                                                    setNewExerciseData(
                                                        'description',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                        {newExerciseData.type ===
                                            'choose_when_read' && (
                                            <div className="space-y-2">
                                                <Label htmlFor="required_repetitions">
                                                    Nombre de répétitions
                                                    requises
                                                </Label>
                                                <Input
                                                    id="required_repetitions"
                                                    type="number"
                                                    min="1"
                                                    max="20"
                                                    placeholder="5"
                                                    value={
                                                        newExerciseData.required_repetitions
                                                    }
                                                    onChange={(e) =>
                                                        setNewExerciseData(
                                                            'required_repetitions',
                                                            parseInt(
                                                                e.target.value,
                                                            ) || 5,
                                                        )
                                                    }
                                                />
                                                <p className="text-xs text-slate-500">
                                                    L'enfant devra écouter
                                                    chaque mot ce nombre de fois
                                                </p>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                            <DialogFooter>
                                {createStep === 'details' && (
                                    <Button
                                        variant="outline"
                                        onClick={() => setCreateStep('type')}
                                    >
                                        Retour
                                    </Button>
                                )}
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setIsCreateDialogOpen(false);
                                        setCreateStep('type');
                                        resetExerciseForm();
                                    }}
                                >
                                    Annuler
                                </Button>
                                {createStep === 'details' && (
                                    <Button
                                        onClick={handleCreateExercise}
                                        disabled={
                                            !newExerciseData.title || isCreating
                                        }
                                    >
                                        Créer
                                    </Button>
                                )}
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {chapter.exercises.length === 0 ? (
                    <Card className="border-2 border-dashed">
                        <CardContent className="flex min-h-[400px] flex-col items-center justify-center p-12">
                            <Target className="mb-4 h-16 w-16 text-slate-400" />
                            <h3 className="mb-2 text-xl font-semibold text-slate-900 dark:text-slate-100">
                                Aucun exercice
                            </h3>
                            <p className="mb-6 text-center text-slate-600 dark:text-slate-400">
                                Créez votre premier exercice pour ce chapitre
                            </p>
                            <Button
                                onClick={() => setIsCreateDialogOpen(true)}
                                className="bg-gradient-to-r from-purple-500 to-blue-500"
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Créer un exercice
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-6">
                        {chapter.exercises.map((exercise) => (
                            <Card key={exercise.id}>
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <CardTitle className="flex items-center gap-2">
                                                <Target className="h-5 w-5 text-purple-600" />
                                                {exercise.title}
                                            </CardTitle>
                                            {exercise.description && (
                                                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                                                    {exercise.description}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    handleEditExercise(exercise)
                                                }
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() =>
                                                    deleteExercise(exercise)
                                                }
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {exercise.type === 'choose_when_hear' && (
                                        <>
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-semibold text-slate-700 dark:text-slate-300">
                                                    Images (
                                                    {exercise.images?.length ||
                                                        0}
                                                    )
                                                </h4>
                                                <Dialog
                                                    open={
                                                        isAddImageDialogOpen &&
                                                        selectedExercise?.id ===
                                                            exercise.id
                                                    }
                                                    onOpenChange={(open) => {
                                                        setIsAddImageDialogOpen(
                                                            open,
                                                        );
                                                        if (open) {
                                                            setSelectedExercise(
                                                                exercise,
                                                            );
                                                        } else {
                                                            setSelectedExercise(
                                                                null,
                                                            );
                                                            setSelectedImage(
                                                                null,
                                                            );
                                                            setSelectedAudio(
                                                                null,
                                                            );
                                                            setAudioBlob(null);
                                                            setIsRecording(
                                                                false,
                                                            );
                                                        }
                                                    }}
                                                >
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                        >
                                                            <Plus className="mr-2 h-4 w-4" />
                                                            Ajouter une image
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>
                                                                Ajouter une
                                                                image
                                                            </DialogTitle>
                                                            <DialogDescription>
                                                                Téléversez une
                                                                image et
                                                                enregistrez
                                                                l'audio
                                                                correspondant
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <div className="space-y-4 py-4">
                                                            <div className="space-y-2">
                                                                <Label htmlFor="image">
                                                                    Image
                                                                </Label>
                                                                <Input
                                                                    id="image"
                                                                    type="file"
                                                                    accept="image/*"
                                                                    onChange={(
                                                                        e,
                                                                    ) => {
                                                                        const file =
                                                                            e
                                                                                .target
                                                                                .files?.[0] ||
                                                                            null;
                                                                        setSelectedImage(
                                                                            file,
                                                                        );
                                                                        setImageData(
                                                                            'image',
                                                                            file,
                                                                        );
                                                                    }}
                                                                />
                                                                {imageErrors.image && (
                                                                    <p className="text-sm text-red-600">
                                                                        {
                                                                            imageErrors.image
                                                                        }
                                                                    </p>
                                                                )}
                                                            </div>
                                                            {selectedExercise?.type ===
                                                                'select_image' && (
                                                                <div className="space-y-2">
                                                                    <Label htmlFor="text">
                                                                        Texte
                                                                    </Label>
                                                                    <Input
                                                                        id="text"
                                                                        type="text"
                                                                        placeholder="Ex: chat, lune, etc."
                                                                        value={
                                                                            imageData.text
                                                                        }
                                                                        onChange={(
                                                                            e,
                                                                        ) =>
                                                                            setImageData(
                                                                                'text',
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                            )
                                                                        }
                                                                    />
                                                                    {imageErrors.text && (
                                                                        <p className="text-sm text-red-600">
                                                                            {
                                                                                imageErrors.text
                                                                            }
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            )}
                                                            <div className="space-y-2">
                                                                <Label>
                                                                    Audio
                                                                </Label>
                                                                <div className="flex gap-2">
                                                                    <Button
                                                                        type="button"
                                                                        variant={
                                                                            isRecording
                                                                                ? 'destructive'
                                                                                : 'outline'
                                                                        }
                                                                        className="flex-1"
                                                                        onClick={
                                                                            isRecording
                                                                                ? stopRecording
                                                                                : startRecording
                                                                        }
                                                                    >
                                                                        <Mic className="mr-2 h-4 w-4" />
                                                                        {isRecording
                                                                            ? "Arrêter l'enregistrement"
                                                                            : 'Enregistrer'}
                                                                    </Button>
                                                                </div>
                                                                {audioBlob && (
                                                                    <div className="flex items-center gap-2 rounded-md border border-green-200 bg-green-50 p-2">
                                                                        <Volume2 className="h-4 w-4 text-green-700" />
                                                                        <span className="text-sm text-green-700">
                                                                            Audio
                                                                            enregistré
                                                                        </span>
                                                                    </div>
                                                                )}
                                                                <div className="text-center text-sm text-slate-600">
                                                                    ou
                                                                </div>
                                                                <Input
                                                                    type="file"
                                                                    accept="audio/*"
                                                                    onChange={(
                                                                        e,
                                                                    ) => {
                                                                        const file =
                                                                            e
                                                                                .target
                                                                                .files?.[0] ||
                                                                            null;
                                                                        setSelectedAudio(
                                                                            file,
                                                                        );
                                                                        setImageData(
                                                                            'audio',
                                                                            file,
                                                                        );
                                                                        setAudioBlob(
                                                                            null,
                                                                        );
                                                                    }}
                                                                />
                                                                {imageErrors.audio && (
                                                                    <p className="text-sm text-red-600">
                                                                        {
                                                                            imageErrors.audio
                                                                        }
                                                                    </p>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <Checkbox
                                                                    id="is_correct"
                                                                    checked={
                                                                        imageData.is_correct
                                                                    }
                                                                    onCheckedChange={(
                                                                        checked,
                                                                    ) =>
                                                                        setImageData(
                                                                            'is_correct',
                                                                            checked ===
                                                                                true,
                                                                        )
                                                                    }
                                                                />
                                                                <Label
                                                                    htmlFor="is_correct"
                                                                    className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                                >
                                                                    Cette image
                                                                    est correcte
                                                                </Label>
                                                            </div>
                                                        </div>
                                                        <DialogFooter>
                                                            <Button
                                                                variant="outline"
                                                                onClick={() => {
                                                                    setIsAddImageDialogOpen(
                                                                        false,
                                                                    );
                                                                    setSelectedImage(
                                                                        null,
                                                                    );
                                                                    setSelectedAudio(
                                                                        null,
                                                                    );
                                                                    setAudioBlob(
                                                                        null,
                                                                    );
                                                                }}
                                                            >
                                                                Annuler
                                                            </Button>
                                                            <Button
                                                                onClick={() =>
                                                                    handleAddImage(
                                                                        exercise,
                                                                    )
                                                                }
                                                                disabled={
                                                                    !selectedImage ||
                                                                    (!selectedAudio &&
                                                                        !audioBlob)
                                                                }
                                                            >
                                                                Ajouter
                                                            </Button>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>

                                            {!exercise.images ||
                                            exercise.images.length === 0 ? (
                                                <div className="rounded-lg border-2 border-dashed border-slate-200 p-12 text-center">
                                                    <Upload className="mx-auto mb-3 h-12 w-12 text-slate-400" />
                                                    <p className="text-sm text-slate-600">
                                                        Aucune image ajoutée
                                                    </p>
                                                    <p className="mt-1 text-xs text-slate-400">
                                                        Cliquez sur "Ajouter une
                                                        image" pour commencer
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                                                    {exercise.images.map(
                                                        (image) => (
                                                            <div
                                                                key={image.id}
                                                                className="group relative rounded-lg border-2 border-slate-200 bg-white p-3 transition-all hover:shadow-lg"
                                                            >
                                                                <div className="relative aspect-square overflow-hidden rounded-md">
                                                                    <img
                                                                        src={`/storage/${image.image_path}`}
                                                                        alt="Exercise"
                                                                        className="h-full w-full object-cover"
                                                                        loading="lazy"
                                                                        decoding="async"
                                                                    />
                                                                    <button
                                                                        onClick={() =>
                                                                            toggleCorrect(
                                                                                exercise,
                                                                                image,
                                                                            )
                                                                        }
                                                                        className={`absolute top-2 right-2 rounded-full p-1.5 shadow-lg transition-all ${
                                                                            image.is_correct
                                                                                ? 'bg-green-500 text-white'
                                                                                : 'bg-red-500 text-white'
                                                                        }`}
                                                                    >
                                                                        {image.is_correct ? (
                                                                            <Check className="h-4 w-4" />
                                                                        ) : (
                                                                            <X className="h-4 w-4" />
                                                                        )}
                                                                    </button>
                                                                </div>
                                                                {image.text && (
                                                                    <div className="mt-2 text-center">
                                                                        <p className="text-sm font-medium text-slate-700">
                                                                            {
                                                                                image.text
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                )}
                                                                <div className="mt-3">
                                                                    <audio
                                                                        controls
                                                                        className="h-8 w-full"
                                                                        src={`/storage/${image.audio_path}`}
                                                                    />
                                                                </div>
                                                                <Button
                                                                    variant="destructive"
                                                                    size="sm"
                                                                    className="mt-3 w-full opacity-0 transition-opacity group-hover:opacity-100"
                                                                    onClick={() =>
                                                                        deleteImage(
                                                                            exercise,
                                                                            image,
                                                                        )
                                                                    }
                                                                >
                                                                    <Trash2 className="mr-2 h-3 w-3" />
                                                                    Supprimer
                                                                </Button>
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            )}
                                        </>
                                    )}

                                    {exercise.type === 'choose_when_read' && (
                                        <>
                                            <div className="mb-2 rounded-lg bg-blue-50 p-3 dark:bg-blue-950/20">
                                                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                                    Répétitions requises:{' '}
                                                    {exercise.required_repetitions ||
                                                        5}{' '}
                                                    fois
                                                </p>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-semibold text-slate-700 dark:text-slate-300">
                                                    Mots (
                                                    {exercise.words?.length ||
                                                        0}
                                                    )
                                                </h4>
                                                <Dialog
                                                    open={
                                                        isAddWordDialogOpen &&
                                                        selectedExercise?.id ===
                                                            exercise.id
                                                    }
                                                    onOpenChange={(open) => {
                                                        setIsAddWordDialogOpen(
                                                            open,
                                                        );
                                                        if (open) {
                                                            setSelectedExercise(
                                                                exercise,
                                                            );
                                                        } else {
                                                            setSelectedExercise(
                                                                null,
                                                            );
                                                            setSelectedWordAudio(
                                                                null,
                                                            );
                                                            setWordAudioBlob(
                                                                null,
                                                            );
                                                            setIsRecordingWord(
                                                                false,
                                                            );
                                                            resetWordForm();
                                                        }
                                                    }}
                                                >
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                        >
                                                            <Plus className="mr-2 h-4 w-4" />
                                                            Ajouter un mot
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>
                                                                Ajouter un mot
                                                            </DialogTitle>
                                                            <DialogDescription>
                                                                Ajoutez un texte
                                                                et un audio
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <div className="space-y-4">
                                                            <div>
                                                                <Label>
                                                                    Texte (mot)
                                                                </Label>
                                                                <Input
                                                                    placeholder="Ex: maison"
                                                                    value={
                                                                        wordData.text
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        setWordData(
                                                                            'text',
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        )
                                                                    }
                                                                />
                                                            </div>
                                                            <div>
                                                                <Label>
                                                                    Audio
                                                                </Label>
                                                                <div className="flex gap-2">
                                                                    <Button
                                                                        type="button"
                                                                        variant={
                                                                            isRecordingWord
                                                                                ? 'destructive'
                                                                                : 'outline'
                                                                        }
                                                                        className="flex-1"
                                                                        onClick={
                                                                            isRecordingWord
                                                                                ? stopWordRecording
                                                                                : startWordRecording
                                                                        }
                                                                    >
                                                                        <Mic className="mr-2 h-4 w-4" />
                                                                        {isRecordingWord
                                                                            ? "Arrêter l'enregistrement"
                                                                            : 'Enregistrer'}
                                                                    </Button>
                                                                </div>
                                                                {wordAudioBlob && (
                                                                    <div className="flex items-center gap-2 rounded-md border border-green-200 bg-green-50 p-2">
                                                                        <Volume2 className="h-4 w-4 text-green-700" />
                                                                        <span className="text-sm text-green-700">
                                                                            Audio
                                                                            enregistré
                                                                        </span>
                                                                    </div>
                                                                )}
                                                                <div className="text-center text-sm text-slate-600">
                                                                    ou
                                                                </div>
                                                                <Input
                                                                    type="file"
                                                                    accept="audio/*"
                                                                    onChange={(
                                                                        e,
                                                                    ) => {
                                                                        const file =
                                                                            e
                                                                                .target
                                                                                .files?.[0] ||
                                                                            null;
                                                                        if (
                                                                            file
                                                                        ) {
                                                                            setWordData(
                                                                                'audio',
                                                                                file,
                                                                            );
                                                                            setSelectedWordAudio(
                                                                                file,
                                                                            );
                                                                            setWordAudioBlob(
                                                                                null,
                                                                            );
                                                                        }
                                                                    }}
                                                                />
                                                                {selectedWordAudio &&
                                                                    !wordAudioBlob && (
                                                                        <p className="mt-2 text-sm text-green-600">
                                                                            {
                                                                                selectedWordAudio.name
                                                                            }
                                                                        </p>
                                                                    )}
                                                                {wordErrors.audio && (
                                                                    <p className="text-sm text-red-600">
                                                                        {
                                                                            wordErrors.audio
                                                                        }
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <DialogFooter>
                                                            <Button
                                                                onClick={() =>
                                                                    handleAddWord(
                                                                        exercise,
                                                                    )
                                                                }
                                                                disabled={
                                                                    isAddingWord
                                                                }
                                                            >
                                                                Ajouter
                                                            </Button>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>

                                            {!exercise.words ||
                                            exercise.words.length === 0 ? (
                                                <div className="rounded-lg border-2 border-dashed border-slate-200 p-12 text-center">
                                                    <Upload className="mx-auto mb-3 h-12 w-12 text-slate-400" />
                                                    <p className="text-sm text-slate-600">
                                                        Aucun mot ajouté
                                                    </p>
                                                    <p className="mt-1 text-xs text-slate-400">
                                                        Cliquez sur "Ajouter un
                                                        mot" pour commencer
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="space-y-2">
                                                    {exercise.words.map(
                                                        (word: any) => (
                                                            <div
                                                                key={word.id}
                                                                className="group flex items-center justify-between rounded-lg border-2 border-slate-200 bg-white p-3 transition-all hover:shadow-md"
                                                            >
                                                                <div className="flex-1">
                                                                    <p className="font-semibold text-slate-900">
                                                                        {
                                                                            word.text
                                                                        }
                                                                    </p>
                                                                    <audio
                                                                        controls
                                                                        className="mt-2 h-8 w-full"
                                                                        src={`/storage/${word.audio_path}`}
                                                                    />
                                                                </div>
                                                                <Button
                                                                    variant="destructive"
                                                                    size="sm"
                                                                    className="ml-3"
                                                                    onClick={() =>
                                                                        deleteWord(
                                                                            exercise,
                                                                            word,
                                                                        )
                                                                    }
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            )}
                                        </>
                                    )}

                                    {exercise.type === 'select_image' && (
                                        <>
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-semibold text-slate-700 dark:text-slate-300">
                                                    Images (
                                                    {exercise.images?.length ||
                                                        0}
                                                    )
                                                </h4>
                                                <Dialog
                                                    open={
                                                        isAddImageDialogOpen &&
                                                        selectedExercise?.id ===
                                                            exercise.id
                                                    }
                                                    onOpenChange={(open) => {
                                                        setIsAddImageDialogOpen(
                                                            open,
                                                        );
                                                        if (open) {
                                                            setSelectedExercise(
                                                                exercise,
                                                            );
                                                        } else {
                                                            setSelectedExercise(
                                                                null,
                                                            );
                                                            setSelectedImage(
                                                                null,
                                                            );
                                                            setSelectedAudio(
                                                                null,
                                                            );
                                                            setAudioBlob(null);
                                                            setIsRecording(
                                                                false,
                                                            );
                                                        }
                                                    }}
                                                >
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                        >
                                                            <Plus className="mr-2 h-4 w-4" />
                                                            Ajouter une image
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>
                                                                Ajouter une
                                                                image
                                                            </DialogTitle>
                                                            <DialogDescription>
                                                                Téléversez une
                                                                image et ajoutez
                                                                le texte.
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <div className="space-y-4 py-4">
                                                            <div className="space-y-2">
                                                                <Label htmlFor="image">
                                                                    Image
                                                                </Label>
                                                                <Input
                                                                    id="image"
                                                                    type="file"
                                                                    accept="image/*"
                                                                    onChange={(
                                                                        e,
                                                                    ) => {
                                                                        const file =
                                                                            e
                                                                                .target
                                                                                .files?.[0] ||
                                                                            null;
                                                                        setSelectedImage(
                                                                            file,
                                                                        );
                                                                        setImageData(
                                                                            'image',
                                                                            file,
                                                                        );
                                                                    }}
                                                                />
                                                                {imageErrors.image && (
                                                                    <p className="text-sm text-red-600">
                                                                        {
                                                                            imageErrors.image
                                                                        }
                                                                    </p>
                                                                )}
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label htmlFor="text">
                                                                    Texte
                                                                </Label>
                                                                <Input
                                                                    id="text"
                                                                    type="text"
                                                                    placeholder="Ex: chat, lune, etc."
                                                                    value={
                                                                        imageData.text
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        setImageData(
                                                                            'text',
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        )
                                                                    }
                                                                />
                                                                {imageErrors.text && (
                                                                    <p className="text-sm text-red-600">
                                                                        {
                                                                            imageErrors.text
                                                                        }
                                                                    </p>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <Checkbox
                                                                    id="is_correct"
                                                                    checked={
                                                                        imageData.is_correct
                                                                    }
                                                                    onCheckedChange={(
                                                                        checked,
                                                                    ) =>
                                                                        setImageData(
                                                                            'is_correct',
                                                                            checked ===
                                                                                true,
                                                                        )
                                                                    }
                                                                />
                                                                <Label
                                                                    htmlFor="is_correct"
                                                                    className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                                >
                                                                    Cette image
                                                                    est correcte
                                                                </Label>
                                                            </div>
                                                        </div>
                                                        <DialogFooter>
                                                            <Button
                                                                variant="outline"
                                                                onClick={() => {
                                                                    setIsAddImageDialogOpen(
                                                                        false,
                                                                    );
                                                                    setSelectedImage(
                                                                        null,
                                                                    );
                                                                    setSelectedAudio(
                                                                        null,
                                                                    );
                                                                    setAudioBlob(
                                                                        null,
                                                                    );
                                                                }}
                                                            >
                                                                Annuler
                                                            </Button>
                                                            <Button
                                                                onClick={() =>
                                                                    handleAddImage(
                                                                        exercise,
                                                                    )
                                                                }
                                                                disabled={
                                                                    !selectedImage
                                                                }
                                                            >
                                                                Ajouter
                                                            </Button>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>

                                            {!exercise.images ||
                                            exercise.images.length === 0 ? (
                                                <div className="rounded-lg border-2 border-dashed border-slate-200 p-12 text-center">
                                                    <Upload className="mx-auto mb-3 h-12 w-12 text-slate-400" />
                                                    <p className="text-sm text-slate-600">
                                                        Aucune image ajoutée
                                                    </p>
                                                    <p className="mt-1 text-xs text-slate-400">
                                                        Cliquez sur "Ajouter une
                                                        image" pour commencer
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                                                    {exercise.images.map(
                                                        (image) => (
                                                            <div
                                                                key={image.id}
                                                                className="group relative rounded-lg border-2 border-slate-200 bg-white p-3 transition-all hover:shadow-lg"
                                                            >
                                                                <div className="relative aspect-square overflow-hidden rounded-md">
                                                                    <img
                                                                        src={`/storage/${image.image_path}`}
                                                                        alt="Exercise"
                                                                        className="h-full w-full object-cover"
                                                                        loading="lazy"
                                                                        decoding="async"
                                                                    />
                                                                    <button
                                                                        onClick={() =>
                                                                            toggleCorrect(
                                                                                exercise,
                                                                                image,
                                                                            )
                                                                        }
                                                                        className={`absolute top-2 right-2 rounded-full p-1.5 shadow-lg transition-all ${
                                                                            image.is_correct
                                                                                ? 'bg-green-500 text-white'
                                                                                : 'bg-red-500 text-white'
                                                                        }`}
                                                                    >
                                                                        {image.is_correct ? (
                                                                            <Check className="h-4 w-4" />
                                                                        ) : (
                                                                            <X className="h-4 w-4" />
                                                                        )}
                                                                    </button>
                                                                </div>
                                                                {image.text && (
                                                                    <div className="mt-2 text-center">
                                                                        <p className="text-sm font-medium text-slate-700">
                                                                            {
                                                                                image.text
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                )}
                                                                <Button
                                                                    variant="destructive"
                                                                    size="sm"
                                                                    className="mt-3 w-full opacity-0 transition-opacity group-hover:opacity-100"
                                                                    onClick={() =>
                                                                        deleteImage(
                                                                            exercise,
                                                                            image,
                                                                        )
                                                                    }
                                                                >
                                                                    <Trash2 className="mr-2 h-3 w-3" />
                                                                    Supprimer
                                                                </Button>
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            )}
                                        </>
                                    )}

                                    {exercise.type === 'choose_letter' && (
                                        <>
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-semibold text-slate-700 dark:text-slate-300">
                                                    Images (
                                                    {exercise.images?.length ||
                                                        0}
                                                    )
                                                </h4>
                                                <Dialog
                                                    open={
                                                        isAddImageDialogOpen &&
                                                        selectedExercise?.id ===
                                                            exercise.id
                                                    }
                                                    onOpenChange={(open) => {
                                                        setIsAddImageDialogOpen(
                                                            open,
                                                        );
                                                        if (open) {
                                                            setSelectedExercise(
                                                                exercise,
                                                            );
                                                        } else {
                                                            setSelectedExercise(
                                                                null,
                                                            );
                                                            setSelectedImage(
                                                                null,
                                                            );
                                                        }
                                                    }}
                                                >
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                        >
                                                            <Plus className="mr-2 h-4 w-4" />
                                                            Ajouter une image
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>
                                                                Ajouter une
                                                                image avec mot
                                                            </DialogTitle>
                                                            <DialogDescription>
                                                                Téléversez une
                                                                image, entrez le
                                                                mot complet et
                                                                choisissez la
                                                                lettre à
                                                                masquer.
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <div className="space-y-4 py-4">
                                                            <div className="space-y-2">
                                                                <Label htmlFor="image">
                                                                    Image
                                                                </Label>
                                                                <Input
                                                                    id="image"
                                                                    type="file"
                                                                    accept="image/*"
                                                                    onChange={(
                                                                        e,
                                                                    ) => {
                                                                        const file =
                                                                            e
                                                                                .target
                                                                                .files?.[0] ||
                                                                            null;
                                                                        setSelectedImage(
                                                                            file,
                                                                        );
                                                                        setImageData(
                                                                            'image',
                                                                            file,
                                                                        );
                                                                    }}
                                                                />
                                                                {imageErrors.image && (
                                                                    <p className="text-sm text-red-600">
                                                                        {
                                                                            imageErrors.image
                                                                        }
                                                                    </p>
                                                                )}
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label htmlFor="full_text">
                                                                    Mot complet
                                                                </Label>
                                                                <Input
                                                                    id="full_text"
                                                                    type="text"
                                                                    placeholder="Ex: maman, tableau, tomate"
                                                                    value={
                                                                        imageData.full_text
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        setImageData(
                                                                            'full_text',
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        )
                                                                    }
                                                                />
                                                                {imageErrors.full_text && (
                                                                    <p className="text-sm text-red-600">
                                                                        {
                                                                            imageErrors.full_text
                                                                        }
                                                                    </p>
                                                                )}
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label htmlFor="masked_position">
                                                                    Position de
                                                                    la lettre à
                                                                    masquer (0 =
                                                                    première
                                                                    lettre)
                                                                </Label>
                                                                <Input
                                                                    id="masked_position"
                                                                    type="number"
                                                                    min="0"
                                                                    placeholder="Ex: 0, 1, 2..."
                                                                    value={
                                                                        imageData.masked_position ??
                                                                        ''
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        setImageData(
                                                                            'masked_position',
                                                                            e
                                                                                .target
                                                                                .value
                                                                                ? parseInt(
                                                                                      e
                                                                                          .target
                                                                                          .value,
                                                                                  )
                                                                                : null,
                                                                        )
                                                                    }
                                                                />
                                                                {imageErrors.masked_position && (
                                                                    <p className="text-sm text-red-600">
                                                                        {
                                                                            imageErrors.masked_position
                                                                        }
                                                                    </p>
                                                                )}
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label htmlFor="correct_letter">
                                                                    Lettre
                                                                    correcte
                                                                    (sera
                                                                    calculée
                                                                    automatiquement)
                                                                </Label>
                                                                <Input
                                                                    id="correct_letter"
                                                                    type="text"
                                                                    placeholder="Ex: a, m"
                                                                    value={
                                                                        imageData.masked_position !==
                                                                            null &&
                                                                        imageData.full_text
                                                                            ? imageData
                                                                                  .full_text[
                                                                                  imageData
                                                                                      .masked_position
                                                                              ] ||
                                                                              ''
                                                                            : imageData.correct_letter
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        setImageData(
                                                                            'correct_letter',
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        )
                                                                    }
                                                                    readOnly={
                                                                        imageData.masked_position !==
                                                                            null &&
                                                                        !!imageData.full_text
                                                                    }
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label htmlFor="decoy_letters">
                                                                    Lettres
                                                                    incorrectes
                                                                    (decoys)
                                                                </Label>
                                                                <Input
                                                                    id="decoy_letters"
                                                                    type="text"
                                                                    placeholder="Ex: a, i, o, u"
                                                                    defaultValue={imageData.decoy_letters.join(
                                                                        ', ',
                                                                    )}
                                                                    onBlur={(
                                                                        e,
                                                                    ) => {
                                                                        const letters =
                                                                            e.target.value
                                                                                .split(
                                                                                    ',',
                                                                                )
                                                                                .map(
                                                                                    (
                                                                                        l,
                                                                                    ) =>
                                                                                        l.trim(),
                                                                                )
                                                                                .filter(
                                                                                    (
                                                                                        l,
                                                                                    ) =>
                                                                                        l !==
                                                                                        '',
                                                                                );
                                                                        setImageData(
                                                                            'decoy_letters',
                                                                            letters,
                                                                        );
                                                                    }}
                                                                />
                                                                <p className="text-xs text-slate-500">
                                                                    Séparez les
                                                                    lettres par
                                                                    des
                                                                    virgules.
                                                                    Ces lettres
                                                                    seront
                                                                    affichées
                                                                    avec la
                                                                    lettre
                                                                    correcte
                                                                    pour cette
                                                                    image.
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <DialogFooter>
                                                            <Button
                                                                variant="outline"
                                                                onClick={() => {
                                                                    setIsAddImageDialogOpen(
                                                                        false,
                                                                    );
                                                                    setSelectedExercise(
                                                                        null,
                                                                    );
                                                                    setSelectedImage(
                                                                        null,
                                                                    );
                                                                }}
                                                            >
                                                                Annuler
                                                            </Button>
                                                            <Button
                                                                onClick={() =>
                                                                    handleAddImage(
                                                                        exercise,
                                                                    )
                                                                }
                                                                disabled={
                                                                    !selectedImage ||
                                                                    !imageData.full_text ||
                                                                    imageData.masked_position ===
                                                                        null
                                                                }
                                                            >
                                                                Ajouter
                                                            </Button>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>

                                            {!exercise.images ||
                                            exercise.images.length === 0 ? (
                                                <div className="rounded-lg border-2 border-dashed border-slate-200 p-12 text-center">
                                                    <Upload className="mx-auto mb-3 h-12 w-12 text-slate-400" />
                                                    <p className="text-sm text-slate-600">
                                                        Aucune image ajoutée
                                                    </p>
                                                    <p className="mt-1 text-xs text-slate-400">
                                                        Cliquez sur "Ajouter une
                                                        image" pour commencer
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                                                    {exercise.images.map(
                                                        (image) => (
                                                            <div
                                                                key={image.id}
                                                                className="group relative rounded-lg border-2 border-slate-200 bg-white p-3 transition-all hover:shadow-lg"
                                                            >
                                                                <div className="relative aspect-square overflow-hidden rounded-md">
                                                                    <img
                                                                        src={`/storage/${image.image_path}`}
                                                                        alt="Exercise"
                                                                        className="h-full w-full object-cover"
                                                                        loading="lazy"
                                                                        decoding="async"
                                                                    />
                                                                </div>
                                                                {image.full_text && (
                                                                    <div className="mt-2 text-center">
                                                                        <p className="text-sm font-medium text-slate-700">
                                                                            {
                                                                                image.full_text
                                                                            }
                                                                        </p>
                                                                        <p className="text-xs text-slate-500">
                                                                            Lettre
                                                                            masquée:{' '}
                                                                            {
                                                                                image.correct_letter
                                                                            }{' '}
                                                                            (position{' '}
                                                                            {
                                                                                image.masked_position
                                                                            }
                                                                            )
                                                                        </p>
                                                                    </div>
                                                                )}
                                                                <Button
                                                                    variant="destructive"
                                                                    size="sm"
                                                                    className="mt-3 w-full opacity-0 transition-opacity group-hover:opacity-100"
                                                                    onClick={() =>
                                                                        deleteImage(
                                                                            exercise,
                                                                            image,
                                                                        )
                                                                    }
                                                                >
                                                                    <Trash2 className="mr-2 h-3 w-3" />
                                                                    Supprimer
                                                                </Button>
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                <Dialog
                    open={isEditDialogOpen}
                    onOpenChange={(open) => {
                        setIsEditDialogOpen(open);
                        if (!open) {
                            setSelectedExercise(null);
                            resetEditForm();
                        }
                    }}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Modifier l'exercice</DialogTitle>
                            <DialogDescription>
                                Modifiez le titre et la description de
                                l'exercice
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="edit-title">Titre</Label>
                                <Input
                                    id="edit-title"
                                    value={editExerciseData.title}
                                    onChange={(e) =>
                                        setEditExerciseData(
                                            'title',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Titre de l'exercice"
                                />
                            </div>
                            <div>
                                <Label htmlFor="edit-description">
                                    Description
                                </Label>
                                <Textarea
                                    id="edit-description"
                                    value={editExerciseData.description}
                                    onChange={(e) =>
                                        setEditExerciseData(
                                            'description',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Description de l'exercice"
                                    rows={4}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setIsEditDialogOpen(false)}
                            >
                                Annuler
                            </Button>
                            <Button
                                onClick={handleUpdateExercise}
                                disabled={isUpdating}
                            >
                                {isUpdating ? 'Modification...' : 'Modifier'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
