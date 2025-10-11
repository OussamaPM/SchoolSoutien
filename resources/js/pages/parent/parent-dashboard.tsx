import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
import { Plus, User } from 'lucide-react';
import { useState } from 'react';

interface ChildProfile {
    id: number;
    name: string;
    education_level: string;
    class_name: string;
    avatar: string | null;
    is_active: boolean;
    hasActiveSubscription: boolean;
    planId?: number;
    planName?: string;
}

interface NewChildForm {
    name: string;
    education_level: string;
    class_name: string;
    plan_id: string;
}

interface AvailablePlan {
    id: number;
    name: string;
    duration_months: number;
    price: number;
    description: string;
}

const educationLevels = [
    'CP',
    'CE1',
    'CE2',
    'CM1',
    'CM2', // Primaire
    '6ème',
    '5ème',
    '4ème',
    '3ème', // Collège
    '2nde',
    '1ère',
    'Terminale', // Lycée
];

const mockAvailablePlans: AvailablePlan[] = [
    // Uncomment the line below to test "no plans available" scenario
    {
        id: 1,
        name: 'Plan Mathématiques CE2',
        duration_months: 6,
        price: 29.99,
        description: 'Accès complet aux cours de maths niveau CE2',
    },
    {
        id: 2,
        name: 'Plan Français CM1',
        duration_months: 12,
        price: 49.99,
        description: 'Cours de français complets pour CM1',
    },
];

