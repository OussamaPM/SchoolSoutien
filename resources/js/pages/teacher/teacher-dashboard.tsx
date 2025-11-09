import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import programs from '@/routes/admin/educational-programs';
import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, CheckCircle2, Clock, FileText, Plus } from 'lucide-react';

interface Subject {
    id: number;
    name: string;
    is_active: boolean;
    education_level: {
        id: number;
        name: string;
        category: {
            id: number;
            name: string;
        };
    };
    chapters_count: number;
    published_chapters_count: number;
    draft_chapters_count: number;
}

interface Props {
    data?: {
        subjects: Subject[];
    };
}

export default function TeacherDashboard({ data }: Props) {
    const user = usePage<SharedData>().props.auth.user;
    const subjects = data?.subjects || [];

    return (
        <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">
                    Bienvenue,{' '}
                    <span className="text-primary">{user?.name}</span>
                </h1>
                <p className="text-muted-foreground">
                    Gérez vos matières et créez du contenu pédagogique pour vos
                    élèves
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Matières assignées
                        </CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {subjects.length}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Matières actives
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Chapitres publiés
                        </CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {subjects.reduce(
                                (sum, s) => sum + s.published_chapters_count,
                                0,
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Disponibles pour les élèves
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Brouillons
                        </CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {subjects.reduce(
                                (sum, s) => sum + s.draft_chapters_count,
                                0,
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            En cours de rédaction
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight">
                        Mes Matières
                    </h2>
                </div>

                {subjects.length === 0 ? (
                    <Card className="border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <BookOpen className="mb-4 h-12 w-12 text-muted-foreground" />
                            <h3 className="mb-2 text-lg font-semibold">
                                Aucune matière assignée
                            </h3>
                            <p className="text-center text-sm text-muted-foreground">
                                Contactez un administrateur pour vous assigner
                                des matières
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {subjects.map((subject) => (
                            <Card
                                key={subject.id}
                                className="flex flex-col transition-all hover:shadow-lg"
                            >
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1">
                                            <CardTitle className="text-xl">
                                                {subject.name}
                                            </CardTitle>
                                            <CardDescription>
                                                {subject.education_level.name} •{' '}
                                                {
                                                    subject.education_level
                                                        .category.name
                                                }
                                            </CardDescription>
                                        </div>
                                        <Badge
                                            variant={
                                                subject.is_active
                                                    ? 'default'
                                                    : 'secondary'
                                            }
                                        >
                                            {subject.is_active
                                                ? 'Actif'
                                                : 'Inactif'}
                                        </Badge>
                                    </div>
                                </CardHeader>

                                <CardContent className="flex-1">
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-3">
                                            <div className="flex items-center gap-2">
                                                <FileText className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm font-medium">
                                                    Total
                                                </span>
                                            </div>
                                            <span className="text-lg font-bold">
                                                {subject.chapters_count}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="flex flex-col rounded-lg border bg-green-50 p-3 dark:bg-green-950/20">
                                                <div className="flex items-center gap-1.5 text-green-700 dark:text-green-400">
                                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                                    <span className="text-xs font-medium">
                                                        Publiés
                                                    </span>
                                                </div>
                                                <span className="mt-1 text-xl font-bold text-green-700 dark:text-green-400">
                                                    {
                                                        subject.published_chapters_count
                                                    }
                                                </span>
                                            </div>

                                            <div className="flex flex-col rounded-lg border bg-orange-50 p-3 dark:bg-orange-950/20">
                                                <div className="flex items-center gap-1.5 text-orange-700 dark:text-orange-400">
                                                    <Clock className="h-3.5 w-3.5" />
                                                    <span className="text-xs font-medium">
                                                        Brouillons
                                                    </span>
                                                </div>
                                                <span className="mt-1 text-xl font-bold text-orange-700 dark:text-orange-400">
                                                    {
                                                        subject.draft_chapters_count
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>

                                <CardFooter className="flex gap-2">
                                    <Button
                                        asChild
                                        className="flex-1"
                                        variant="default"
                                    >
                                        <Link
                                            href={programs.chapters.url([
                                                subject.education_level.id,
                                                subject.education_level.category
                                                    .id,
                                                subject.id,
                                            ])}
                                        >
                                            <BookOpen className="mr-2 h-4 w-4" />
                                            Voir les chapitres
                                        </Link>
                                    </Button>
                                    <Button
                                        asChild
                                        variant="outline"
                                        size="icon"
                                        title="Créer un nouveau chapitre"
                                    >
                                        <Link
                                            href={programs.chapterWriter.url({
                                                category:
                                                    subject.education_level
                                                        .category.id,
                                                level: subject.education_level
                                                    .id,
                                                subject: subject.id,
                                            })}
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
