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
import programs from '@/routes/admin/educational-programs';
import { type BreadcrumbItem } from '@/types';
import { Transition } from '@headlessui/react';
import { Form, Head } from '@inertiajs/react';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export interface EducationLevel {
    id: number;
    name: string;
    slug?: string;
    description?: string;
    category_id?: number;
}

interface Props {
    levels: EducationLevel[];
    category: { id: number; name?: string };
}

const breadcrumbs = (
    categoryId?: number,
    categoryName?: string,
): BreadcrumbItem[] => [
    { title: 'Programmes', href: programs.levelCategories.url() },
    {
        title: categoryName || 'Niveaux',
        href: programs.levels.url(categoryId || 0),
    },
];

export default function Index({ levels = [], category }: Props) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [editingLevel, setEditingLevel] = useState<EducationLevel | null>(
        null,
    );
    const [deletingLevel, setDeletingLevel] = useState<EducationLevel | null>(
        null,
    );

    const openCreate = () => setIsCreateOpen(true);
    const openEdit = (level: EducationLevel) => {
        setEditingLevel(level);
        setIsEditOpen(true);
    };
    const openDelete = (level: EducationLevel) => {
        setDeletingLevel(level);
        setIsDeleteOpen(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs(category?.id, category?.name)}>
            <Head title={`Niveaux — ${category?.name || ''}`} />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Niveaux éducatifs
                        </h1>
                        <p className="text-muted-foreground">
                            Catégorie: {category?.name || category?.id}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button onClick={openCreate}>
                            <Plus className="mr-2 h-4 w-4" />
                            Nouveau niveau
                        </Button>
                    </div>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableCaption>
                            Liste des niveaux pour cette catégorie
                        </TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nom</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {levels.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={3}
                                        className="py-8 text-center"
                                    >
                                        <div className="flex flex-col items-center gap-2">
                                            <p className="text-muted-foreground">
                                                Aucun niveau trouvé pour cette
                                                catégorie
                                            </p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                levels.map((level) => (
                                    <TableRow key={level.id}>
                                        <TableCell className="font-medium">
                                            {level.name}
                                        </TableCell>
                                        <TableCell className="max-w-xs truncate">
                                            {level.description || '—'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() =>
                                                        openEdit(level)
                                                    }
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-destructive"
                                                    onClick={() =>
                                                        openDelete(level)
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

            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="sm:max-w-[450px]">
                    <DialogHeader>
                        <DialogTitle>Créer un niveau</DialogTitle>
                    </DialogHeader>

                    <Form
                        disableWhileProcessing
                        onSuccess={() => {
                            toast('Nouveau niveau créé');
                            setIsCreateOpen(false);
                        }}
                        {...EducationalProgramController.storeLevel.form(
                            category.id,
                        )}
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
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label
                                            htmlFor="desc"
                                            className="text-right"
                                        >
                                            Description
                                        </Label>
                                        <Input
                                            id="desc"
                                            name="description"
                                            className="col-span-3"
                                        />
                                        <InputError
                                            message={errors.description}
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

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[450px]">
                    <DialogHeader>
                        <DialogTitle>Modifier le niveau</DialogTitle>
                    </DialogHeader>

                    {editingLevel && (
                        <Form
                            disableWhileProcessing
                            {...EducationalProgramController.updateLevel.form([
                                category.id,
                                editingLevel.id,
                            ])}
                            options={{ preserveScroll: true }}
                            className="space-y-6"
                            onSuccess={() => {
                                toast('Niveau modifié');
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
                                                defaultValue={editingLevel.name}
                                                className="col-span-3"
                                            />
                                            <InputError
                                                message={errors.name}
                                                className="col-span-3"
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label
                                                htmlFor="desc-edit"
                                                className="text-right"
                                            >
                                                Description
                                            </Label>
                                            <Input
                                                id="desc-edit"
                                                name="description"
                                                defaultValue={
                                                    editingLevel.description ||
                                                    ''
                                                }
                                                className="col-span-3"
                                            />
                                            <InputError
                                                message={errors.description}
                                                className="col-span-3"
                                            />
                                        </div>
                                    </div>

                                    <DialogFooter>
                                        <div className="flex items-center gap-4">
                                            <Button
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

            {/* Delete Dialog */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="sm:max-w-[420px]">
                    <DialogHeader>
                        <DialogTitle>Supprimer le niveau</DialogTitle>
                    </DialogHeader>

                    {deletingLevel && (
                        <Form
                            disableWhileProcessing
                            {...EducationalProgramController.deleteLevel.form([
                                category.id,
                                deletingLevel.id,
                            ])}
                            options={{
                                preserveScroll: true,
                            }}
                            className="space-y-6"
                            onSuccess={() => {
                                toast('Niveau supprimé');
                                setIsDeleteOpen(false);
                            }}
                        >
                            {({ processing }) => (
                                <>
                                    <div className="py-4">
                                        <p>
                                            Voulez-vous vraiment supprimer le
                                            niveau{' '}
                                            <strong>
                                                {deletingLevel.name}
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
