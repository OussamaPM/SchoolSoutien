import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Subject } from '@/pages/admin/educational-programs/subjects';
import { learnSubject } from '@/routes/parent/child-sessions';
import { Head, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Beaker,
    Book,
    BookOpen,
    Calculator,
    Clock,
    Globe,
    GraduationCap,
    Heart,
    Languages,
    Lightbulb,
    Music,
    Palette,
    Scale,
    Sparkles,
    Trophy,
} from 'lucide-react';

const subjectIllustrations: Record<
    string,
    { icon: any; gradient: string; bgColor: string }
> = {
    géographie: {
        icon: Globe,
        gradient: 'from-orange-400 to-red-400',
        bgColor: 'bg-orange-50 dark:bg-orange-950/20',
    },
    mathématiques: {
        icon: Calculator,
        gradient: 'from-blue-400 to-cyan-400',
        bgColor: 'bg-blue-50 dark:bg-blue-950/20',
    },
    histoire: {
        icon: Clock,
        gradient: 'from-amber-400 to-orange-400',
        bgColor: 'bg-amber-50 dark:bg-amber-950/20',
    },
    svt: {
        icon: Beaker,
        gradient: 'from-teal-400 to-emerald-400',
        bgColor: 'bg-teal-50 dark:bg-teal-950/20',
    },
    physique: {
        icon: Beaker,
        gradient: 'from-sky-400 to-blue-500',
        bgColor: 'bg-sky-50 dark:bg-sky-950/20',
    },
    chimie: {
        icon: Beaker,
        gradient: 'from-purple-400 to-pink-400',
        bgColor: 'bg-purple-50 dark:bg-purple-950/20',
    },
    moral: {
        icon: Scale,
        gradient: 'from-yellow-400 to-amber-500',
        bgColor: 'bg-yellow-50 dark:bg-yellow-950/20',
    },
    civique: {
        icon: Heart,
        gradient: 'from-rose-400 to-pink-500',
        bgColor: 'bg-rose-50 dark:bg-rose-950/20',
    },
    français: {
        icon: Book,
        gradient: 'from-pink-400 to-rose-500',
        bgColor: 'bg-pink-50 dark:bg-pink-950/20',
    },
    anglais: {
        icon: Languages,
        gradient: 'from-indigo-400 to-purple-500',
        bgColor: 'bg-indigo-50 dark:bg-indigo-950/20',
    },
    allemand: {
        icon: Languages,
        gradient: 'from-orange-500 to-red-500',
        bgColor: 'bg-orange-50 dark:bg-orange-950/20',
    },
    espagnol: {
        icon: Languages,
        gradient: 'from-rose-500 to-pink-600',
        bgColor: 'bg-rose-50 dark:bg-rose-950/20',
    },
    arabe: {
        icon: Languages,
        gradient: 'from-emerald-500 to-teal-600',
        bgColor: 'bg-emerald-50 dark:bg-emerald-950/20',
    },
    art: {
        icon: Palette,
        gradient: 'from-fuchsia-400 to-purple-500',
        bgColor: 'bg-fuchsia-50 dark:bg-fuchsia-950/20',
    },
    musique: {
        icon: Music,
        gradient: 'from-violet-400 to-purple-500',
        bgColor: 'bg-violet-50 dark:bg-violet-950/20',
    },
    sport: {
        icon: Trophy,
        gradient: 'from-green-400 to-emerald-500',
        bgColor: 'bg-green-50 dark:bg-green-950/20',
    },
    default: {
        icon: Lightbulb,
        gradient: 'from-blue-500 to-purple-500',
        bgColor: 'bg-blue-50 dark:bg-blue-950/20',
    },
};

