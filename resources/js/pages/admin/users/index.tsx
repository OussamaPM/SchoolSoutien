import UserController from '@/actions/App/Http/Controllers/UserController';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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
import users from '@/routes/admin/users';
import { User, type BreadcrumbItem } from '@/types';
import { Form, Head } from '@inertiajs/react';
import { Edit, GraduationCap, Loader2, Plus, Trash2, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Category } from '../educational-programs';

interface Props {
    users: User[];
    roles: string[];
    educationCategories: Category[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Utilisateurs',
        href: users.index().url,
    },
];

export default function Index({
    users: userList,
    roles,
    educationCategories,
}: Props) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    // State for teacher education selection
    const [selectedRole, setSelectedRole] = useState<string>('parent');
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
        null,
    );
    const [selectedLevelId, setSelectedLevelId] = useState<number | null>(null);
    const [selectedSubjectIds, setSelectedSubjectIds] = useState<number[]>([]);

    // State for edit form teacher education
    const [editSelectedRole, setEditSelectedRole] = useState<string>('parent');
    const [editSelectedCategoryId, setEditSelectedCategoryId] = useState<
        number | null
    >(null);
    const [editSelectedLevelId, setEditSelectedLevelId] = useState<
        number | null
    >(null);
    const [editSelectedSubjectIds, setEditSelectedSubjectIds] = useState<
        number[]
    >([]);

    // Computed values for create form
    const availableLevels = useMemo(() => {
        if (!selectedCategoryId) return [];
        const category = educationCategories.find(
            (c) => c.id === selectedCategoryId,
        );
        return category?.education_levels || [];
    }, [selectedCategoryId, educationCategories]);

    const availableSubjects = useMemo(() => {
        if (!selectedLevelId) return [];
        const level = availableLevels.find((l) => l.id === selectedLevelId);
        return level?.education_subjects || [];
    }, [selectedLevelId, availableLevels]);

    // Computed values for edit form
    const editAvailableLevels = useMemo(() => {
        if (!editSelectedCategoryId) return [];
        const category = educationCategories.find(
            (c) => c.id === editSelectedCategoryId,
        );
        return category?.education_levels || [];
    }, [editSelectedCategoryId, educationCategories]);

    const editAvailableSubjects = useMemo(() => {
        if (!editSelectedLevelId) return [];
        const level = editAvailableLevels.find(
            (l) => l.id === editSelectedLevelId,
        );
        return level?.education_subjects || [];
    }, [editSelectedLevelId, editAvailableLevels]);

    // Get selected subjects details for display
    const getSelectedSubjectNames = (subjectIds: number[]) => {
        const allSubjects = educationCategories.flatMap((cat) =>
            (cat.education_levels || []).flatMap(
                (lvl) => lvl.education_subjects || [],
            ),
        );
        return subjectIds
            .map((id) => allSubjects.find((s) => s && s.id === id)?.name)
            .filter(Boolean);
    };

    const handleEditClick = (user: User) => {
        setSelectedUser(user);
        setEditSelectedRole(user.role);

        if (
            user.role === 'teacher' &&
            user.teacher_subjects &&
            user.teacher_subjects.length > 0
        ) {
            const firstSubject = user.teacher_subjects[0];
            const categoryId = firstSubject.education_level?.category?.id;
            const levelId = firstSubject.education_level?.id;

            if (categoryId) setEditSelectedCategoryId(categoryId);
            if (levelId) setEditSelectedLevelId(levelId);
            setEditSelectedSubjectIds(user.teacher_subjects.map((s) => s.id));
        } else {
            setEditSelectedCategoryId(null);
            setEditSelectedLevelId(null);
            setEditSelectedSubjectIds([]);
        }

        setIsEditOpen(true);
    };

    const handleDeleteClick = (user: User) => {
        setSelectedUser(user);
        setIsDeleteOpen(true);
    };

    const handleRoleChange = (role: string) => {
        setSelectedRole(role);
        if (role !== 'teacher') {
            setSelectedCategoryId(null);
            setSelectedLevelId(null);
            setSelectedSubjectIds([]);
        }
    };

    const handleCategoryChange = (categoryId: string) => {
        const id = parseInt(categoryId);
        setSelectedCategoryId(id);
        setSelectedLevelId(null);
        setSelectedSubjectIds([]);
    };

    const handleLevelChange = (levelId: string) => {
        const id = parseInt(levelId);
        setSelectedLevelId(id);
        setSelectedSubjectIds([]);
    };

    const handleSubjectToggle = (subjectId: number) => {
        setSelectedSubjectIds((prev) =>
            prev.includes(subjectId)
                ? prev.filter((id) => id !== subjectId)
                : [...prev, subjectId],
        );
    };

    const handleRemoveSubject = (subjectId: number) => {
        setSelectedSubjectIds((prev) => prev.filter((id) => id !== subjectId));
    };

    const handleEditCategoryChange = (categoryId: string) => {
        const id = parseInt(categoryId);
        setEditSelectedCategoryId(id);
        setEditSelectedLevelId(null);
        setEditSelectedSubjectIds([]);
    };

    const handleEditLevelChange = (levelId: string) => {
        const id = parseInt(levelId);
        setEditSelectedLevelId(id);
        setEditSelectedSubjectIds([]);
    };

    const handleEditSubjectToggle = (subjectId: number) => {
        setEditSelectedSubjectIds((prev) =>
            prev.includes(subjectId)
                ? prev.filter((id) => id !== subjectId)
                : [...prev, subjectId],
        );
    };

    const handleEditRemoveSubject = (subjectId: number) => {
        setEditSelectedSubjectIds((prev) =>
            prev.filter((id) => id !== subjectId),
        );
    };

    const handleEditRoleChange = (role: string) => {
        setEditSelectedRole(role);
        // Reset teacher education selections when role changes
        if (role !== 'teacher') {
            setEditSelectedCategoryId(null);
            setEditSelectedLevelId(null);
            setEditSelectedSubjectIds([]);
        }
    };

    const handleCreateSuccess = () => {
        setIsCreateOpen(false);
        setSelectedRole('parent');
        setSelectedCategoryId(null);
        setSelectedLevelId(null);
        setSelectedSubjectIds([]);
        toast.success('Utilisateur créé avec succès');
    };

    const handleUpdateSuccess = () => {
        setIsEditOpen(false);
        setEditSelectedRole('parent');
        setEditSelectedCategoryId(null);
        setEditSelectedLevelId(null);
        setEditSelectedSubjectIds([]);
        toast.success('Utilisateur mis à jour avec succès');
    };

    const handleDeleteSuccess = () => {
        setIsDeleteOpen(false);
        toast.success('Utilisateur supprimé avec succès');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestion des Utilisateurs" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Utilisateurs
                        </h1>
                        <p className="text-muted-foreground">
                            Gérez les utilisateurs de votre plateforme
                            e-éducation
                        </p>
                    </div>

                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Nouvel Utilisateur
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>
                                    Créer un nouvel utilisateur
                                </DialogTitle>
                                <DialogDescription>
                                    Remplissez les informations ci-dessous pour
                                    créer un nouvel utilisateur
                                </DialogDescription>
                            </DialogHeader>

                            <Form
                                {...UserController.store.form()}
                                transform={(data) => ({
                                    ...data,
                                    is_active: data.is_active ? 1 : 0,
                                    teacher_subject_ids:
                                        selectedRole === 'teacher'
                                            ? selectedSubjectIds
                                            : undefined,
                                })}
                                onSuccess={handleCreateSuccess}
                                onError={(err) => {
                                    toast.error(
                                        err.message || 'Une Erreur est survenu',
                                    );
                                }}
                            >
                                {({ processing, errors }) => (
                                    <>
                                        <div className="grid gap-4 py-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="create-name">
                                                    Nom complet
                                                </Label>
                                                <Input
                                                    id="create-name"
                                                    name="name"
                                                    placeholder="Jean Dupont"
                                                    required
                                                />
                                                <InputError
                                                    message={errors.name}
                                                />
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="create-email">
                                                    Email
                                                </Label>
                                                <Input
                                                    id="create-email"
                                                    name="email"
                                                    type="email"
                                                    placeholder="jean.dupont@example.com"
                                                    required
                                                />
                                                <InputError
                                                    message={errors.email}
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="create-city">
                                                        Ville
                                                    </Label>
                                                    <Input
                                                        id="create-city"
                                                        name="city"
                                                        placeholder="Paris"
                                                    />
                                                    <InputError
                                                        message={errors.city}
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label htmlFor="create-phone">
                                                        Téléphone
                                                    </Label>
                                                    <Input
                                                        id="create-phone"
                                                        name="phone"
                                                        placeholder="+33 6 12 34 56 78"
                                                    />
                                                    <InputError
                                                        message={errors.phone}
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="create-role">
                                                    Rôle
                                                </Label>
                                                <Select
                                                    name="role"
                                                    defaultValue="parent"
                                                    required
                                                    onValueChange={
                                                        handleRoleChange
                                                    }
                                                >
                                                    <SelectTrigger id="create-role">
                                                        <SelectValue placeholder="Sélectionner un rôle" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {roles.map((role) => (
                                                            <SelectItem
                                                                key={role}
                                                                value={role}
                                                            >
                                                                {role}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <InputError
                                                    message={errors.role}
                                                />
                                            </div>

                                            {/* Teacher Education Assignment Section */}
                                            {selectedRole === 'teacher' && (
                                                <div className="space-y-4 rounded-lg border border-purple-200 bg-purple-50 p-4 dark:border-purple-200/10 dark:bg-purple-700/10">
                                                    <div className="flex items-center gap-2">
                                                        <GraduationCap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                                        <h3 className="font-semibold text-purple-900 dark:text-purple-100">
                                                            Matières enseignées
                                                        </h3>
                                                    </div>

                                                    <div className="grid gap-3">
                                                        {/* Category Selection */}
                                                        <div className="grid gap-2">
                                                            <Label
                                                                htmlFor="create-category"
                                                                className="text-sm font-medium"
                                                            >
                                                                1. Catégorie
                                                            </Label>
                                                            <Select
                                                                value={selectedCategoryId?.toString()}
                                                                onValueChange={
                                                                    handleCategoryChange
                                                                }
                                                            >
                                                                <SelectTrigger id="create-category">
                                                                    <SelectValue placeholder="Sélectionner une catégorie" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {educationCategories.map(
                                                                        (
                                                                            category,
                                                                        ) => (
                                                                            <SelectItem
                                                                                key={
                                                                                    category.id
                                                                                }
                                                                                value={category.id.toString()}
                                                                            >
                                                                                {
                                                                                    category.name
                                                                                }
                                                                            </SelectItem>
                                                                        ),
                                                                    )}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>

                                                        {/* Level Selection */}
                                                        {selectedCategoryId && (
                                                            <div className="grid gap-2">
                                                                <Label
                                                                    htmlFor="create-level"
                                                                    className="text-sm font-medium"
                                                                >
                                                                    2. Niveau
                                                                </Label>
                                                                <Select
                                                                    value={selectedLevelId?.toString()}
                                                                    onValueChange={
                                                                        handleLevelChange
                                                                    }
                                                                    disabled={
                                                                        !availableLevels.length
                                                                    }
                                                                >
                                                                    <SelectTrigger id="create-level">
                                                                        <SelectValue placeholder="Sélectionner un niveau" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {availableLevels.map(
                                                                            (
                                                                                level,
                                                                            ) => (
                                                                                <SelectItem
                                                                                    key={
                                                                                        level.id
                                                                                    }
                                                                                    value={level.id.toString()}
                                                                                >
                                                                                    {
                                                                                        level.name
                                                                                    }
                                                                                </SelectItem>
                                                                            ),
                                                                        )}
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                        )}

                                                        {/* Subject Selection */}
                                                        {selectedLevelId &&
                                                            availableSubjects.length >
                                                                0 && (
                                                                <div className="grid gap-2">
                                                                    <Label className="text-sm font-medium">
                                                                        3.
                                                                        Matières
                                                                    </Label>
                                                                    <div className="rounded-md border bg-white p-3 dark:bg-gray-950">
                                                                        <div className="space-y-2">
                                                                            {availableSubjects.map(
                                                                                (
                                                                                    subject,
                                                                                ) => (
                                                                                    <div
                                                                                        key={
                                                                                            subject.id
                                                                                        }
                                                                                        className="flex items-center space-x-2"
                                                                                    >
                                                                                        <Checkbox
                                                                                            id={`subject-${subject.id}`}
                                                                                            checked={selectedSubjectIds.includes(
                                                                                                subject.id,
                                                                                            )}
                                                                                            onCheckedChange={() =>
                                                                                                handleSubjectToggle(
                                                                                                    subject.id,
                                                                                                )
                                                                                            }
                                                                                        />
                                                                                        <Label
                                                                                            htmlFor={`subject-${subject.id}`}
                                                                                            className="cursor-pointer text-sm font-normal"
                                                                                        >
                                                                                            {
                                                                                                subject.name
                                                                                            }
                                                                                        </Label>
                                                                                    </div>
                                                                                ),
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}

                                                        {/* Selected Subjects Display */}
                                                        {selectedSubjectIds.length >
                                                            0 && (
                                                            <div className="grid gap-2">
                                                                <Label className="text-sm font-medium">
                                                                    Matières
                                                                    sélectionnées
                                                                </Label>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {getSelectedSubjectNames(
                                                                        selectedSubjectIds,
                                                                    ).map(
                                                                        (
                                                                            name,
                                                                            idx,
                                                                        ) => (
                                                                            <Badge
                                                                                key={
                                                                                    idx
                                                                                }
                                                                                variant="secondary"
                                                                                className="gap-1"
                                                                            >
                                                                                {
                                                                                    name
                                                                                }
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() =>
                                                                                        handleRemoveSubject(
                                                                                            selectedSubjectIds[
                                                                                                idx
                                                                                            ],
                                                                                        )
                                                                                    }
                                                                                    className="ml-1 rounded-full hover:bg-muted"
                                                                                >
                                                                                    <X className="h-3 w-3" />
                                                                                </button>
                                                                            </Badge>
                                                                        ),
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <InputError
                                                        message={
                                                            errors.teacher_subject_ids
                                                        }
                                                    />
                                                </div>
                                            )}

                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="create-is-active"
                                                    name="is_active"
                                                    defaultChecked
                                                />
                                                <Label
                                                    htmlFor="create-is-active"
                                                    className="text-sm font-normal"
                                                >
                                                    Compte actif
                                                </Label>
                                            </div>

                                            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-200/10 dark:bg-blue-700/10">
                                                <p className="text-sm text-blue-800 dark:text-blue-100">
                                                    <span className="font-medium">
                                                        Note :{' '}
                                                    </span>
                                                    Le mot de passe par défaut
                                                    sera{' '}
                                                    <code className="rounded bg-blue-100 px-1.5 py-0.5 font-mono text-xs dark:bg-blue-900/50">
                                                        password
                                                    </code>
                                                    . L'utilisateur pourra le
                                                    changer après sa première
                                                    connexion.
                                                </p>
                                            </div>
                                        </div>

                                        <DialogFooter>
                                            <DialogClose asChild>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    disabled={processing}
                                                >
                                                    Annuler
                                                </Button>
                                            </DialogClose>
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                            >
                                                {processing && (
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                )}
                                                Créer l'utilisateur
                                            </Button>
                                        </DialogFooter>
                                    </>
                                )}
                            </Form>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableCaption>
                            Liste des utilisateurs disponibles sur la plateforme
                        </TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nom</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Rôle</TableHead>
                                <TableHead>Matières</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead>Date de création</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {userList.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={8}
                                        className="py-8 text-center"
                                    >
                                        <div className="flex flex-col items-center gap-2">
                                            <p className="text-muted-foreground">
                                                Aucun utilisateur trouvé
                                            </p>
                                            <Button
                                                variant="outline"
                                                onClick={() =>
                                                    setIsCreateOpen(true)
                                                }
                                            >
                                                <Plus className="mr-2 h-4 w-4" />
                                                Créer le premier utilisateur
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                userList.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">
                                            {user.name}
                                        </TableCell>
                                        <TableCell className="max-w-xs truncate">
                                            {user.email || '—'}
                                        </TableCell>
                                        <TableCell className="font-semibold">
                                            {user.role}
                                        </TableCell>
                                        <TableCell>
                                            {user.role === 'teacher' &&
                                            user.teacher_subjects &&
                                            user.teacher_subjects.length > 0 ? (
                                                <HoverCard>
                                                    <HoverCardTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            className="h-auto p-0 hover:bg-transparent"
                                                        >
                                                            <Badge
                                                                variant="outline"
                                                                className="cursor-pointer hover:bg-muted"
                                                            >
                                                                <GraduationCap className="mr-1 h-3 w-3" />
                                                                {
                                                                    user
                                                                        .teacher_subjects
                                                                        .length
                                                                }{' '}
                                                                {user
                                                                    .teacher_subjects
                                                                    .length ===
                                                                1
                                                                    ? 'matière'
                                                                    : 'matières'}
                                                            </Badge>
                                                        </Button>
                                                    </HoverCardTrigger>
                                                    <HoverCardContent className="w-80">
                                                        <div className="space-y-2">
                                                            <h4 className="flex items-center gap-2 text-sm font-semibold">
                                                                <GraduationCap className="h-4 w-4" />
                                                                Matières
                                                                enseignées
                                                            </h4>
                                                            <div className="space-y-3">
                                                                {user.teacher_subjects.map(
                                                                    (
                                                                        subject,
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                subject.id
                                                                            }
                                                                            className="text-sm"
                                                                        >
                                                                            <div className="font-medium text-foreground">
                                                                                {
                                                                                    subject.name
                                                                                }
                                                                            </div>
                                                                            <div className="text-xs text-muted-foreground">
                                                                                {
                                                                                    subject
                                                                                        .education_level
                                                                                        ?.name
                                                                                }{' '}
                                                                                •{' '}
                                                                                {
                                                                                    subject
                                                                                        .education_level
                                                                                        ?.category
                                                                                        ?.name
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    ),
                                                                )}
                                                            </div>
                                                        </div>
                                                    </HoverCardContent>
                                                </HoverCard>
                                            ) : (
                                                <span className="text-sm text-muted-foreground">
                                                    —
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    user.is_active
                                                        ? 'default'
                                                        : 'secondary'
                                                }
                                            >
                                                {user.is_active
                                                    ? 'Actif'
                                                    : 'Inactif'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {new Date(
                                                user.created_at,
                                            ).toLocaleDateString('fr-FR')}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() =>
                                                        handleEditClick(user)
                                                    }
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-destructive"
                                                    onClick={() =>
                                                        handleDeleteClick(user)
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

                {/* Edit User Dialog */}
                {selectedUser && (
                    <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>
                                    Modifier l'utilisateur
                                </DialogTitle>
                                <DialogDescription>
                                    Modifiez les informations de{' '}
                                    {selectedUser.name}
                                </DialogDescription>
                            </DialogHeader>

                            <Form
                                {...UserController.update.form(selectedUser.id)}
                                transform={(data) => ({
                                    ...data,
                                    is_active: data.is_active ? 1 : 0,
                                    teacher_subject_ids:
                                        editSelectedRole === 'teacher'
                                            ? editSelectedSubjectIds
                                            : undefined,
                                })}
                                onSuccess={handleUpdateSuccess}
                                onError={(err) => {
                                    toast.error(
                                        err.message || 'Une Erreur est survenu',
                                    );
                                }}
                            >
                                {({ processing, errors }) => (
                                    <>
                                        <div className="grid gap-4 py-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="edit-name">
                                                    Nom complet
                                                </Label>
                                                <Input
                                                    id="edit-name"
                                                    name="name"
                                                    defaultValue={
                                                        selectedUser.name
                                                    }
                                                    placeholder="Jean Dupont"
                                                    required
                                                />
                                                <InputError
                                                    message={errors.name}
                                                />
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="edit-email">
                                                    Email
                                                </Label>
                                                <Input
                                                    id="edit-email"
                                                    name="email"
                                                    type="email"
                                                    defaultValue={
                                                        selectedUser.email
                                                    }
                                                    placeholder="jean.dupont@example.com"
                                                    required
                                                />
                                                <InputError
                                                    message={errors.email}
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="edit-city">
                                                        Ville
                                                    </Label>
                                                    <Input
                                                        id="edit-city"
                                                        name="city"
                                                        defaultValue={
                                                            selectedUser.city
                                                        }
                                                        placeholder="Paris"
                                                    />
                                                    <InputError
                                                        message={errors.city}
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label htmlFor="edit-phone">
                                                        Téléphone
                                                    </Label>
                                                    <Input
                                                        id="edit-phone"
                                                        name="phone"
                                                        defaultValue={
                                                            selectedUser.phone
                                                        }
                                                        placeholder="+33 6 12 34 56 78"
                                                    />
                                                    <InputError
                                                        message={errors.phone}
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="edit-role">
                                                    Rôle
                                                </Label>
                                                <Select
                                                    name="role"
                                                    value={editSelectedRole}
                                                    onValueChange={
                                                        handleEditRoleChange
                                                    }
                                                    required
                                                >
                                                    <SelectTrigger id="edit-role">
                                                        <SelectValue placeholder="Sélectionner un rôle" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {roles.map((role) => (
                                                            <SelectItem
                                                                key={role}
                                                                value={role}
                                                            >
                                                                {role}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <InputError
                                                    message={errors.role}
                                                />
                                            </div>

                                            {/* Teacher Education Assignment Section */}
                                            {editSelectedRole === 'teacher' && (
                                                <div className="space-y-4 rounded-lg border border-purple-200 bg-purple-50 p-4 dark:border-purple-200/10 dark:bg-purple-700/10">
                                                    <div className="flex items-center gap-2">
                                                        <GraduationCap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                                        <h3 className="font-semibold text-purple-900 dark:text-purple-100">
                                                            Matières enseignées
                                                        </h3>
                                                    </div>

                                                    <div className="grid gap-3">
                                                        {/* Category Selection */}
                                                        <div className="grid gap-2">
                                                            <Label
                                                                htmlFor="edit-category"
                                                                className="text-sm font-medium"
                                                            >
                                                                1. Catégorie
                                                            </Label>
                                                            <Select
                                                                value={editSelectedCategoryId?.toString()}
                                                                onValueChange={
                                                                    handleEditCategoryChange
                                                                }
                                                            >
                                                                <SelectTrigger id="edit-category">
                                                                    <SelectValue placeholder="Sélectionner une catégorie" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {educationCategories.map(
                                                                        (
                                                                            category,
                                                                        ) => (
                                                                            <SelectItem
                                                                                key={
                                                                                    category.id
                                                                                }
                                                                                value={category.id.toString()}
                                                                            >
                                                                                {
                                                                                    category.name
                                                                                }
                                                                            </SelectItem>
                                                                        ),
                                                                    )}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>

                                                        {/* Level Selection */}
                                                        {editSelectedCategoryId && (
                                                            <div className="grid gap-2">
                                                                <Label
                                                                    htmlFor="edit-level"
                                                                    className="text-sm font-medium"
                                                                >
                                                                    2. Niveau
                                                                </Label>
                                                                <Select
                                                                    value={editSelectedLevelId?.toString()}
                                                                    onValueChange={
                                                                        handleEditLevelChange
                                                                    }
                                                                    disabled={
                                                                        !editAvailableLevels.length
                                                                    }
                                                                >
                                                                    <SelectTrigger id="edit-level">
                                                                        <SelectValue placeholder="Sélectionner un niveau" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {editAvailableLevels.map(
                                                                            (
                                                                                level,
                                                                            ) => (
                                                                                <SelectItem
                                                                                    key={
                                                                                        level.id
                                                                                    }
                                                                                    value={level.id.toString()}
                                                                                >
                                                                                    {
                                                                                        level.name
                                                                                    }
                                                                                </SelectItem>
                                                                            ),
                                                                        )}
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                        )}

                                                        {/* Subject Selection */}
                                                        {editSelectedLevelId &&
                                                            editAvailableSubjects.length >
                                                                0 && (
                                                                <div className="grid gap-2">
                                                                    <Label className="text-sm font-medium">
                                                                        3.
                                                                        Matières
                                                                    </Label>
                                                                    <div className="rounded-md border bg-white p-3 dark:bg-gray-950">
                                                                        <div className="space-y-2">
                                                                            {editAvailableSubjects.map(
                                                                                (
                                                                                    subject,
                                                                                ) => (
                                                                                    <div
                                                                                        key={
                                                                                            subject.id
                                                                                        }
                                                                                        className="flex items-center space-x-2"
                                                                                    >
                                                                                        <Checkbox
                                                                                            id={`edit-subject-${subject.id}`}
                                                                                            checked={editSelectedSubjectIds.includes(
                                                                                                subject.id,
                                                                                            )}
                                                                                            onCheckedChange={() =>
                                                                                                handleEditSubjectToggle(
                                                                                                    subject.id,
                                                                                                )
                                                                                            }
                                                                                        />
                                                                                        <Label
                                                                                            htmlFor={`edit-subject-${subject.id}`}
                                                                                            className="cursor-pointer text-sm font-normal"
                                                                                        >
                                                                                            {
                                                                                                subject.name
                                                                                            }
                                                                                        </Label>
                                                                                    </div>
                                                                                ),
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}

                                                        {/* Selected Subjects Display */}
                                                        {editSelectedSubjectIds.length >
                                                            0 && (
                                                            <div className="grid gap-2">
                                                                <Label className="text-sm font-medium">
                                                                    Matières
                                                                    sélectionnées
                                                                </Label>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {getSelectedSubjectNames(
                                                                        editSelectedSubjectIds,
                                                                    ).map(
                                                                        (
                                                                            name,
                                                                            idx,
                                                                        ) => (
                                                                            <Badge
                                                                                key={
                                                                                    idx
                                                                                }
                                                                                variant="secondary"
                                                                                className="gap-1"
                                                                            >
                                                                                {
                                                                                    name
                                                                                }
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() =>
                                                                                        handleEditRemoveSubject(
                                                                                            editSelectedSubjectIds[
                                                                                                idx
                                                                                            ],
                                                                                        )
                                                                                    }
                                                                                    className="ml-1 rounded-full hover:bg-muted"
                                                                                >
                                                                                    <X className="h-3 w-3" />
                                                                                </button>
                                                                            </Badge>
                                                                        ),
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <InputError
                                                        message={
                                                            errors.teacher_subject_ids
                                                        }
                                                    />
                                                </div>
                                            )}

                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="edit-is-active"
                                                    name="is_active"
                                                    defaultChecked={
                                                        selectedUser.is_active
                                                    }
                                                />
                                                <Label
                                                    htmlFor="edit-is-active"
                                                    className="text-sm font-normal"
                                                >
                                                    Compte actif
                                                </Label>
                                            </div>
                                        </div>

                                        <DialogFooter>
                                            <DialogClose asChild>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    disabled={processing}
                                                >
                                                    Annuler
                                                </Button>
                                            </DialogClose>
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                            >
                                                {processing && (
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                )}
                                                Mettre à jour
                                            </Button>
                                        </DialogFooter>
                                    </>
                                )}
                            </Form>
                        </DialogContent>
                    </Dialog>
                )}

                {selectedUser && (
                    <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>
                                    Confirmer la suppression
                                </DialogTitle>
                                <DialogDescription>
                                    Êtes-vous sûr de vouloir supprimer
                                    l'utilisateur{' '}
                                    <span className="font-semibold">
                                        {selectedUser.name}
                                    </span>{' '}
                                    ? Cette action est irréversible.
                                </DialogDescription>
                            </DialogHeader>

                            <Form
                                {...UserController.destroy.form(
                                    selectedUser.id,
                                )}
                                onSuccess={handleDeleteSuccess}
                                onError={(err) =>
                                    toast.error(
                                        err.message || 'Une erreur est survenu',
                                    )
                                }
                            >
                                {({ processing }) => (
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                disabled={processing}
                                            >
                                                Annuler
                                            </Button>
                                        </DialogClose>
                                        <Button
                                            type="submit"
                                            variant="destructive"
                                            disabled={processing}
                                        >
                                            {processing && (
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            )}
                                            Supprimer
                                        </Button>
                                    </DialogFooter>
                                )}
                            </Form>
                        </DialogContent>
                    </Dialog>
                )}
            </div>
        </AppLayout>
    );
}