export default function ParentDashboard() {
    const [childProfiles, setChildProfiles] = useState<ChildProfile[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newChild, setNewChild] = useState<NewChildForm>({
        name: '',
        education_level: '',
        class_name: '',
        plan_id: '',
    });

    const emptySlots = Math.max(1, childProfiles.length === 0 ? 3 : 1);

    const hasAvailablePlans = mockAvailablePlans.length > 0;

    const handleAddChild = () => {
        setIsDialogOpen(true);
    };

    const handleSelectChild = (child: ChildProfile) => {
        console.log('Selected child:', child.name);
    };

    const handleCreateChild = () => {
        if (
            !newChild.name ||
            !newChild.education_level ||
            !newChild.class_name ||
            !newChild.plan_id
        ) {
            return;
        }

        const selectedPlan = mockAvailablePlans.find(
            (plan) => plan.id === parseInt(newChild.plan_id),
        );

        const newProfile: ChildProfile = {
            id: Date.now(), // Simple ID generation for demo
            name: newChild.name,
            education_level: newChild.education_level,
            class_name: newChild.class_name,
            avatar: null,
            is_active: true,
            hasActiveSubscription: true, // They have a plan assigned
            planId: selectedPlan?.id,
            planName: selectedPlan?.name,
        };

        setChildProfiles((prev) => [...prev, newProfile]);
        setNewChild({
            name: '',
            education_level: '',
            class_name: '',
            plan_id: '',
        });
        setIsDialogOpen(false);
    };

    const handleCancelDialog = () => {
        setNewChild({
            name: '',
            education_level: '',
            class_name: '',
            plan_id: '',
        });
        setIsDialogOpen(false);
    };

    const handleBuyPlan = () => {
        console.log('Redirecting to buy plans...');
        setIsDialogOpen(false);
    };

    return (
        <>
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold tracking-tight">
                        {childProfiles.length === 0
                            ? 'Commencez par ajouter le profil de votre enfant'
                            : "Sélectionnez un profil enfant pour commencer l'apprentissage"}
                    </h1>
                </div>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
                    {childProfiles.map((child) => (
                        <Card
                            key={child.id}
                            className={`group relative cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg ${
                                child.hasActiveSubscription
                                    ? 'border-primary/20 bg-gradient-to-br from-primary/5 to-pink-500/5 hover:border-primary/40'
                                    : 'border-muted bg-muted/50 hover:border-muted-foreground/40'
                            }`}
                            onClick={() => handleSelectChild(child)}
                        >
                            <CardContent className="flex flex-col items-center space-y-3 p-6">
                                <div
                                    className={`relative flex h-16 w-16 items-center justify-center rounded-full transition-all duration-200 ${
                                        child.hasActiveSubscription
                                            ? 'bg-gradient-to-br from-primary to-pink-500 text-white'
                                            : 'bg-muted-foreground/20 text-muted-foreground'
                                    }`}
                                >
                                    <User className="h-8 w-8" />

                                    {child.hasActiveSubscription && (
                                        <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full border-2 border-white bg-green-500" />
                                    )}
                                </div>

                                <div className="space-y-1 text-center">
                                    <h3
                                        className={`font-semibold ${
                                            child.hasActiveSubscription
                                                ? 'text-foreground'
                                                : 'text-muted-foreground'
                                        }`}
                                    >
                                        {child.name}
                                    </h3>

                                    <div className="space-y-1">
                                        <Badge
                                            variant={
                                                child.hasActiveSubscription
                                                    ? 'default'
                                                    : 'secondary'
                                            }
                                            className="text-xs"
                                        >
                                            {child.education_level}
                                        </Badge>
                                        <div className="text-xs text-muted-foreground">
                                            {child.class_name}
                                        </div>
                                        {child.planName && (
                                            <div className="text-xs font-medium text-primary/80">
                                                {child.planName}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {!child.hasActiveSubscription && (
                                    <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-muted/80">
                                        <Badge
                                            variant="outline"
                                            className="text-xs"
                                        >
                                            Abonnement requis
                                        </Badge>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}

                    {Array.from({ length: emptySlots }).map((_, index) => (
                        <Card
                            key={`empty-${index}`}
                            className="group relative cursor-pointer border-2 border-dashed border-muted-foreground/30 bg-muted/20 transition-all duration-200 hover:scale-105 hover:border-primary/50 hover:bg-primary/5"
                            onClick={handleAddChild}
                        >
                            <CardContent className="flex h-full flex-col items-center justify-center space-y-3 p-6">
                                {/* Add Profile Icon */}
                                <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-muted-foreground/10 transition-all duration-200 group-hover:bg-primary/20">
                                    <Plus className="h-8 w-8 text-muted-foreground group-hover:text-primary" />
                                </div>

                                <div className="space-y-1 text-center">
                                    <h3 className="text-sm font-medium text-muted-foreground group-hover:text-primary">
                                        Ajouter un enfant
                                    </h3>
                                    <Badge
                                        variant="outline"
                                        className="text-xs"
                                    >
                                        Nouveau profil
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Quick Stats - Only show if there are profiles */}
                {childProfiles.length > 0 && (
                    <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center space-x-2">
                                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                                    <span className="text-sm font-medium">
                                        Profils actifs
                                    </span>
                                </div>
                                <p className="mt-2 text-2xl font-bold">
                                    {
                                        childProfiles.filter(
                                            (c) => c.hasActiveSubscription,
                                        ).length
                                    }
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center space-x-2">
                                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                                    <span className="text-sm font-medium">
                                        Sans abonnement
                                    </span>
                                </div>
                                <p className="mt-2 text-2xl font-bold">
                                    {
                                        childProfiles.filter(
                                            (c) => !c.hasActiveSubscription,
                                        ).length
                                    }
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center space-x-2">
                                    <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                                    <span className="text-sm font-medium">
                                        Total enfants
                                    </span>
                                </div>
                                <p className="mt-2 text-2xl font-bold">
                                    {childProfiles.length}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="mt-6 flex gap-4">
                    <Button
                        onClick={handleAddChild}
                        className="flex-1 md:flex-none"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Ajouter un enfant
                    </Button>
                    {childProfiles.length > 0 && (
                        <Button
                            variant="outline"
                            className="flex-1 md:flex-none"
                        >
                            Gérer les abonnements
                        </Button>
                    )}
                </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Ajouter un profil enfant</DialogTitle>
                        <DialogDescription>
                            {hasAvailablePlans
                                ? "Remplissez les informations de votre enfant et choisissez un plan pour créer son profil d'apprentissage."
                                : "Vous devez d'abord acheter un plan pour pouvoir créer un profil enfant."}
                        </DialogDescription>
                    </DialogHeader>

                    {!hasAvailablePlans ? (
                        // No plans available - show buy plan section
                        <div className="space-y-4 py-6 text-center">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
                                <Plus className="h-8 w-8 text-yellow-600" />
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
                                <Button
                                    onClick={handleBuyPlan}
                                    className="flex-1"
                                >
                                    Acheter un plan
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={handleCancelDialog}
                                    className="flex-1"
                                >
                                    Annuler
                                </Button>
                            </div>
                        </div>
                    ) : (
                        // Has plans available - show child creation form
                        <>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                        htmlFor="name"
                                        className="text-right"
                                    >
                                        Nom complet
                                    </Label>
                                    <Input
                                        id="name"
                                        value={newChild.name}
                                        onChange={(e) =>
                                            setNewChild((prev) => ({
                                                ...prev,
                                                name: e.target.value,
                                            }))
                                        }
                                        placeholder="Ex: Emma Dubois"
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                        htmlFor="level"
                                        className="text-right"
                                    >
                                        Niveau
                                    </Label>
                                    <Select
                                        value={newChild.education_level}
                                        onValueChange={(value) =>
                                            setNewChild((prev) => ({
                                                ...prev,
                                                education_level: value,
                                            }))
                                        }
                                    >
                                        <SelectTrigger className="col-span-3">
                                            <SelectValue placeholder="Sélectionner le niveau" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {educationLevels.map((level) => (
                                                <SelectItem
                                                    key={level}
                                                    value={level}
                                                >
                                                    {level}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                        htmlFor="class"
                                        className="text-right"
                                    >
                                        Classe
                                    </Label>
                                    <Input
                                        id="class"
                                        value={newChild.class_name}
                                        onChange={(e) =>
                                            setNewChild((prev) => ({
                                                ...prev,
                                                class_name: e.target.value,
                                            }))
                                        }
                                        placeholder="Ex: CE2 A, CM1 B"
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                        htmlFor="plan"
                                        className="text-right"
                                    >
                                        Plan à assigner
                                    </Label>
                                    <Select
                                        value={newChild.plan_id}
                                        onValueChange={(value) =>
                                            setNewChild((prev) => ({
                                                ...prev,
                                                plan_id: value,
                                            }))
                                        }
                                    >
                                        <SelectTrigger className="col-span-3">
                                            <SelectValue placeholder="Choisir un plan" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {mockAvailablePlans.map((plan) => (
                                                <SelectItem
                                                    key={plan.id}
                                                    value={plan.id.toString()}
                                                >
                                                    <div className="flex flex-col items-start">
                                                        <span className="font-medium">
                                                            {plan.name}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {
                                                                plan.duration_months
                                                            }{' '}
                                                            mois - {plan.price}€
                                                        </span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    onClick={handleCancelDialog}
                                >
                                    Annuler
                                </Button>
                                <Button
                                    onClick={handleCreateChild}
                                    disabled={
                                        !newChild.name ||
                                        !newChild.education_level ||
                                        !newChild.class_name ||
                                        !newChild.plan_id
                                    }
                                >
                                    Créer le profil
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
