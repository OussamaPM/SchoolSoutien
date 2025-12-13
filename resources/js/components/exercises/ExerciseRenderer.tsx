import ChooseLetterExercise from './ChooseLetterExercise';
import ChooseWhenHearExercise from './ChooseWhenHearExercise';
import ChooseWhenReadExercise from './ChooseWhenReadExercise';
import SelectImageExercise from './SelectImageExercise';

interface ExerciseImage {
    id: number;
    image_path: string;
    audio_path: string | null;
    text?: string | null;
    full_text?: string;
    masked_position?: number;
    correct_letter?: string;
    decoy_letters?: string[];
    is_correct: boolean;
}

interface ExerciseWord {
    id: number;
    text: string;
    audio_path: string;
}

interface Exercise {
    id: number;
    type: string;
    title: string;
    description: string | null;
    images: ExerciseImage[];
    words?: ExerciseWord[];
    required_repetitions?: number;
    letter_options?: string[];
}

interface Props {
    exercise: Exercise;
    onComplete: () => void;
    onRetry: () => void;
    onSubmitScore: (score: number, total: number) => void;
}

export default function ExerciseRenderer({
    exercise,
    onComplete,
    onRetry,
    onSubmitScore,
}: Props) {
    switch (exercise.type) {
        case 'choose_when_hear':
            return (
                <ChooseWhenHearExercise
                    images={exercise.images}
                    onComplete={onComplete}
                    onRetry={onRetry}
                    onSubmitScore={onSubmitScore}
                />
            );

        case 'choose_when_read':
            return (
                <ChooseWhenReadExercise
                    words={exercise.words || []}
                    requiredRepetitions={exercise.required_repetitions || 5}
                    onComplete={onComplete}
                    onRetry={onRetry}
                    onSubmitScore={onSubmitScore}
                />
            );

        case 'select_image':
            return (
                <SelectImageExercise
                    images={exercise.images}
                    instruction={
                        exercise.description || 'Sélectionnez les bonnes images'
                    }
                    onComplete={onComplete}
                    onRetry={onRetry}
                    onSubmitScore={onSubmitScore}
                />
            );

        case 'choose_letter':
            return (
                <ChooseLetterExercise
                    images={exercise.images.map((img) => ({
                        id: img.id,
                        image_path: img.image_path,
                        full_text: img.full_text || '',
                        masked_position: img.masked_position || 0,
                        correct_letter: img.correct_letter || '',
                        decoy_letters: img.decoy_letters || [
                            'a',
                            'e',
                            'i',
                            'o',
                            'u',
                        ],
                    }))}
                    instruction={
                        exercise.description || 'Écris la bonne lettre'
                    }
                    onComplete={onComplete}
                    onRetry={onRetry}
                    onSubmitScore={onSubmitScore}
                />
            );

        // Future exercise types go here
        // case 'another_type':
        //     return <AnotherTypeExercise {...props} />;

        default:
            return (
                <div className="rounded-lg border-2 border-dashed border-slate-300 p-12 text-center">
                    <p className="text-slate-600">
                        Type d'exercice non supporté: {exercise.type}
                    </p>
                </div>
            );
    }
}
