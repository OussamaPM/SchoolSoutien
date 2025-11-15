import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { ArrowLeft, BookOpen, GraduationCap, Sparkles } from 'lucide-react';

export interface ChildProfile {
    id: number;
    name: string;
    education_level?: {
        id: number;
        name: string;
        category?: {
            id: number;
            name: string;
        };
        education_subjects?: Subject[];
    };
    current_plan?: {
        plan: {
            id: number;
            name: string;
        };
    };
}

interface Subject {
    id: number;
    name: string;
    description?: string;
}

interface Props {
    child: ChildProfile;
}

export default function ChildSession({ child }: Props) {
    const subjects = child.education_level?.education_subjects || [];

    return (
        <AppLayout>
            <Head title={`Session - ${child.name}`} />

            <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
                <div className="mx-auto max-w-7xl px-6 py-12">
                    {/* Back Button */}
                    <Button
                        variant="ghost"
                        className="mb-6"
                        onClick={() => router.visit('/dashboard')}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Retour au tableau de bord
                    </Button>

                    {/* Welcome Section */}
                    <div className="mb-12 text-center">
                        <div className="mb-4 flex items-center justify-center gap-3">
                            <Sparkles className="h-8 w-8 text-purple-500" />
                            <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                                Bonjour, {child.name} !
                            </h1>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
                            {child.education_level && (
                                <Badge
                                    variant="outline"
                                    className="px-4 py-2 text-sm"
                                >
                                    <GraduationCap className="mr-2 h-4 w-4" />
                                    {child.education_level.name}
                                </Badge>
                            )}

                            {child.education_level?.category && (
                                <Badge
                                    variant="outline"
                                    className="px-4 py-2 text-sm"
                                >
                                    {child.education_level.category.name}
                                </Badge>
                            )}

                            {child.current_plan && (
                                <Badge className="bg-emerald-500 px-4 py-2 text-sm hover:bg-emerald-600">
                                    {child.current_plan.plan.name}
                                </Badge>
                            )}
                        </div>
                    </div>

                    {/* Subjects Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                                Matières disponibles
                            </h2>
                        </div>

                        {subjects.length === 0 ? (
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center py-12">
                                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                                        <BookOpen className="h-8 w-8 text-slate-400" />
                                    </div>
                                    <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                                        Aucune matière disponible
                                    </h3>
                                    <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                                        Les matières seront bientôt disponibles
                                        pour ce niveau.
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {subjects.map((subject) => (
                                    <Card
                                        key={subject.id}
                                        className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg"
                                    >
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2 text-xl">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-blue-500 to-purple-500 text-white">
                                                    <BookOpen className="h-5 w-5" />
                                                </div>
                                                {subject.name}
                                            </CardTitle>
                                            {subject.description && (
                                                <CardDescription>
                                                    {subject.description}
                                                </CardDescription>
                                            )}
                                        </CardHeader>
                                        <CardContent>
                                            <Button
                                                className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                                disabled
                                            >
                                                Bientôt disponible
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* WIP Notice */}
                    <div className="mt-12">
                        <Card className="border-dashed border-amber-300 bg-amber-50/50 dark:border-amber-700 dark:bg-amber-950/20">
                            <CardContent className="py-6 text-center">
                                <p className="text-sm text-amber-800 dark:text-amber-200">
                                    🚧 Cette page est en cours de développement.
                                    Les fonctionnalités d'apprentissage seront
                                    ajoutées prochainement.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
