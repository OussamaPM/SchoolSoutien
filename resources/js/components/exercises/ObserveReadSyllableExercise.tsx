import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Volume2 } from 'lucide-react';
import { useState } from 'react';

interface ExerciseWord {
    id: number;
    text: string;
    audio_path: string;
    first_letter?: string;
    second_letter?: string;
    syllable?: string;
}

interface Props {
    words: ExerciseWord[];
    instruction: string;
    onComplete: () => void;
    onRetry: () => void;
    onSubmitScore: (score: number, total: number) => void;
}

export default function ObserveReadSyllableExercise({
    words,
    instruction,
    onComplete,
    onRetry,
    onSubmitScore,
}: Props) {
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [score, setScore] = useState(0);

    const currentWord = words[currentWordIndex];
    const isLastWord = currentWordIndex === words.length - 1;

    const playAudio = (audioPath: string) => {
        const audio = new Audio(audioPath);
        audio.play();
    };

    const handleNext = () => {
        if (isLastWord) {
            // Calculate final score - for now, give full points for completion
            onSubmitScore(words.length, words.length);
            onComplete();
        } else {
            setCurrentWordIndex(currentWordIndex + 1);
        }
    };

    if (!currentWord) {
        return (
            <div className="rounded-lg border-2 border-dashed border-slate-300 p-12 text-center">
                <p className="text-slate-600">Aucun mot disponible</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-center text-xl">
                        {instruction}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                    {/* Syllable Display */}
                    <div className="text-center">
                        <div className="mb-4 text-6xl font-bold">
                            <span className="text-blue-600">
                                {currentWord.first_letter || currentWord.text.charAt(0)}
                            </span>
                            <span className="text-green-600 ml-2">
                                {currentWord.second_letter || currentWord.text.charAt(1)}
                            </span>
                        </div>
                        <div className="text-2xl text-gray-600 mb-4">
                            = {currentWord.syllable || currentWord.text.substring(0, 2)}
                        </div>
                    </div>

                    {/* Word Display with Audio */}
                    <div className="text-center">
                        <div className="inline-flex items-center gap-4 rounded-lg bg-gray-50 p-4">
                            <span className="text-3xl font-bold text-gray-800">
                                {currentWord.text}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => playAudio(currentWord.audio_path)}
                                className="flex items-center gap-2"
                            >
                                <Volume2 className="h-4 w-4" />
                                Écouter
                            </Button>
                        </div>
                    </div>

                    {/* Progress Indicator */}
                    <div className="text-center">
                        <div className="text-sm text-gray-600">
                            Mot {currentWordIndex + 1} sur {words.length}
                        </div>
                        <div className="mt-2 h-2 w-full max-w-xs mx-auto rounded-full bg-gray-200">
                            <div
                                className="h-2 rounded-full bg-blue-500 transition-all duration-300"
                                style={{
                                    width: `${((currentWordIndex + 1) / words.length) * 100}%`,
                                }}
                            />
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="text-center">
                        <Button
                            onClick={handleNext}
                            className="px-8 py-3 text-lg"
                        >
                            {isLastWord ? 'Terminer' : 'Suivant'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}