import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import forfaitStore from '@/routes/parent/forfait-store';
import { Form, Link, router } from '@inertiajs/react';
import {
    BookOpen,
    Crown,
    Edit,
    Flame,
    Heart,
    Music,
    Palette,
    Plus,
    Rocket,
    Sparkles,
    Star,
    Trophy,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Props {
    data?: {
        childProfiles: any[];
        programmes: any[];
        activeUnassignedPlans: any[];
    };
}

const AVATAR_ICONS = [
    { Icon: Rocket, name: 'rocket' },
    { Icon: Star, name: 'star' },
    { Icon: Heart, name: 'heart' },
    { Icon: Sparkles, name: 'sparkles' },
    { Icon: BookOpen, name: 'book' },
    { Icon: Palette, name: 'palette' },
    { Icon: Music, name: 'music' },
    { Icon: Trophy, name: 'trophy' },
    { Icon: Crown, name: 'crown' },
    { Icon: Flame, name: 'flame' },
];

const AVATAR_COLORS = [
    {
        bg: 'bg-linear-to-br from-purple-400 to-purple-600',
        ring: 'ring-purple-400/50',
    },
    {
        bg: 'bg-linear-to-br from-blue-400 to-blue-600',
        ring: 'ring-blue-400/50',
    },
    {
        bg: 'bg-linear-to-br from-green-400 to-green-600',
        ring: 'ring-green-400/50',
    },
    {
        bg: 'bg-linear-to-br from-pink-400 to-pink-600',
        ring: 'ring-pink-400/50',
    },
    {
        bg: 'bg-linear-to-br from-orange-400 to-orange-600',
        ring: 'ring-orange-400/50',
    },
    {
        bg: 'bg-linear-to-br from-teal-400 to-teal-600',
        ring: 'ring-teal-400/50',
    },
    {
        bg: 'bg-linear-to-br from-indigo-400 to-indigo-600',
        ring: 'ring-indigo-400/50',
    },
    {
        bg: 'bg-linear-to-br from-rose-400 to-rose-600',
        ring: 'ring-rose-400/50',
    },
    {
        bg: 'bg-linear-to-br from-amber-400 to-amber-600',
        ring: 'ring-amber-400/50',
    },
    {
        bg: 'bg-linear-to-br from-cyan-400 to-cyan-600',
        ring: 'ring-cyan-400/50',
    },
];

export default function ParentDashboard({ data }: Props) {
    const {
        childProfiles = [],
        programmes = [],
        activeUnassignedPlans = [],
    } = data || {};
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedAvatar, setSelectedAvatar] = useState(0);
    const [selectedColor, setSelectedColor] = useState(0);
    const [selectedProgrammeId, setSelectedProgrammeId] = useState<
        string | null
    >(null);
    const [editChild, setEditChild] = useState<any | null>(null);
    const [editName, setEditName] = useState('');

    const emptySlots = Math.max(1, childProfiles.length === 0 ? 3 : 1);
    const hasAvailablePlans = (activeUnassignedPlans ?? []).length > 0;

    const handleAddChild = () => {
        setEditChild(null);
        setEditName('');
        setIsDialogOpen(true);
        setSelectedAvatar(Math.floor(Math.random() * AVATAR_ICONS.length));
        setSelectedColor(Math.floor(Math.random() * AVATAR_COLORS.length));
        setSelectedProgrammeId(null);
    };

    const handleSelectChild = (child: any) => {
        // Redirect to child's learning session
        router.visit(`/parent/child-sessions/${child.id}`);
    };

    const handleEditChild = (child: any, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent triggering the profile click
        setEditChild(child);
        setEditName(child.name);
        setSelectedAvatar(child.avatar_icon ?? 0);
        setSelectedColor(child.avatar_color ?? 0);
        setIsDialogOpen(true);
    };

    const getChildAvatar = (child: any, index: number) => {
        const avatarIndex = child.avatar_icon ?? index % AVATAR_ICONS.length;
        const colorIndex = child.avatar_color ?? index % AVATAR_COLORS.length;
        return {
            Icon: AVATAR_ICONS[avatarIndex]?.Icon || AVATAR_ICONS[0].Icon,
            color: AVATAR_COLORS[colorIndex] || AVATAR_COLORS[0],
        };
    };

    return (
        <>
            <div className="flex min-h-screen flex-1 flex-col bg-linear-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
                {childProfiles.length > 0 && (
                    <div className="border-b border-slate-200/50 bg-white/50 px-6 py-4 backdrop-blur-sm dark:border-slate-800/50 dark:bg-slate-900/50">
                        <div className="mx-auto flex max-w-6xl items-center justify-center gap-8">
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                                <span className="text-sm text-slate-600 dark:text-slate-400">
                                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                                        {
                                            childProfiles.filter(
                                                (c: any) => c.current_plan,
                                            ).length
                                        }
                                    </span>{' '}
                                    Actifs
                                </span>
                            </div>
                            <div className="h-4 w-px bg-slate-200 dark:bg-slate-700"></div>
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                                <span className="text-sm text-slate-600 dark:text-slate-400">
                                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                                        {
                                            childProfiles.filter(
                                                (c: any) => !c.current_plan,
                                            ).length
                                        }
                                    </span>{' '}
                                    Sans abonnement
                                </span>
                            </div>
                            <div className="h-4 w-px bg-slate-200 dark:bg-slate-700"></div>
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                <span className="text-sm text-slate-600 dark:text-slate-400">
                                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                                        {childProfiles.length}
                                    </span>{' '}
                                    Total
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex flex-1 items-center justify-center px-6 py-12">
                    <div className="w-full max-w-6xl space-y-12">
                        <div className="space-y-3 text-center">
                            <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                                {childProfiles.length === 0
                                    ? "Qui apprend aujourd'hui ?"
                                    : "Qui apprend aujourd'hui ?"}
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400">
                                {childProfiles.length === 0
                                    ? 'Commencez par créer un profil pour votre enfant'
                                    : 'Sélectionnez un profil pour continuer'}
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-6">
                            {childProfiles.map((child: any, index: number) => {
                                const { Icon, color } = getChildAvatar(
                                    child,
                                    index,
                                );
                                return (
                                    <div
                                        key={child.id}
                                        className="group relative flex flex-col items-center transition-all duration-300"
                                    >
                                        {/* Edit Icon */}
                                        <button
                                            onClick={(e) =>
                                                handleEditChild(child, e)
                                            }
                                            className="absolute top-0 right-0 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-slate-200/80 text-slate-600 opacity-0 shadow-sm backdrop-blur-sm transition-all duration-200 group-hover:opacity-100 hover:bg-slate-300 hover:text-slate-900 dark:bg-slate-700/80 dark:text-slate-300 dark:hover:bg-slate-600 dark:hover:text-slate-100"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </button>

                                        <div
                                            className="cursor-pointer"
                                            onClick={() =>
                                                handleSelectChild(child)
                                            }
                                        >
                                            <div className="relative">
                                                <div
                                                    className={`flex h-32 w-32 items-center justify-center rounded-full ${color.bg} text-white shadow-lg ring-4 ring-transparent transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:${color.ring} hover:ring-8`}
                                                >
                                                    <Icon className="h-16 w-16" />
                                                </div>

                                                {child.current_plan && (
                                                    <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full border-4 border-white bg-emerald-500 dark:border-slate-900" />
                                                )}

                                                {!child.current_plan && (
                                                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-slate-900/60 backdrop-blur-[2px]">
                                                        <Badge
                                                            variant="secondary"
                                                            className="text-xs font-medium"
                                                        >
                                                            Inactif
                                                        </Badge>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-4 space-y-2 text-center">
                                            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                                                {child.name}
                                            </h3>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                {child.education_level?.name}
                                            </p>
                                            {child.current_plan && (
                                                <Badge
                                                    variant="outline"
                                                    className="text-xs"
                                                >
                                                    {
                                                        child.current_plan.plan
                                                            .name
                                                    }
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}

                            {Array.from({ length: emptySlots }).map(
                                (_, index) => (
                                    <div
                                        key={`empty-${index}`}
                                        className="group flex cursor-pointer flex-col items-center transition-all duration-300 hover:scale-110"
                                        onClick={handleAddChild}
                                    >
                                        <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-dashed border-slate-300 bg-slate-100/50 text-slate-400 shadow-sm transition-all duration-300 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-500 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-blue-500 dark:hover:bg-blue-950/30">
                                            <Plus className="h-12 w-12" />
                                        </div>
                                        <div className="mt-4 space-y-1 text-center">
                                            <h3 className="text-lg font-semibold text-slate-600 group-hover:text-blue-600 dark:text-slate-400 dark:group-hover:text-blue-400">
                                                Ajouter
                                            </h3>
                                            <p className="text-xs text-slate-400 dark:text-slate-500">
                                                Nouveau profil
                                            </p>
                                        </div>
                                    </div>
                                ),
                            )}
                        </div>

                        <div className="flex justify-center gap-4">
                            <Button
                                onClick={handleAddChild}
                                size="lg"
                                className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            >
                                <Plus className="mr-2 h-5 w-5" />
                                Ajouter un enfant
                            </Button>
                            {childProfiles.length > 0 && (
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="border-slate-300 dark:border-slate-700"
                                >
                                    Gérer les abonnements
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[650px]">
                    <DialogHeader>
                        <DialogTitle>
                            {editChild
                                ? 'Modifier le profil enfant'
                                : 'Ajouter un profil enfant'}
                        </DialogTitle>
                        <DialogDescription>
                            {editChild
                                ? "Vous pouvez modifier le nom, l'icône et la couleur du profil. Les autres champs ne sont pas modifiables."
                                : hasAvailablePlans
                                  ? 'Remplissez les informations de votre enfant et personnalisez son profil.'
                                  : "Vous devez d'abord acheter un plan pour pouvoir créer un profil enfant."}
                        </DialogDescription>
                    </DialogHeader>

                    {!hasAvailablePlans && !editChild ? (
                        <div className="space-y-4 py-6 text-center">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30">
                                <Plus className="h-8 w-8 text-yellow-600 dark:text-yellow-500" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-lg font-semibold">
                                    Aucun plan disponible
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Pour créer un profil enfant, vous devez
                                    d'abord acheter un plan d'apprentissage.
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <Link
                                    as={Button}
                                    href={forfaitStore.index()}
                                    className="flex-1"
                                >
                                    Acheter un plan
                                </Link>
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => setIsDialogOpen(false)}
                                >
                                    Annuler
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <Form
                            disableWhileProcessing
                            {...(editChild
                                ? forfaitStore.updateChildProfile.form({
                                      id: editChild.id,
                                  })
                                : forfaitStore.assignChildProfile.form())}
                            onSuccess={() => {
                                toast(
                                    editChild
                                        ? 'Profil modifié avec succès !'
                                        : 'Enfant ajouté avec succès !',
                                );
                                setIsDialogOpen(false);
                            }}
                            onError={(err: any) =>
                                toast.error(
                                    err.message || 'Une Erreur est survenu.',
                                )
                            }
                            options={{
                                preserveScroll: true,
                            }}
                        >
                            {({ processing, recentlySuccessful, errors }) => {
                                const selectedProgramme = programmes.find(
                                    (p: any) =>
                                        String(p.id) === selectedProgrammeId,
                                );
                                const availableClasses =
                                    selectedProgramme?.education_levels ?? [];
                                const SelectedIcon =
                                    AVATAR_ICONS[selectedAvatar].Icon;
                                const selectedColorClass =
                                    AVATAR_COLORS[selectedColor];

                                return (
                                    <>
                                        <div className="grid gap-6 py-4">
                                            {/* Avatar Customization */}
                                            <div className="space-y-3">
                                                <Label className="text-sm font-medium">
                                                    Personnaliser l'avatar
                                                </Label>
                                                <div className="flex items-center gap-6">
                                                    <div
                                                        className={`flex h-24 w-24 shrink-0 items-center justify-center rounded-full ${selectedColorClass.bg} text-white shadow-lg`}
                                                    >
                                                        <SelectedIcon className="h-12 w-12" />
                                                    </div>

                                                    <div className="flex-1 space-y-3">
                                                        {/* Icon Selection */}
                                                        <div className="space-y-2">
                                                            <Label className="text-xs text-muted-foreground">
                                                                Icône
                                                            </Label>
                                                            <div className="flex flex-wrap gap-2">
                                                                {AVATAR_ICONS.map(
                                                                    (
                                                                        icon,
                                                                        index,
                                                                    ) => {
                                                                        const Icon =
                                                                            icon.Icon;
                                                                        return (
                                                                            <button
                                                                                key={
                                                                                    index
                                                                                }
                                                                                type="button"
                                                                                onClick={() =>
                                                                                    setSelectedAvatar(
                                                                                        index,
                                                                                    )
                                                                                }
                                                                                className={`flex h-10 w-10 items-center justify-center rounded-lg border-2 transition-all ${
                                                                                    selectedAvatar ===
                                                                                    index
                                                                                        ? 'border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400'
                                                                                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400'
                                                                                }`}
                                                                            >
                                                                                <Icon className="h-5 w-5" />
                                                                            </button>
                                                                        );
                                                                    },
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Color Selection */}
                                                        <div className="space-y-2">
                                                            <Label className="text-xs text-muted-foreground">
                                                                Couleur
                                                            </Label>
                                                            <div className="flex flex-wrap gap-2">
                                                                {AVATAR_COLORS.map(
                                                                    (
                                                                        color,
                                                                        index,
                                                                    ) => (
                                                                        <button
                                                                            key={
                                                                                index
                                                                            }
                                                                            type="button"
                                                                            onClick={() =>
                                                                                setSelectedColor(
                                                                                    index,
                                                                                )
                                                                            }
                                                                            className={`h-8 w-8 rounded-full border-2 transition-all ${color.bg} ${
                                                                                selectedColor ===
                                                                                index
                                                                                    ? 'scale-110 border-white ring-2 ring-slate-400 dark:ring-slate-500'
                                                                                    : 'border-transparent hover:scale-105'
                                                                            }`}
                                                                        />
                                                                    ),
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <input
                                                    type="hidden"
                                                    name="avatar_icon"
                                                    value={selectedAvatar}
                                                />
                                                <input
                                                    type="hidden"
                                                    name="avatar_color"
                                                    value={selectedColor}
                                                />
                                            </div>

                                            <div className="h-px bg-slate-200 dark:bg-slate-700" />

                                            {/* Name */}
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label
                                                    htmlFor="name"
                                                    className="text-right"
                                                >
                                                    Nom complet
                                                </Label>
                                                <div className="col-span-3 space-y-1">
                                                    <Input
                                                        id="name"
                                                        name="name"
                                                        placeholder="Ex: Emma Dubois"
                                                        value={
                                                            editChild
                                                                ? editName
                                                                : undefined
                                                        }
                                                        onChange={
                                                            editChild
                                                                ? (e) =>
                                                                      setEditName(
                                                                          e
                                                                              .target
                                                                              .value,
                                                                      )
                                                                : undefined
                                                        }
                                                        disabled={processing}
                                                    />
                                                    <InputError
                                                        message={errors.name}
                                                    />
                                                </div>
                                            </div>

                                            {/* Disabled fields in edit mode */}
                                            {editChild && (
                                                <div className="space-y-2 rounded-lg bg-slate-100 px-4 py-3 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                                                    Les champs "Niveau",
                                                    "Classe" et "Plan" ne
                                                    peuvent pas être modifiés
                                                    après la création du profil.
                                                </div>
                                            )}

                                            {/* Programme */}
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label
                                                    htmlFor="level"
                                                    className="text-right"
                                                >
                                                    Niveau
                                                </Label>
                                                <div className="col-span-3 space-y-1">
                                                    <Select
                                                        name="programme_id"
                                                        onValueChange={(
                                                            value,
                                                        ) => {
                                                            setSelectedProgrammeId(
                                                                value,
                                                            );
                                                        }}
                                                        disabled={!!editChild}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Choisir un niveau" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {programmes.map(
                                                                (
                                                                    programme: any,
                                                                ) => (
                                                                    <SelectItem
                                                                        key={
                                                                            programme.id
                                                                        }
                                                                        value={String(
                                                                            programme.id,
                                                                        )}
                                                                    >
                                                                        {
                                                                            programme.name
                                                                        }
                                                                    </SelectItem>
                                                                ),
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                    <InputError
                                                        message={
                                                            errors.programme_id
                                                        }
                                                    />
                                                </div>
                                            </div>

                                            {/* Class */}
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label
                                                    htmlFor="class"
                                                    className="text-right"
                                                >
                                                    Classe
                                                </Label>
                                                <div className="col-span-3 space-y-1">
                                                    <Select
                                                        name="level_id"
                                                        disabled={
                                                            !!editChild ||
                                                            availableClasses.length ===
                                                                0
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue
                                                                placeholder={
                                                                    selectedProgrammeId
                                                                        ? 'Choisir une classe'
                                                                        : "D'abord choisir un niveau"
                                                                }
                                                            />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {availableClasses.map(
                                                                (
                                                                    classe: any,
                                                                ) => (
                                                                    <SelectItem
                                                                        key={
                                                                            classe.id
                                                                        }
                                                                        value={String(
                                                                            classe.id,
                                                                        )}
                                                                    >
                                                                        {
                                                                            classe.name
                                                                        }
                                                                    </SelectItem>
                                                                ),
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                    <InputError
                                                        message={
                                                            errors.level_id
                                                        }
                                                    />
                                                </div>
                                            </div>

                                            {/* Plan */}
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label
                                                    htmlFor="plan"
                                                    className="text-right"
                                                >
                                                    Plan à assigner
                                                </Label>
                                                <div className="col-span-3 space-y-1">
                                                    <Select
                                                        name="purchased_plan_id"
                                                        disabled={!!editChild}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Choisir un plan" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {activeUnassignedPlans.map(
                                                                (plan: any) => (
                                                                    <SelectItem
                                                                        key={
                                                                            plan.id
                                                                        }
                                                                        value={String(
                                                                            plan.id,
                                                                        )}
                                                                    >
                                                                        <div className="flex flex-col items-start">
                                                                            <span className="font-medium">
                                                                                {plan
                                                                                    .plan
                                                                                    ?.name ??
                                                                                    plan.name}
                                                                            </span>
                                                                            <span className="text-xs text-muted-foreground">
                                                                                {plan
                                                                                    .plan
                                                                                    ?.duration_months ??
                                                                                    plan.duration_months ??
                                                                                    ''}{' '}
                                                                                mois
                                                                                -{' '}
                                                                                {plan
                                                                                    .plan
                                                                                    ?.formatted_price ??
                                                                                    plan.formatted_price ??
                                                                                    plan.price ??
                                                                                    ''}
                                                                            </span>
                                                                        </div>
                                                                    </SelectItem>
                                                                ),
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                    <InputError
                                                        message={
                                                            errors.purchased_plan_id
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <DialogFooter>
                                            <Button
                                                variant="outline"
                                                type="button"
                                                onClick={() =>
                                                    setIsDialogOpen(false)
                                                }
                                            >
                                                Annuler
                                            </Button>
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                            >
                                                {processing
                                                    ? editChild
                                                        ? 'Modification...'
                                                        : 'Création...'
                                                    : editChild
                                                      ? 'Enregistrer'
                                                      : 'Créer le profil'}
                                            </Button>
                                        </DialogFooter>
                                    </>
                                );
                            }}
                        </Form>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
