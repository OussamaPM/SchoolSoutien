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
    AlertCircle,
    BookOpen,
    Crown,
    Edit,
    Flame,
    GraduationCap,
    Heart,
    Music,
    Palette,
    Plus,
    Rocket,
    Sparkles,
    Star,
    Target,
    Trophy,
    Users,
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
            <div className="flex h-screen flex-col overflow-hidden">
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

                <div className="flex flex-1 items-center justify-center overflow-y-auto px-4 py-8">
                    <div className="w-full max-w-7xl space-y-6">
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
                            <p className="flex items-center justify-center gap-2 text-lg font-medium text-slate-600 dark:text-slate-400">
                                {childProfiles.length === 0 ? (
                                    <>
                                        <Sparkles className="h-5 w-5 text-yellow-500" />
                                        Commencez par créer un profil magique
                                        pour votre enfant
                                    </>
                                ) : (
                                    <>
                                        <Rocket className="h-5 w-5 text-purple-500" />
                                        Sélectionnez un profil pour démarrer
                                        l'aventure
                                    </>
                                )}
                            </p>
                        </div>

                        {/* Profile Cards Grid */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:flex lg:flex-wrap lg:items-center lg:justify-center lg:gap-6">
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
                                            <div className="rounded-3xl bg-white p-4 shadow-lg ring-2 ring-blue-100 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:ring-4 hover:ring-purple-200 md:p-6 lg:p-6 dark:bg-slate-900 dark:ring-slate-800 dark:hover:ring-purple-900">
                                                {/* Avatar Circle */}
                                                <div className="relative mx-auto w-fit">
                                                    <div
                                                        className={`flex h-20 w-20 items-center justify-center rounded-full md:h-24 md:w-24 lg:h-28 lg:w-28 ${color.bg} text-white shadow-xl ring-4 ring-white transition-all duration-500 group-hover:scale-110 group-hover:shadow-2xl group-hover:ring-8 group-hover:${color.ring} dark:ring-slate-900`}
                                                    >
                                                        <Icon className="h-10 w-10 md:h-12 md:w-12 lg:h-14 lg:w-14" />
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
                                                <div className="mt-3 space-y-1 text-center md:mt-4 md:space-y-1.5 lg:mt-5 lg:space-y-2">
                                                    <h3 className="line-clamp-1 text-base font-bold text-slate-900 md:text-lg lg:text-xl dark:text-slate-100">
                                                        {child.name}
                                                    </h3>
                                                    {child.education_level
                                                        ?.name && (
                                                        <p className="line-clamp-1 text-xs font-medium text-slate-600 md:text-sm lg:text-sm dark:text-slate-400">
                                                            {
                                                                child
                                                                    .education_level
                                                                    .name
                                                            }
                                                        </p>
                                                    )}
                                                    {child.current_plan && (
                                                        <Badge className="mt-1 flex items-center justify-center gap-1 rounded-full bg-linear-to-r from-emerald-500 to-green-600 px-2 py-0.5 text-[10px] font-semibold shadow-md md:mt-1.5 md:gap-1.5 md:px-2.5 md:py-0.5 md:text-[11px] lg:mt-2 lg:gap-1.5 lg:px-3 lg:py-1 lg:text-xs">
                                                            <Sparkles className="h-2.5 w-2.5 md:h-2.5 md:w-2.5 lg:h-3 lg:w-3" />
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
                                        <div className="rounded-3xl border-4 border-dashed border-blue-200 bg-blue-50/50 p-4 shadow-md transition-all duration-300 hover:border-purple-300 hover:bg-purple-50/50 hover:shadow-xl md:p-5 lg:p-6 dark:border-slate-700 dark:bg-slate-800/30 dark:hover:border-purple-700 dark:hover:bg-purple-900/20">
                                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-inner ring-4 ring-blue-100 transition-all duration-300 group-hover:bg-linear-to-br group-hover:from-blue-400 group-hover:to-purple-500 group-hover:ring-purple-200 md:h-24 md:w-24 lg:h-28 lg:w-28 dark:bg-slate-800 dark:ring-slate-700 dark:group-hover:ring-purple-700">
                                                <Plus className="h-10 w-10 text-blue-400 transition-colors group-hover:text-white md:h-12 md:w-12 lg:h-14 lg:w-14 dark:text-blue-600" />
                                            </div>
                                            <div className="mt-3 space-y-1 text-center md:mt-4 lg:mt-5">
                                                <h3 className="text-base font-bold text-blue-600 group-hover:text-purple-600 md:text-lg lg:text-xl dark:text-blue-500 dark:group-hover:text-purple-500">
                                                    Ajouter
                                                </h3>
                                                <p className="text-xs font-medium text-slate-500 md:text-sm lg:text-sm dark:text-slate-400">
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
                <DialogContent className="max-h-[95vh] overflow-y-auto rounded-3xl border-2 border-blue-100 sm:max-w-[900px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-2xl">
                            <div className="flex items-center gap-2">
                                <Sparkles className="h-6 w-6 text-yellow-500" />
                                <span className="bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text font-bold text-transparent">
                                    {editChild
                                        ? 'Modifier le profil'
                                        : 'Créer un profil magique'}
                                </span>
                                <Star className="h-6 w-6 text-pink-500" />
                            </div>
                        </DialogTitle>
                        <DialogDescription className="flex items-center gap-2 text-base">
                            {editChild ? (
                                <>
                                    <Edit className="h-4 w-4 text-blue-500" />
                                    Personnalisez le profil de votre enfant
                                </>
                            ) : hasAvailablePlans ? (
                                <>
                                    <Palette className="h-4 w-4 text-purple-500" />
                                    Créez un profil personnalisé pour votre
                                    enfant
                                </>
                            ) : (
                                <>
                                    <AlertCircle className="h-4 w-4 text-amber-500" />
                                    Vous devez d'abord acheter un plan
                                </>
                            )}
                        </DialogDescription>
                    </DialogHeader>

                    {!hasAvailablePlans && !editChild ? (
                        <div className="space-y-6 py-8 text-center">
                            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br from-amber-400 to-orange-500 shadow-xl">
                                <Heart className="h-12 w-12 text-white" />
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                                    Aucun plan disponible
                                </h3>
                                <p className="flex items-center justify-center gap-2 text-base text-slate-600 dark:text-slate-400">
                                    <Target className="h-5 w-5 text-blue-500" />
                                    Pour créer un profil enfant, vous devez
                                    d'abord acheter un plan d'apprentissage.
                                </p>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <Link
                                    as={Button}
                                    href={forfaitStore.index()}
                                    className="flex-1 rounded-2xl bg-linear-to-r from-blue-500 to-purple-600 px-6 py-3 text-base font-bold shadow-lg hover:scale-105"
                                >
                                    <Plus className="mr-2 h-5 w-5" />
                                    Acheter un plan
                                </Link>
                                <Button
                                    variant="outline"
                                    className="flex-1 rounded-2xl border-2 border-slate-300 px-6 py-3 text-base font-semibold hover:bg-slate-100"
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
                                        <div className="grid gap-3 py-2 md:grid-cols-2 md:gap-6 md:py-4">
                                            {/* Left Column - Avatar Customization */}
                                            <div className="space-y-2 rounded-2xl bg-blue-50/50 p-3 md:space-y-3 md:p-5 dark:bg-slate-800/30">
                                                <Label className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100">
                                                    <Palette className="h-4 w-4 text-purple-500" />
                                                    Personnaliser l'avatar
                                                </Label>

                                                <div className="flex justify-center py-1 md:py-2">
                                                    <div
                                                        className={`flex h-16 w-16 items-center justify-center rounded-full md:h-24 md:w-24 ${selectedColorClass.bg} text-white shadow-2xl ring-2 md:ring-4 ${selectedColorClass.ring}`}
                                                    >
                                                        <SelectedIcon className="h-8 w-8 md:h-12 md:w-12" />
                                                    </div>
                                                </div>

                                                <div className="space-y-1">
                                                    <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                        Icône
                                                    </Label>
                                                    <div className="flex flex-wrap gap-1 md:gap-1.5">
                                                        {AVATAR_ICONS.slice(
                                                            0,
                                                            window.innerWidth <
                                                                768
                                                                ? 4
                                                                : AVATAR_ICONS.length,
                                                        ).map((icon, index) => {
                                                            const Icon =
                                                                icon.Icon;
                                                            return (
                                                                <button
                                                                    key={index}
                                                                    type="button"
                                                                    onClick={() =>
                                                                        setSelectedAvatar(
                                                                            index,
                                                                        )
                                                                    }
                                                                    className={`flex h-8 w-8 items-center justify-center rounded-lg border-2 transition-all md:h-9 md:w-9 ${
                                                                        selectedAvatar ===
                                                                        index
                                                                            ? 'border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400'
                                                                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400'
                                                                    }`}
                                                                >
                                                                    <Icon className="h-3.5 w-3.5 md:h-4 md:w-4" />
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>

                                                <div className="space-y-1">
                                                    <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                        Couleur
                                                    </Label>
                                                    <div className="flex flex-wrap gap-1 md:gap-1.5">
                                                        {AVATAR_COLORS.slice(
                                                            0,
                                                            window.innerWidth <
                                                                768
                                                                ? 6
                                                                : AVATAR_COLORS.length,
                                                        ).map(
                                                            (color, index) => (
                                                                <button
                                                                    key={index}
                                                                    type="button"
                                                                    onClick={() =>
                                                                        setSelectedColor(
                                                                            index,
                                                                        )
                                                                    }
                                                                    className={`h-7 w-7 rounded-full border-2 transition-all md:h-8 md:w-8 ${color.bg} ${
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

                                            <div className="space-y-2 md:space-y-3">
                                                <div className="space-y-1">
                                                    <Label
                                                        htmlFor="name"
                                                        className="flex items-center gap-2 text-sm font-semibold"
                                                    >
                                                        <Users className="h-3.5 w-3.5 text-blue-500" />
                                                        Nom complet
                                                    </Label>
                                                    <Input
                                                        id="name"
                                                        name="name"
                                                        placeholder="Ex: Emma Dubois"
                                                        className="h-8 rounded-xl border-2 border-blue-200 focus:border-purple-400 focus:ring-purple-400 md:h-9"
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

                                                {/* Disabled fields in edit mode */}
                                                {editChild && (
                                                    <div className="flex items-start gap-1.5 rounded-xl border-2 border-amber-200 bg-amber-50 px-2 py-1.5 md:gap-2 md:px-3 md:py-2 dark:border-amber-800 dark:bg-amber-900/20">
                                                        <div className="shrink-0">
                                                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-white md:h-6 md:w-6">
                                                                <AlertCircle className="h-3 w-3 md:h-3.5 md:w-3.5" />
                                                            </div>
                                                        </div>
                                                        <div className="text-[11px] leading-tight font-medium text-amber-900 md:text-xs dark:text-amber-200">
                                                            Les champs "Niveau",
                                                            "Classe" et "Plan"
                                                            ne peuvent pas être
                                                            modifiés après la
                                                            création du profil.
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="space-y-1">
                                                    <Label
                                                        htmlFor="level"
                                                        className="flex items-center gap-2 text-sm font-semibold"
                                                    >
                                                        <BookOpen className="h-3.5 w-3.5 text-blue-500" />
                                                        Niveau
                                                    </Label>
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
                                                        <SelectTrigger className="h-9 rounded-xl border-2">
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

                                                <div className="space-y-1">
                                                    <Label
                                                        htmlFor="class"
                                                        className="flex items-center gap-2 text-sm font-semibold"
                                                    >
                                                        <GraduationCap className="h-3.5 w-3.5 text-purple-500" />
                                                        Classe
                                                    </Label>
                                                    <Select
                                                        name="level_id"
                                                        disabled={
                                                            !!editChild ||
                                                            availableClasses.length ===
                                                                0
                                                        }
                                                    >
                                                        <SelectTrigger className="h-8 rounded-xl border-2 md:h-9">
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

                                                <div className="space-y-1">
                                                    <Label
                                                        htmlFor="plan"
                                                        className="flex items-center gap-2 text-sm font-semibold"
                                                    >
                                                        <Star className="h-3.5 w-3.5 text-yellow-500" />
                                                        Plan à assigner
                                                    </Label>
                                                    <Select
                                                        name="purchased_plan_id"
                                                        disabled={!!editChild}
                                                    >
                                                        <SelectTrigger className="h-8 rounded-xl border-2 md:h-9">
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

                                        <DialogFooter className="gap-2 pt-2 md:gap-3 md:pt-0">
                                            <Button
                                                variant="outline"
                                                type="button"
                                                onClick={() =>
                                                    setIsDialogOpen(false)
                                                }
                                                className="h-9 rounded-2xl border-2 border-slate-300 px-4 text-sm font-semibold md:h-10 md:px-6 md:text-base"
                                            >
                                                Annuler
                                            </Button>
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                                className="h-9 rounded-2xl bg-linear-to-r from-blue-500 to-purple-600 px-4 text-sm font-bold shadow-lg hover:scale-105 hover:shadow-xl md:h-10 md:px-6 md:text-base"
                                            >
                                                {processing ? (
                                                    editChild ? (
                                                        <>
                                                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                                            Modification...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                                            Création...
                                                        </>
                                                    )
                                                ) : editChild ? (
                                                    <>
                                                        <Star className="mr-2 h-4 w-4" />
                                                        Enregistrer
                                                    </>
                                                ) : (
                                                    <>
                                                        <Sparkles className="mr-2 h-4 w-4" />
                                                        Créer le profil
                                                    </>
                                                )}
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