// Helper function to get subject illustration
const getSubjectIllustration = (subjectName: string) => {
    const normalizedName = subjectName.toLowerCase().trim();

    // Check for matches using contains
    if (normalizedName.includes('géo') || normalizedName.includes('geo')) {
        return subjectIllustrations['géographie'];
    }
    if (normalizedName.includes('math')) {
        return subjectIllustrations['mathématiques'];
    }
    if (normalizedName.includes('hist')) {
        return subjectIllustrations['histoire'];
    }
    if (
        normalizedName.includes('svt') ||
        normalizedName.includes('science') ||
        normalizedName.includes('vie') ||
        normalizedName.includes('terre')
    ) {
        return subjectIllustrations['svt'];
    }
    if (
        normalizedName.includes('droit') ||
        normalizedName.includes('civique') ||
        normalizedName.includes('juridique')
    ) {
        return subjectIllustrations['droit'];
    }
    if (
        normalizedName.includes('langue') ||
        normalizedName.includes('langue') ||
        normalizedName.includes('francais')
    ) {
        return subjectIllustrations['langues'];
    }
    if (
        normalizedName.includes('littér') ||
        normalizedName.includes('litter')
    ) {
        return subjectIllustrations['littérature'];
    }
    if (
        normalizedName.includes('art') ||
        normalizedName.includes('dessin') ||
        normalizedName.includes('peinture')
    ) {
        return subjectIllustrations['arts'];
    }
    if (
        normalizedName.includes('musique') ||
        normalizedName.includes('chant')
    ) {
        return subjectIllustrations['musique'];
    }
    if (
        normalizedName.includes('sport') ||
        normalizedName.includes('eps') ||
        normalizedName.includes('éducation physique')
    ) {
        return subjectIllustrations['sport'];
    }
    if (normalizedName.includes('santé') || normalizedName.includes('sante')) {
        return subjectIllustrations['santé'];
    }
    if (normalizedName.includes('philo')) {
        return subjectIllustrations['philosophie'];
    }
    if (normalizedName.includes('physique')) {
        return subjectIllustrations['physique'];
    }
    if (normalizedName.includes('chimie')) {
        return subjectIllustrations['chimie'];
    }
    if (normalizedName.includes('info') || normalizedName.includes('ordi')) {
        return subjectIllustrations['informatique'];
    }
    if (
        normalizedName.includes('anglais') ||
        normalizedName.includes('english')
    ) {
        return subjectIllustrations['anglais'];
    }

    // Default fallback
    return {
        icon: Lightbulb,
        gradient: 'from-blue-400 to-purple-500',
        bgColor: 'bg-blue-50 dark:bg-blue-950/20',
    };
};

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

interface Props {
    child: ChildProfile;
}

