import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Check, Link2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface WordPair {
    left_text: string;
    right_text: string;
}

interface Connection {
    leftIndex: number;
    rightIndex: number;
}

interface Props {
    wordPairs: WordPair[];
    instruction: string;
    onNext: () => void;
    onSubmitScore: (score: number, total: number) => void;
}

export default function ConnectWordsExercise({
    wordPairs,
    instruction,
    onNext,
    onSubmitScore,
}: Props) {
    const [leftItems] = useState(wordPairs.map((pair) => pair.left_text));
    const [rightItems, setRightItems] = useState<string[]>([]);
    const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
    const [connections, setConnections] = useState<Connection[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const leftRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const rightRefs = useRef<(HTMLButtonElement | null)[]>([]);

    // Shuffle right items on mount
    useEffect(() => {
        const shuffled = [...wordPairs.map((pair) => pair.right_text)].sort(
            () => Math.random() - 0.5,
        );
        setRightItems(shuffled);
    }, []); // Empty dependency array - only run once on mount

    const handleLeftClick = (index: number) => {
        if (showResults) return;

        // If clicking the same left item, deselect it
        if (selectedLeft === index) {
            setSelectedLeft(null);
            return;
        }

        // Remove any existing connection from this left item
        const filteredConnections = connections.filter(
            (c) => c.leftIndex !== index,
        );
        setConnections(filteredConnections);

        setSelectedLeft(index);
    };

    const handleRightClick = (rightIndex: number) => {
        if (showResults || selectedLeft === null) return;

        // Create new connection
        const newConnection: Connection = {
            leftIndex: selectedLeft,
            rightIndex,
        };

        // Remove any existing connections to this right item or from this left item
        const filteredConnections = connections.filter(
            (c) => c.rightIndex !== rightIndex && c.leftIndex !== selectedLeft,
        );

        setConnections([...filteredConnections, newConnection]);
        setSelectedLeft(null);
    };

    const handleValidate = () => {
        let correctCount = 0;

        connections.forEach((connection) => {
            const leftText = leftItems[connection.leftIndex];
            const rightText = rightItems[connection.rightIndex];

            // Find the original pair
            const originalPair = wordPairs.find(
                (pair) => pair.left_text === leftText,
            );

            if (originalPair && originalPair.right_text === rightText) {
                correctCount++;
            }
        });

        setScore(correctCount);
        setShowResults(true);
        onSubmitScore(correctCount, wordPairs.length);
    };

    const isConnectionCorrect = (connection: Connection): boolean => {
        const leftText = leftItems[connection.leftIndex];
        const rightText = rightItems[connection.rightIndex];
        const originalPair = wordPairs.find(
            (pair) => pair.left_text === leftText,
        );
        return originalPair?.right_text === rightText;
    };

    const getLeftConnectionStyle = (leftIndex: number) => {
        const connection = connections.find((c) => c.leftIndex === leftIndex);
        if (!connection) {
            return selectedLeft === leftIndex
                ? 'border-cyan-400 bg-cyan-50 ring-4 ring-cyan-200'
                : 'border-slate-200 bg-white hover:border-cyan-300 hover:bg-cyan-50';
        }

        if (showResults) {
            return isConnectionCorrect(connection)
                ? 'border-green-300 bg-green-50'
                : 'border-red-300 bg-red-50';
        }

        return 'border-cyan-300 bg-cyan-50';
    };

    const getRightConnectionStyle = (rightIndex: number) => {
        const connection = connections.find((c) => c.rightIndex === rightIndex);
        if (!connection) {
            return 'border-slate-200 bg-white hover:border-cyan-300 hover:bg-cyan-50';
        }

        if (showResults) {
            return isConnectionCorrect(connection)
                ? 'border-green-300 bg-green-50'
                : 'border-red-300 bg-red-50';
        }

        return 'border-cyan-300 bg-cyan-50';
    };

    const allConnected = connections.length === wordPairs.length;

    // Calculate SVG path for arrow between two elements
    const getArrowPath = (leftIndex: number, rightIndex: number): string => {
        const leftEl = leftRefs.current[leftIndex];
        const rightEl = rightRefs.current[rightIndex];
        const container = containerRef.current;

        if (!leftEl || !rightEl || !container) return '';

        const containerRect = container.getBoundingClientRect();
        const leftRect = leftEl.getBoundingClientRect();
        const rightRect = rightEl.getBoundingClientRect();

        // Start point: right edge center of left element
        const startX = leftRect.right - containerRect.left;
        const startY = leftRect.top + leftRect.height / 2 - containerRect.top;

        // End point: left edge center of right element
        const endX = rightRect.left - containerRect.left;
        const endY = rightRect.top + rightRect.height / 2 - containerRect.top;

        // Control points for smooth curve
        const controlPointOffset = (endX - startX) / 2;
        const cp1X = startX + controlPointOffset;
        const cp1Y = startY;
        const cp2X = endX - controlPointOffset;
        const cp2Y = endY;

        return `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`;
    };

    return (
        <div className="mx-auto max-w-6xl p-6">
            <Card className="rounded-3xl border-2 border-cyan-200 bg-linear-to-br from-cyan-50 via-teal-50 to-cyan-50 shadow-xl">
                <CardHeader className="bg-linear-to-r from-cyan-100 to-teal-100 pb-4">
                    <CardTitle className="flex items-center gap-2 text-2xl">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500">
                            <Link2 className="h-6 w-6 text-white" />
                        </div>
                        <span className="bg-linear-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
                            {instruction}
                        </span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-8">
                    <div className="mb-4 text-center">
                        <p className="text-lg text-slate-700">
                            {showResults
                                ? `Score: ${score}/${wordPairs.length}`
                                : 'Clique sur un mot à gauche, puis sur sa correspondance à droite'}
                        </p>
                    </div>

                    <div className="relative" ref={containerRef}>
                        {/* SVG Layer for arrows */}
                        <svg
                            className="pointer-events-none absolute inset-0 h-full w-full"
                            style={{ zIndex: 1 }}
                        >
                            {connections.map((connection, idx) => {
                                const isCorrect =
                                    showResults &&
                                    isConnectionCorrect(connection);
                                const strokeColor = showResults
                                    ? isCorrect
                                        ? '#10b981'
                                        : '#ef4444'
                                    : '#06b6d4';

                                return (
                                    <path
                                        key={idx}
                                        d={getArrowPath(
                                            connection.leftIndex,
                                            connection.rightIndex,
                                        )}
                                        stroke={strokeColor}
                                        strokeWidth="4"
                                        fill="none"
                                        strokeLinecap="round"
                                    />
                                );
                            })}
                        </svg>

                        <div
                            className="relative grid grid-cols-2 gap-20"
                            style={{ zIndex: 2 }}
                        >
                            {/* Left column */}
                            <div className="space-y-3">
                                {leftItems.map((text, index) => {
                                    const connection = connections.find(
                                        (c) => c.leftIndex === index,
                                    );
                                    const isCorrect =
                                        connection && showResults
                                            ? isConnectionCorrect(connection)
                                            : false;

                                    return (
                                        <div key={index} className="relative">
                                            <button
                                                ref={(el) =>
                                                    (leftRefs.current[index] =
                                                        el)
                                                }
                                                onClick={() =>
                                                    handleLeftClick(index)
                                                }
                                                disabled={showResults}
                                                className={`w-full rounded-2xl border-2 p-4 text-left text-lg font-medium transition-all ${getLeftConnectionStyle(index)} ${
                                                    showResults
                                                        ? 'cursor-default'
                                                        : 'cursor-pointer'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="text-slate-800">
                                                        {text}
                                                    </span>
                                                    {showResults &&
                                                        connection && (
                                                            <div>
                                                                {isCorrect ? (
                                                                    <Check className="h-5 w-5 text-green-600" />
                                                                ) : (
                                                                    <X className="h-5 w-5 text-red-600" />
                                                                )}
                                                            </div>
                                                        )}
                                                </div>
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Right column */}
                            <div className="space-y-3">
                                {rightItems.map((text, index) => {
                                    const connection = connections.find(
                                        (c) => c.rightIndex === index,
                                    );
                                    const isCorrect =
                                        connection && showResults
                                            ? isConnectionCorrect(connection)
                                            : false;

                                    return (
                                        <div key={index} className="relative">
                                            <button
                                                ref={(el) =>
                                                    (rightRefs.current[index] =
                                                        el)
                                                }
                                                onClick={() =>
                                                    handleRightClick(index)
                                                }
                                                disabled={
                                                    showResults ||
                                                    selectedLeft === null
                                                }
                                                className={`w-full rounded-2xl border-2 p-4 text-left text-lg font-medium transition-all ${getRightConnectionStyle(index)} ${
                                                    showResults ||
                                                    selectedLeft === null
                                                        ? 'cursor-default'
                                                        : 'cursor-pointer'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="text-slate-800">
                                                        {text}
                                                    </span>
                                                    {showResults &&
                                                        connection && (
                                                            <div>
                                                                {isCorrect ? (
                                                                    <Check className="h-5 w-5 text-green-600" />
                                                                ) : (
                                                                    <X className="h-5 w-5 text-red-600" />
                                                                )}
                                                            </div>
                                                        )}
                                                </div>
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Connection indicator */}
                    {selectedLeft !== null && !showResults && (
                        <div className="flex items-center justify-center gap-2 rounded-2xl bg-cyan-100 p-3 text-cyan-700">
                            <ArrowRight className="h-5 w-5" />
                            <span className="text-sm font-medium">
                                Maintenant, clique sur la réponse à droite
                            </span>
                        </div>
                    )}

                    {/* Action buttons */}
                    <div className="mt-6 flex justify-center gap-4">
                        {!showResults ? (
                            <Button
                                onClick={handleValidate}
                                disabled={!allConnected}
                                size="lg"
                                className="rounded-2xl bg-linear-to-r from-cyan-500 to-teal-600 px-8 py-6 text-lg font-semibold text-white shadow-lg hover:from-cyan-600 hover:to-teal-700 disabled:opacity-50"
                            >
                                <Check className="mr-2 h-5 w-5" />
                                Valider ({connections.length}/{wordPairs.length}
                                )
                            </Button>
                        ) : (
                            <Button
                                onClick={onNext}
                                size="lg"
                                className="rounded-2xl bg-linear-to-r from-cyan-500 to-teal-600 px-8 py-6 text-lg font-semibold text-white shadow-lg hover:from-cyan-600 hover:to-teal-700"
                            >
                                Continuer
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
