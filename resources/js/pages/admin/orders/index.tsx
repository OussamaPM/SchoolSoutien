import { Badge } from '@/components/ui/badge';
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
import { orders } from '@/routes/admin';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

interface Props {
    purchasedPlans: any[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Commandes',
        href: orders().url,
    },
];

export default function Index({ purchasedPlans }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestion des Commandes" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Commandes
                        </h1>
                        <p className="text-muted-foreground">
                            Gérez les commandes pour votre plateforme
                            e-éducation
                        </p>
                    </div>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableCaption>
                            Liste des commandes sur la plateforme
                        </TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Forfait</TableHead>
                                <TableHead>Montant</TableHead>
                                <TableHead>Parent</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead>Facture</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {purchasedPlans.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={7}
                                        className="py-8 text-center"
                                    >
                                        <div className="flex flex-col items-center gap-2">
                                            <p className="text-muted-foreground">
                                                Aucune commande trouvée
                                            </p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                purchasedPlans.map((plan) => (
                                    <TableRow key={plan.id}>
                                        <TableCell className="font-medium">
                                            {new Date(
                                                plan.created_at,
                                            ).toLocaleDateString('fr-FR')}
                                        </TableCell>
                                        <TableCell className="max-w-xs truncate">
                                            {plan.plan.name || '—'}
                                        </TableCell>
                                        <TableCell className="font-semibold">
                                            {plan.plan.formatted_price}
                                        </TableCell>
                                        <TableCell>
                                            {plan.user.name}
                                            <br />
                                            <span className="text-sm text-muted-foreground">
                                                {plan.user.email}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                className="mb-.5 w-full"
                                                variant={
                                                    plan.still_going
                                                        ? 'default'
                                                        : 'secondary'
                                                }
                                            >
                                                {plan.still_going
                                                    ? 'Actif'
                                                    : 'Inactif'}
                                            </Badge>
                                            <br />
                                            <span className="text-center text-sm text-muted-foreground">
                                                {plan.remaining_days} jours
                                                restants
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            -
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
