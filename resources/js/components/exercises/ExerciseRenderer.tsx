import ChooseWhenHearExercise from './ChooseWhenHearExercise';

interface ExerciseImage {
    id: number;
    image_path: string;
    audio_path: string;
    is_correct: boolean;
}

interface Exercise {
    id: number;
    type: string;
    title: string;
    description: string | null;
    images: ExerciseImage[];
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
