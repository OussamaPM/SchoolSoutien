import InputError from '@/components/input-error';
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
import forfaitStore from '@/routes/parent/forfait-store';
import { Form, Link } from '@inertiajs/react';
import { Plus, User } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Props {
    data?: any[];
}

export default function ParentDashboard({ data = [] }: Props) {
    const [childProfiles, setChildProfiles] = useState(
        data.childProfiles ?? [],
    );
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [selectedProgrammeId, setSelectedProgrammeId] = useState<
        string | null
    >(null);

    const emptySlots = Math.max(1, childProfiles.length === 0 ? 3 : 1);

    const hasAvailablePlans = (data?.activeUnassignedPlans ?? []).length > 0;

    const handleAddChild = () => {
        setIsDialogOpen(true);
    };

    const handleSelectChild = (child: any) => {
        console.log('Selected child:', child.name);
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
                    {childProfiles.map((child: any) => (
                        <Card
                            key={child.id}
                            className={`group relative cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg ${
                                child.current_plan
                                    ? 'border-primary/20 bg-gradient-to-br from-primary/5 to-pink-500/5 hover:border-primary/40'
                                    : 'border-muted bg-muted/50 hover:border-muted-foreground/40'
                            }`}
                            onClick={() => handleSelectChild(child)}
                        >
                            <CardContent className="flex flex-col items-center space-y-3 p-6">
                                <div
                                    className={`relative flex h-16 w-16 items-center justify-center rounded-full transition-all duration-200 ${
                                        child.current_plan
                                            ? 'bg-gradient-to-br from-primary to-pink-500 text-white'
                                            : 'bg-muted-foreground/20 text-muted-foreground'
                                    }`}
                                >
                                    <User className="h-8 w-8" />

                                    {child.current_plan && (
                                        <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full border-2 border-white bg-green-500" />
                                    )}
                                </div>

                                <div className="space-y-1 text-center">
                                    <h3
                                        className={`font-semibold ${
                                            child.current_plan
                                                ? 'text-foreground'
                                                : 'text-muted-foreground'
                                        }`}
                                    >
                                        {child.name}
                                    </h3>

                                    <div className="space-y-1">
                                        <Badge
                                            variant={
                                                child.current_plan
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
                                        {child.current_plan && (
                                            <div className="text-xs font-medium text-primary/80">
                                                {child.current_plan.plan.name}
                                                <br />
                                                <span className="text-gray-400">
                                                    Expire le:{' '}
                                                    {new Date(
                                                        child.current_plan.expires_at,
                                                    ).toLocaleDateString()}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {!child.current_plan && (
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
                                            (c: any) => c.current_plan,
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
                                            (c: any) => !c.current_plan,
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
                                <Link
                                    as={Button}
                                    href={forfaitStore.index()}
                                    className="flex-1"
                                >
                                    Acheter un plan
                                </Link>
                                <Button variant="outline" className="flex-1">
                                    Annuler
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <Form
                            disableWhileProcessing
                            {...forfaitStore.assignChildProfile.form()}
                            onSuccess={() => {
                                toast('Enfant ajouté avec succès !');
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
                                const selectedProgramme = data.programmes.find(
                                    (p: any) =>
                                        String(p.id) === selectedProgrammeId,
                                );
                                const availableClasses =
                                    selectedProgramme?.education_levels ?? [];
                                return (
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
                                                    name="name"
                                                    placeholder="Ex: Emma Dubois"
                                                    className="col-span-3"
                                                />
                                                <InputError
                                                    message={errors.name}
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
                                                    name="programme_id"
                                                    onValueChange={(value) => {
                                                        setSelectedProgrammeId(
                                                            value,
                                                        );
                                                    }}
                                                >
                                                    <SelectTrigger className="col-span-3">
                                                        <SelectValue placeholder="Choisir un plan" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {data.programmes.map(
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

                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label
                                                    htmlFor="class"
                                                    className="text-right"
                                                >
                                                    Classe
                                                </Label>
                                                <Select
                                                    name="level_id"
                                                    disabled={
                                                        availableClasses.length ===
                                                        0
                                                    }
                                                >
                                                    <SelectTrigger className="col-span-3">
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
                                                            (classe: any) => (
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
                                                    message={errors.level_id}
                                                />
                                            </div>

                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label
                                                    htmlFor="plan"
                                                    className="text-right"
                                                >
                                                    Plan à assigner
                                                </Label>
                                                <Select name="purchased_plan_id">
                                                    <SelectTrigger className="col-span-3">
                                                        <SelectValue placeholder="Choisir un plan" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {data.activeUnassignedPlans.map(
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

                                        <DialogFooter>
                                            <Button type="submit">
                                                Créer le profil
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
