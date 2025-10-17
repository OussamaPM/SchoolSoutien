import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import forfaits from '@/routes/admin/forfaits';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Edit, Plus, Trash2 } from 'lucide-react';

export interface Plan {
    id: number;
    name: string;
    description?: string;
    price: number;
    duration_days: number;
    is_active: boolean;
    formatted_price: string;
    formatted_duration: string;
    created_at: string;
    updated_at: string;
}

interface Props {
    plans: Plan[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Forfaits',
        href: forfaits.index().url,
    },
];

export default function Index({ plans }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestion des Forfaits" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Forfaits
                        </h1>
                        <p className="text-muted-foreground">
                            Gérez les plans d'abonnement pour votre plateforme
                            e-éducation
                        </p>
                    </div>

                    <Link href={forfaits.create()}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Nouveau Forfait
                        </Button>
                    </Link>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableCaption>
                            Liste des forfaits disponibles sur la plateforme
                        </TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nom</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Prix</TableHead>
                                <TableHead>Durée</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead>Date de création</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {plans.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={7}
                                        className="py-8 text-center"
                                    >
                                        <div className="flex flex-col items-center gap-2">
                                            <p className="text-muted-foreground">
                                                Aucun forfait trouvé
                                            </p>
                                            <Link href={forfaits.create()}>
                                                <Button variant="outline">
                                                    <Plus className="mr-2 h-4 w-4" />
                                                    Créer le premier forfait
                                                </Button>
                                            </Link>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                plans.map((plan) => (
                                    <TableRow key={plan.id}>
                                        <TableCell className="font-medium">
                                            {plan.name}
                                        </TableCell>
                                        <TableCell className="max-w-xs truncate">
                                            {plan.description || '—'}
                                        </TableCell>
                                        <TableCell className="font-semibold">
                                            {plan.formatted_price}
                                        </TableCell>
                                        <TableCell>
                                            {plan.formatted_duration}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    plan.is_active
                                                        ? 'default'
                                                        : 'secondary'
                                                }
                                            >
                                                {plan.is_active
                                                    ? 'Actif'
                                                    : 'Inactif'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {new Date(
                                                plan.created_at,
                                            ).toLocaleDateString('fr-FR')}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={forfaits.edit(
                                                        plan.id,
                                                    )}
                                                >
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-destructive"
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
        </AppLayout>
    );
}
