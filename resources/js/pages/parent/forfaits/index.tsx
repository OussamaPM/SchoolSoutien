import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type Plan } from '@/pages/admin/forfaits';
import forfaitStore from '@/routes/parent/forfait-store';
import { type BreadcrumbItem } from '@/types';
import { Form, Head } from '@inertiajs/react';
import { toast } from 'sonner';

interface Props {
    plans: Plan[];
    activePurchasedPlans?: any;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Forfaits',
        href: forfaitStore.index().url,
    },
];

export default function Index({ plans, activePurchasedPlans }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Boutique" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Forfaits
                        </h1>
                        <p className="text-muted-foreground">
                            Choisissez un forfait adapté à vos enfants
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                                Actifs
                            </span>
                            <Badge>{activePurchasedPlans.length}</Badge>
                        </div>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="ghost">
                                    Voir mes forfaits
                                </Button>
                            </DialogTrigger>

                            <DialogContent className="sm:max-w-[640px]">
                                <DialogHeader>
                                    <DialogTitle>Forfaits achetés</DialogTitle>
                                    <DialogDescription>
                                        Aperçu compact de vos forfaits achetés.
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="mt-4 grid gap-3">
                                    <div>
                                        <h3 className="text-sm font-medium">
                                            Actifs
                                        </h3>
                                        {Array.isArray(activePurchasedPlans) &&
                                            activePurchasedPlans.length ===
                                                0 && (
                                                <p className="text-sm text-muted-foreground">
                                                    Aucun forfait actif.
                                                </p>
                                            )}
                                        {Array.isArray(activePurchasedPlans) &&
                                            activePurchasedPlans.map(
                                                (p: any) => (
                                                    <div
                                                        key={p.id}
                                                        className="m-2 flex items-center justify-between rounded-md border p-3"
                                                    >
                                                        <div>
                                                            <div className="font-medium">
                                                                {p.plan?.name ??
                                                                    p.name}
                                                            </div>
                                                            <div className="text-sm text-muted-foreground">
                                                                Expires:{' '}
                                                                {p.expires_at
                                                                    ? new Date(
                                                                          p.expires_at,
                                                                      ).toLocaleDateString(
                                                                          'fr-FR',
                                                                      )
                                                                    : '—'}
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="font-semibold">
                                                                {
                                                                    p.plan
                                                                        .formatted_price
                                                                }
                                                            </div>
                                                            <div className="text-sm text-muted-foreground">
                                                                Enfant:{' '}
                                                                {p.child_profile
                                                                    ? p
                                                                          .child_profile
                                                                          .name
                                                                    : 'Non assigné'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ),
                                            )}
                                    </div>
                                </div>

                                <DialogFooter>
                                    <div className="flex justify-end">
                                        <Button variant="ghost">Fermer</Button>
                                    </div>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {plans.length === 0 ? (
                        <div className="col-span-full">
                            <Card>
                                <CardContent className="py-10 text-center">
                                    <p className="text-muted-foreground">
                                        Aucun forfait disponible pour le moment.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    ) : (
                        plans.map((plan) => (
                            <Card
                                key={plan.id}
                                className="flex flex-col justify-between"
                            >
                                <CardHeader>
                                    <CardTitle className="text-lg">
                                        {plan.name}
                                    </CardTitle>
                                    <CardDescription>
                                        {plan.description || '—'}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent>
                                    <div className="flex items-baseline gap-3">
                                        <span className="text-3xl font-bold">
                                            {plan.formatted_price}
                                        </span>
                                        <span className="text-sm text-muted-foreground">
                                            /{plan.formatted_duration}
                                        </span>
                                    </div>
                                </CardContent>

                                <CardFooter className="justify-between">
                                    <div className="text-sm text-muted-foreground">
                                        {new Date(
                                            plan.created_at,
                                        ).toLocaleDateString('fr-FR')}
                                    </div>

                                    <Form
                                        disableWhileProcessing
                                        {...forfaitStore.store.form()}
                                        className="flex items-center gap-2"
                                        onSuccess={() => {
                                            toast(
                                                'Forfait ' +
                                                    plan.name +
                                                    ' sélectionné',
                                            );
                                        }}
                                    >
                                        <Input
                                            type="hidden"
                                            name="plan_id"
                                            value={String(plan.id)}
                                        />
                                        <Button type="submit">S'abonner</Button>
                                    </Form>
                                </CardFooter>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
