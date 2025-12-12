import ChooseWhenHearExercise from './ChooseWhenHearExercise';
import ChooseWhenReadExercise from './ChooseWhenReadExercise';
import SelectImageExercise from './SelectImageExercise';

interface ExerciseImage {
    id: number;
    image_path: string;
    audio_path: string | null;
    text?: string | null;
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
