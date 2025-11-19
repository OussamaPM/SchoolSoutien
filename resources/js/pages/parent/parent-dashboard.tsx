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
            <div className="flex h-screen flex-col overflow-hidden bg-linear-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
                {childProfiles.length > 0 && (
                    <div className="shrink-0 border-b border-slate-200/50 bg-white/50 px-6 py-3 backdrop-blur-sm dark:border-slate-800/50 dark:bg-slate-900/50">
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

                <div className="flex flex-1 items-center justify-center overflow-y-auto rounded-3xl bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 px-4 py-8 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
                    <div className="w-full max-w-6xl space-y-6">
                        <div className="space-y-4 text-center">
                            <div className="flex items-center justify-center gap-3">
                                <div className="animate-bounce">
                                    <Sparkles className="h-8 w-8 text-yellow-500" />
                                </div>
                                <h1 className="bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-5xl font-black tracking-tight text-transparent md:text-6xl">
                                    {childProfiles.length === 0
                                        ? "Qui apprend aujourd'hui ?"
                                        : "Qui apprend aujourd'hui ?"}
                                </h1>
                                <div className="animate-bounce delay-150">
                                    <Star className="h-8 w-8 text-pink-500" />
                                </div>
                            </div>
                            <p className="text-lg font-medium text-slate-600 dark:text-slate-400">
                                {childProfiles.length === 0
                                    ? '✨ Commencez par créer un profil magique pour votre enfant'
                                    : "🚀 Sélectionnez un profil pour démarrer l'aventure"}
                            </p>
                        </div>

                        {/* Profile Cards Grid */}
                        <div className="flex flex-wrap items-center justify-center gap-6">
                            {childProfiles.map((child: any, index: number) => {
                                const { Icon, color } = getChildAvatar(
                                    child,
                                    index,
                                );
                                return (
                                    <div
                                        key={child.id}
                                        className="group relative transition-all duration-300"
                                    >
                                        {/* Floating Edit Button */}
                                        <button
                                            onClick={(e) =>
                                                handleEditChild(child, e)
                                            }
                                            className="absolute -top-2 -right-2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-700 opacity-0 shadow-lg ring-2 ring-blue-200 transition-all duration-300 group-hover:opacity-100 hover:scale-110 hover:bg-blue-50 hover:text-blue-600 hover:ring-4 hover:ring-blue-300 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-700 dark:hover:text-blue-400"
                                        >
                                            <Edit className="h-5 w-5" />
                                        </button>

                                        <div
                                            className="cursor-pointer"
                                            onClick={() =>
                                                handleSelectChild(child)
                                            }
                                        >
                                            {/* Floating Card */}
                                            <div className="rounded-3xl bg-white p-6 shadow-lg ring-2 ring-blue-100 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:ring-4 hover:ring-purple-200 dark:bg-slate-900 dark:ring-slate-800 dark:hover:ring-purple-900">
                                                {/* Avatar Circle */}
                                                <div className="relative mx-auto w-fit">
                                                    <div
                                                        className={`flex h-28 w-28 items-center justify-center rounded-full ${color.bg} text-white shadow-xl ring-4 ring-white transition-all duration-500 group-hover:scale-110 group-hover:shadow-2xl group-hover:ring-8 group-hover:${color.ring} dark:ring-slate-900`}
                                                    >
                                                        <Icon className="h-14 w-14" />
                                                    </div>

                                                    {/* Active Badge */}
                                                    {child.current_plan && (
                                                        <div className="absolute -top-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-4 border-white bg-emerald-500 shadow-md dark:border-slate-900">
                                                            <Sparkles className="h-4 w-4 text-white" />
                                                        </div>
                                                    )}

                                                    {/* Inactive Overlay */}
                                                    {!child.current_plan && (
                                                        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-slate-900/70 backdrop-blur-sm">
                                                            <Badge
                                                                variant="secondary"
                                                                className="rounded-full px-3 py-1 text-xs font-bold shadow-lg"
                                                            >
                                                                Inactif
                                                            </Badge>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Child Info */}
                                                <div className="mt-5 space-y-2 text-center">
                                                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                                                        {child.name}
                                                    </h3>
                                                    {child.education_level
                                                        ?.name && (
                                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                                            {
                                                                child
                                                                    .education_level
                                                                    .name
                                                            }
                                                        </p>
                                                    )}
                                                    {child.current_plan && (
                                                        <Badge className="mt-2 rounded-full bg-linear-to-r from-emerald-500 to-green-600 px-3 py-1 text-xs font-semibold shadow-md">
                                                            ✨{' '}
                                                            {
                                                                child
                                                                    .current_plan
                                                                    .plan.name
                                                            }
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Add New Profile Card */}
                            {Array.from({ length: emptySlots }).map(
                                (_, index) => (
                                    <div
                                        key={`empty-${index}`}
                                        className="group cursor-pointer transition-all duration-300 hover:scale-105"
                                        onClick={handleAddChild}
                                    >
                                        <div className="rounded-3xl border-4 border-dashed border-blue-200 bg-blue-50/50 p-6 shadow-md transition-all duration-300 hover:border-purple-300 hover:bg-purple-50/50 hover:shadow-xl dark:border-slate-700 dark:bg-slate-800/30 dark:hover:border-purple-700 dark:hover:bg-purple-900/20">
                                            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-white shadow-inner ring-4 ring-blue-100 transition-all duration-300 group-hover:bg-linear-to-br group-hover:from-blue-400 group-hover:to-purple-500 group-hover:ring-purple-200 dark:bg-slate-800 dark:ring-slate-700 dark:group-hover:ring-purple-700">
                                                <Plus className="h-14 w-14 text-blue-400 transition-colors group-hover:text-white dark:text-blue-600" />
                                            </div>
                                            <div className="mt-5 space-y-1 text-center">
                                                <h3 className="text-xl font-bold text-blue-600 group-hover:text-purple-600 dark:text-blue-500 dark:group-hover:text-purple-500">
                                                    Ajouter
                                                </h3>
                                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                    Nouveau profil
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ),
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap justify-center gap-4">
                            <Button
                                onClick={handleAddChild}
                                size="lg"
                                className="rounded-2xl bg-linear-to-r from-blue-500 to-purple-600 px-8 py-6 text-lg font-bold shadow-lg shadow-purple-200 transition-all hover:scale-105 hover:shadow-xl hover:shadow-purple-300 dark:shadow-purple-900/30"
                            >
                                <Plus className="mr-2 h-6 w-6" />
                                Ajouter un enfant
                            </Button>
                            {childProfiles.length > 0 && (
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="rounded-2xl border-2 border-pink-300 bg-white px-8 py-6 text-lg font-bold text-pink-600 shadow-lg transition-all hover:scale-105 hover:border-pink-400 hover:bg-pink-50 hover:shadow-xl dark:border-pink-700 dark:bg-slate-900 dark:text-pink-400 dark:hover:bg-pink-950/30"
                                >
                                    <Heart className="mr-2 h-6 w-6" />
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
