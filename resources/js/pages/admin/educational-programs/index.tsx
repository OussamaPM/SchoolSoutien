import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import programs, { levels } from '@/routes/admin/educational-programs';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';

export interface Category {
    id: number;
    name: string;
    description?: string;
    education_levels_count: number;
    created_at: string;
    updated_at: string;
}

interface Props {
    categories: Category[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Programmes',
        href: programs.levelCategories.url(),
    },
];

export default function Index({ categories = [] }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Programmes éducatifs" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Programmes éducatifs
                        </h1>
                        <p className="text-muted-foreground">
                            Gérez les catégories de niveaux d'éducation et les
                            niveaux associés
                        </p>
                    </div>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableCaption>
                            Liste des catégories de programmes éducatifs
                        </TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nom</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Niveaux</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categories.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={3}
                                        className="py-8 text-center"
                                    >
                                        <div className="flex flex-col items-center gap-2">
                                            <p className="text-muted-foreground">
                                                Aucune catégorie trouvée
                                            </p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                categories.map((cat) => (
                                    <TableRow
                                        key={cat.id}
                                        className="cursor-pointer hover:bg-muted/50"
                                        role="button"
                                        tabIndex={0}
                                        onClick={() =>
                                            router.visit(levels.url(cat.id))
                                        }
                                    >
                                        <TableCell className="flex items-center gap-2 font-medium">
                                            <span className="truncate">
                                                {cat.name}
                                            </span>
                                            <Link
                                                href={levels.url(cat.id)}
                                                className="text-muted-foreground hover:text-foreground"
                                            >
                                                <ChevronRight className="h-4 w-4" />
                                            </Link>
                                        </TableCell>
                                        <TableCell className="max-w-xs truncate">
                                            {cat.description || '—'}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="secondary"
                                                className="text-xs"
                                            >
                                                {cat.education_levels_count}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AppLayout>
    );
}
