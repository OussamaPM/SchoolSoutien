import AppLayout from '@/layouts/app-layout';
import programs from '@/routes/admin/educational-programs';
import { User, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Category } from '.';
import { EducationLevel } from './levels';
import { Subject } from './subjects';

export interface Chapter {
    id: number;
    title: string;
    content: string;
    creator: User | null;
    created_at: string;
    updated_at: string;
}

interface Props {
    chapters: Chapter[];
    subject: Subject;
    level: EducationLevel;
    category: Category;
}

const breadcrumbs = (
    levelId?: number,
    levelName?: string,
    categoryId?: number,
    categoryName?: string,
    subjectId?: number,
    subjectName?: string,
): BreadcrumbItem[] => [
    { title: 'Programmes', href: programs.levelCategories.url() },
    {
        title: categoryName || 'Niveaux',
        href: programs.levels.url(categoryId),
    },
    {
        title: levelName || 'Matières',
        href: programs.subjects.url([levelId, categoryId]),
    },
    {
        title: subjectName || 'Chapitres',
        href: programs.chapters.url([levelId, categoryId, subjectId]),
    },
    {
        title: 'Créer',
        href: '#',
    },
];

export default function Index({
    chapters = [],
    level,
    category,
    subject,
}: Props) {
    return (
        <AppLayout
            breadcrumbs={breadcrumbs(
                level?.id,
                level?.name,
                category?.id,
                category?.name,
                subject?.id,
                subject?.name,
            )}
        >
            <Head title={`Matières — ${level?.name || ''}`} />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Matières
                        </h1>
                        <p className="text-muted-foreground">
                            Niveau: {level?.name || level?.id}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">hello</div>
                </div>

                <div className="rounded-md border">hello</div>
            </div>
        </AppLayout>
    );
}