export default function ChildSession({ child }: Props) {
    const subjects = child.education_level?.education_subjects || [];

    return (
        <AppLayout>
            <Head title={`Session - ${child.name}`} />

            <div className="min-h-screen bg-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
                <div className="mx-auto max-w-7xl px-6 py-6">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.visit('/dashboard')}
                            >
                                <ArrowLeft className="mr-1.5 h-4 w-4" />
                                Retour
                            </Button>

                            <div className="flex items-center gap-2">
                                {child.education_level && (
                                    <Badge
                                        variant="outline"
                                        className="border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-950/20"
                                    >
                                        <GraduationCap className="mr-1 h-3 w-3" />
                                        {child.education_level.name}
                                    </Badge>
                                )}

                                {child.current_plan && (
                                    <Badge className="border border-emerald-300 bg-emerald-500 px-2.5 py-0.5 text-xs font-medium hover:bg-emerald-600">
                                        ✨ {child.current_plan.plan.name}
                                    </Badge>
                                )}
                            </div>
                        </div>

                        <div className="mt-4 flex items-center justify-center gap-2">
                            <Sparkles className="h-6 w-6 text-yellow-500" />
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                                Bonjour, {child.name} !
                            </h1>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {subjects.length === 0 ? (
                            <Card className="border-2 border-dashed border-slate-300 bg-slate-50/50 dark:border-slate-700 dark:bg-slate-900/50">
                                <CardContent className="flex flex-col items-center justify-center py-12">
                                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800">
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
                            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                                {subjects.map((subject) => {
                                    const illustration = getSubjectIllustration(
                                        subject.name,
                                    );
                                    const IconComponent = illustration.icon;

                                    return (
                                        <Card
                                            onClick={() =>
                                                router.visit(
                                                    learnSubject.url([
                                                        child.id,
                                                        subject.id,
                                                    ]),
                                                )
                                            }
                                            key={subject.id}
                                            className="group relative cursor-pointer overflow-hidden border-0 bg-white shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-xl dark:bg-slate-900"
                                        >
                                            <div className="absolute inset-0 opacity-10">
                                                <div
                                                    className={`h-24 bg-linear-to-b ${illustration.gradient}`}
                                                    style={{
                                                        clipPath:
                                                            'polygon(0 0, 100% 0, 100% 55%, 85% 60%, 70% 53%, 55% 58%, 40% 52%, 25% 56%, 10% 50%, 0 54%)',
                                                    }}
                                                />
                                            </div>

                                            <div className="relative p-4 pb-5 text-center">
                                                {/* Illustrated icon section */}
                                                <div className="relative mb-4 flex h-24 items-center justify-center">
                                                    <div
                                                        className={`absolute h-20 w-20 rounded-full bg-linear-to-br ${illustration.gradient} opacity-20 blur-md transition-all duration-500 group-hover:scale-125`}
                                                    />

                                                    <div
                                                        className={`absolute top-2 -left-2 h-6 w-6 rounded-lg bg-linear-to-br ${illustration.gradient} opacity-40 transition-all duration-500 group-hover:scale-110 group-hover:rotate-45`}
                                                    />
                                                    <div
                                                        className={`absolute -right-1 bottom-3 h-5 w-5 rotate-12 rounded-full bg-linear-to-br ${illustration.gradient} opacity-40 transition-all duration-500 group-hover:scale-110 group-hover:-rotate-12`}
                                                    />
                                                    <div
                                                        className={`absolute top-1 right-2 h-4 w-4 rotate-45 rounded-sm bg-linear-to-br ${illustration.gradient} opacity-30 transition-all duration-500 group-hover:scale-125 group-hover:rotate-90`}
                                                    />
                                                    <div
                                                        className={`absolute -bottom-1 left-3 h-3 w-3 rounded-full bg-linear-to-br ${illustration.gradient} opacity-50 transition-all duration-500 group-hover:scale-150`}
                                                    />

                                                    <div
                                                        className={`relative z-10 rounded-2xl bg-linear-to-br ${illustration.gradient} p-4 shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:-rotate-6 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)]`}
                                                        style={{
                                                            transform:
                                                                'perspective(500px) rotateX(5deg)',
                                                        }}
                                                    >
                                                        <div className="absolute top-1 left-1 h-4 w-4 rounded-full bg-white/50 blur-sm" />
                                                        <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-white/40 via-transparent to-transparent" />

                                                        <IconComponent
                                                            className="relative h-12 w-12 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
                                                            strokeWidth={2.5}
                                                        />

                                                        <div className="absolute -top-1.5 -right-1.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-linear-to-br from-yellow-300 to-orange-400 shadow-lg" />
                                                    </div>

                                                    <div
                                                        className={`absolute -top-2 right-4 h-2 w-2 animate-pulse rounded-full bg-linear-to-br ${illustration.gradient} opacity-60`}
                                                    />
                                                    <div
                                                        className={`absolute bottom-0 left-5 h-1.5 w-1.5 animate-pulse rounded-full bg-linear-to-br ${illustration.gradient} opacity-60 delay-150`}
                                                        style={{
                                                            animationDelay:
                                                                '0.3s',
                                                        }}
                                                    />
                                                </div>

                                                <h3 className="mb-3 text-2xl font-bold text-slate-900 dark:text-slate-100">
                                                    {subject.name}
                                                </h3>
                                            </div>
                                        </Card>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
