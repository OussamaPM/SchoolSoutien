import EducationalProgramController from '@/actions/App/Http/Controllers/EducationalProgramController';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
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
import programs, { chapterWriter } from '@/routes/admin/educational-programs';
import { User, type BreadcrumbItem } from '@/types';
import { Form, Head, Link, router } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Category } from '.';
import { EducationLevel } from './levels';
import { Subject } from './subjects';

export interface Chapter {
    id: number;
    title: string;
    content: string;
    creator: User | null;
    last_updater: User | null;
    is_active: boolean;
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
];

export default function Index({
    chapters = [],
    level,
    category,
    subject,
}: Props) {
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deletingChapter, setDeletingChapter] = useState<Chapter | null>(
        null,
    );
    const openDelete = (chapter: Chapter) => {
        setDeletingChapter(chapter);
        setIsDeleteOpen(true);
    };

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
            <Head title={`Cours — ${subject?.name || ''}`} />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Cours
                        </h1>
                        <p className="text-muted-foreground">
                            Matiére: {subject?.name || subject?.id}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            as={Button}
                            href={programs.chapterWriter.url([
                                category?.id,
                                level?.id,
                                subject?.id,
                            ])}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Chapitre
                        </Link>
                    </div>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableCaption>
                            Liste des chapitres pour cette catégorie
                        </TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nom</TableHead>
                                <TableHead>Crée Par</TableHead>
                                <TableHead>Dernière Mise à Jour Par</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {chapters.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={3}
                                        className="py-8 text-center"
                                    >
                                        <div className="flex flex-col items-center gap-2">
                                            <p className="text-muted-foreground">
                                                Aucun chapitre trouvé pour cette
                                                matiére
                                            </p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                chapters.map((chapter) => (
                                    <TableRow
                                        key={chapter.id}
                                        className="cursor-pointer hover:bg-muted/50"
                                        role="button"
                                        tabIndex={0}
                                        onClick={() =>
                                            router.visit(
                                                chapterWriter.url([
                                                    category.id,
                                                    level.id,
                                                    subject.id,
                                                    chapter.id,
                                                ]),
                                            )
                                        }
                                    >
                                        <TableCell className="flex items-center gap-2 font-medium">
                                            {chapter.title}
                                        </TableCell>
                                        <TableCell className="max-w-xs truncate">
                                            {chapter.creator?.name}
                                            <p className="text-xs text-gray-400">
                                                {chapter.creator?.email}
                                            </p>
                                        </TableCell>
                                        <TableCell className="max-w-xs truncate">
                                            {chapter.last_updater?.name ?? '-'}
                                            <p className="text-xs text-gray-400">
                                                {chapter.last_updater?.email ??
                                                    '-'}
                                            </p>
                                        </TableCell>
                                        <TableCell className="max-w-xs truncate">
                                            {chapter.is_active
                                                ? 'Actif'
                                                : 'Inactif'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-destructive"
                                                    onClick={() =>
                                                        openDelete(chapter)
                                                    }
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="sm:max-w-[420px]">
                    <DialogHeader>
                        <DialogTitle>Supprimer le chapitre</DialogTitle>
                    </DialogHeader>

                    {deletingChapter && (
                        <Form
                            disableWhileProcessing
                            {...EducationalProgramController.deleteChapter.form(
                                [
                                    category.id,
                                    level.id,
                                    subject.id,
                                    deletingChapter.id,
                                ],
                            )}
                            options={{
                                preserveScroll: true,
                            }}
                            className="space-y-6"
                            onSuccess={() => {
                                toast('Chapitre supprimé');
                                setIsDeleteOpen(false);
                            }}
                        >
                            {({ processing }) => (
                                <>
                                    <div className="py-4">
                                        <p>
                                            Voulez-vous vraiment supprimer le
                                            chapitre{' '}
                                            <strong>
                                                {deletingChapter.name}
                                            </strong>{' '}
                                            ? Cette action est irréversible.
                                        </p>
                                    </div>
                                    <DialogFooter>
                                        <div className="flex items-center gap-4">
                                            <Button
                                                variant="outline"
                                                onClick={() =>
                                                    setIsDeleteOpen(false)
                                                }
                                            >
                                                Annuler
                                            </Button>
                                            <Button
                                                variant={'destructive'}
                                                disabled={processing}
                                            >
                                                Supprimer
                                            </Button>
                                        </div>
                                    </DialogFooter>
                                </>
                            )}
                        </Form>
                    )}
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
