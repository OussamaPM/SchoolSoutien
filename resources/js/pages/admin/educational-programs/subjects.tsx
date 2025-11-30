import EducationalProgramController from '@/actions/App/Http/Controllers/EducationalProgramController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import programs, { chapters } from '@/routes/admin/educational-programs';
import { type BreadcrumbItem } from '@/types';
import { Transition } from '@headlessui/react';
import { Form, Head, router } from '@inertiajs/react';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Category } from '.';
import { Chapter } from './chapters';
import { EducationLevel } from './levels';

export interface Subject {
    id: number;
    name: string;
    is_active: boolean;
    chapters?: Chapter[];
    created_at: string;
    updated_at: string;
}
interface Props {
    subjects: Subject[];
    level: EducationLevel;
    category: Category;
}

const breadcrumbs = (
    levelId?: number,
    levelName?: string,
    categoryId?: number,
    categoryName?: string,
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
];

export default function Index({ subjects = [], level, category }: Props) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
    const [deletingSubject, setDeletingSubject] = useState<Subject | null>(
        null,
    );

    const openCreate = () => setIsCreateOpen(true);
    const openEdit = (subject: Subject) => {
        setEditingSubject(subject);
        setIsEditOpen(true);
    };
    const openDelete = (subject: Subject) => {
        setDeletingSubject(subject);
        setIsDeleteOpen(true);
    };

    return (
        <AppLayout
            breadcrumbs={breadcrumbs(
                level?.id,
                level?.name,
                category?.id,
                category?.name,
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
                    <div className="flex items-center gap-2">
                        <Button onClick={openCreate}>
                            <Plus className="mr-2 h-4 w-4" />
                            Nouvelle matière
                        </Button>
                    </div>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableCaption>
                            Liste des matières pour cette catégorie
                        </TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nom</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {subjects.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={3}
                                        className="py-8 text-center"
                                    >
                                        <div className="flex flex-col items-center gap-2">
                                            <p className="text-muted-foreground">
                                                Aucun sujet trouvé pour ce
                                                niveau
                                            </p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                subjects.map((subject) => (
                                    <TableRow
                                        key={subject.id}
                                        className="cursor-pointer hover:bg-muted/50"
                                        role="button"
                                        tabIndex={0}
                                        onClick={() =>
                                            router.visit(
                                                chapters.url([
                                                    category.id,
                                                    level.id,
                                                    subject.id,
                                                ]),
                                            )
                                        }
                                    >
                                        <TableCell className="flex items-center gap-2 font-medium">
                                            {subject.name}
                                        </TableCell>
                                        <TableCell className="max-w-xs truncate">
                                            {subject.is_active
                                                ? 'Actif'
                                                : 'Inactif'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openEdit(subject);
                                                    }}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-destructive"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openDelete(subject);
                                                    }}
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

            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="sm:max-w-[450px]">
                    <DialogHeader>
                        <DialogTitle>Créer une matière</DialogTitle>
                    </DialogHeader>

                    <Form
                        disableWhileProcessing
                        onSuccess={() => {
                            toast('Nouvelle matière créée');
                            setIsCreateOpen(false);
                        }}
                        {...EducationalProgramController.storeSubject.form([
                            category.id,
                            level.id,
                        ])}
                        options={{
                            preserveScroll: true,
                        }}
                        className="space-y-6"
                    >
                        {({ processing, recentlySuccessful, errors }) => (
                            <>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label
                                            htmlFor="name"
                                            className="text-right"
                                        >
                                            Nom
                                        </Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            className="col-span-3"
                                        />
                                        <InputError
                                            message={errors.name}
                                            className="col-span-3"
                                        />
                                    </div>
                                </div>

                                <DialogFooter>
                                    <div className="flex items-center gap-4">
                                        <Button
                                            disabled={processing}
                                            data-test="update-profile-button"
                                        >
                                            Créer
                                        </Button>

                                        <Transition
                                            show={recentlySuccessful}
                                            enter="transition ease-in-out"
                                            enterFrom="opacity-0"
                                            leave="transition ease-in-out"
                                            leaveTo="opacity-0"
                                        >
                                            <p className="text-sm text-neutral-600">
                                                Enregistré
                                            </p>
                                        </Transition>
                                    </div>
                                </DialogFooter>
                            </>
                        )}
                    </Form>
                </DialogContent>
            </Dialog>

            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[450px]">
                    <DialogHeader>
                        <DialogTitle>Modifier la matière</DialogTitle>
                    </DialogHeader>

                    {editingSubject && (
                        <Form
                            disableWhileProcessing
                            {...EducationalProgramController.updateSubject.form(
                                [category.id, editingSubject.id, level.id],
                            )}
                            options={{ preserveScroll: true }}
                            className="space-y-6"
                            onSuccess={() => {
                                toast('Matière modifiée');
                                setIsEditOpen(false);
                            }}
                        >
                            {({ processing, recentlySuccessful, errors }) => (
                                <>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label
                                                htmlFor="name-edit"
                                                className="text-right"
                                            >
                                                Nom
                                            </Label>
                                            <Input
                                                id="name-edit"
                                                name="name"
                                                defaultValue={
                                                    editingSubject.name
                                                }
                                                className="col-span-3"
                                            />
                                            <InputError
                                                message={errors.name}
                                                className="col-span-3"
                                            />
                                        </div>
                                    </div>

                                    <DialogFooter>
                                        <div className="flex items-center gap-4">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() =>
                                                    setIsEditOpen(false)
                                                }
                                            >
                                                Annuler
                                            </Button>
                                            <Button disabled={processing}>
                                                Enregistrer
                                            </Button>
                                        </div>
                                    </DialogFooter>
                                </>
                            )}
                        </Form>
                    )}
                </DialogContent>
            </Dialog>

            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="sm:max-w-[420px]">
                    <DialogHeader>
                        <DialogTitle>Supprimer la matière</DialogTitle>
                    </DialogHeader>

                    {deletingSubject && (
                        <Form
                            disableWhileProcessing
                            {...EducationalProgramController.deleteSubject.form(
                                [category.id, level.id, deletingSubject.id],
                            )}
                            options={{
                                preserveScroll: true,
                            }}
                            className="space-y-6"
                            onSuccess={() => {
                                toast('Matière supprimée');
                                setIsDeleteOpen(false);
                            }}
                        >
                            {({ processing }) => (
                                <>
                                    <div className="py-4">
                                        <p>
                                            Voulez-vous vraiment supprimer la
                                            matière{' '}
                                            <strong>
                                                {deletingSubject.name}
                                            </strong>{' '}
                                            ? Cette action est irréversible.
                                        </p>
                                    </div>
                                    <DialogFooter>
                                        <div className="flex items-center gap-4">
                                            <Button
                                                type="button"
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
