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
import {
    Calendar,
    ClipboardList,
    Construction,
    Sparkles,
    Star,
    Users,
} from 'lucide-react';
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

            <div className="flex min-h-screen flex-col bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 p-3 sm:p-6 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
                <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="animate-bounce">
                                <Sparkles className="h-6 w-6 text-yellow-500 sm:h-8 sm:w-8" />
                            </div>
                            <h1 className="bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-2xl font-black tracking-tight text-transparent sm:text-4xl">
                                Forfaits Magiques
                            </h1>
                            <div className="animate-bounce delay-150">
                                <Star className="h-6 w-6 text-pink-500 sm:h-8 sm:w-8" />
                            </div>
                        </div>
                        <p className="flex items-center gap-2 text-sm font-medium text-slate-600 sm:text-lg dark:text-slate-400">
                            <Star className="h-4 w-4 text-pink-500 sm:h-5 sm:w-5" />
                            Choisissez le forfait parfait pour votre enfant
                        </p>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                        <div className="flex items-center gap-2 rounded-2xl border-2 border-emerald-200 bg-emerald-50 px-4 py-2 shadow-sm dark:border-emerald-800 dark:bg-emerald-900/20">
                            <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500"></div>
                            <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                                Actifs
                            </span>
                            <Badge className="bg-emerald-600 text-white">
                                {activePurchasedPlans.length}
                            </Badge>
                        </div>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="rounded-2xl bg-linear-to-r from-purple-500 to-pink-600 font-bold shadow-lg hover:scale-105">
                                    <ClipboardList className="mr-2 h-4 w-4" />
                                    Voir mes forfaits
                                </Button>
                            </DialogTrigger>

                            <DialogContent className="rounded-3xl border-2 border-purple-100 sm:max-w-[700px]">
                                <DialogHeader>
                                    <DialogTitle className="flex items-center gap-2 text-2xl">
                                        <Sparkles className="h-6 w-6 text-yellow-500" />
                                        <span className="bg-linear-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text font-bold text-transparent">
                                            Forfaits achetés
                                        </span>
                                        <Star className="h-6 w-6 text-pink-500" />
                                    </DialogTitle>
                                    <DialogDescription className="text-base">
                                        📊 Aperçu de vos forfaits actifs et de
                                        leur utilisation.
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="mt-4 grid gap-4">
                                    <div className="space-y-3">
                                        <h3 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-slate-100">
                                            <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                                            Forfaits actifs
                                        </h3>
                                        {Array.isArray(activePurchasedPlans) &&
                                            activePurchasedPlans.length ===
                                                0 && (
                                                <p className="flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800">
                                                    <Construction className="h-4 w-4" />
                                                    Aucun forfait actif pour le
                                                    moment.
                                                </p>
                                            )}
                                        {Array.isArray(activePurchasedPlans) &&
                                            activePurchasedPlans.map(
                                                (p: any) => (
                                                    <div
                                                        key={p.id}
                                                        className="flex items-center justify-between rounded-2xl border-2 border-purple-100 bg-white p-4 shadow-sm transition-all hover:scale-102 hover:shadow-md dark:border-purple-900 dark:bg-slate-900"
                                                    >
                                                        <div className="space-y-1">
                                                            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100">
                                                                <Sparkles className="h-4 w-4 text-yellow-500" />
                                                                {p.plan?.name ??
                                                                    p.name}
                                                            </div>
                                                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                                                <Calendar className="h-3.5 w-3.5" />
                                                                Expire le:{' '}
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
                                                            <div className="bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-xl font-bold text-transparent">
                                                                {
                                                                    p.plan
                                                                        .formatted_price
                                                                }
                                                            </div>
                                                            <div className="flex items-center justify-end gap-2 text-sm font-medium text-slate-600 dark:text-slate-400">
                                                                <Users className="h-3.5 w-3.5" />
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
                                        <Button
                                            className="rounded-2xl border-2 border-slate-300 font-semibold"
                                            variant="outline"
                                        >
                                            Fermer
                                        </Button>
                                    </div>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {plans.length === 0 ? (
                        <div className="col-span-full">
                            <Card className="rounded-3xl border-2 border-dashed border-blue-300">
                                <CardContent className="py-16 text-center">
                                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-blue-400 to-purple-500">
                                        <Star className="h-10 w-10 text-white" />
                                    </div>
                                    <p className="flex items-center justify-center gap-2 text-lg font-semibold text-slate-600 dark:text-slate-400">
                                        <Construction className="h-5 w-5" />
                                        Aucun forfait disponible pour le moment.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    ) : (
                        plans.map((plan) => (
                            <Card
                                key={plan.id}
                                className="group flex flex-col justify-between overflow-hidden rounded-3xl border-2 border-purple-100 bg-white shadow-lg transition-all duration-300 hover:scale-105 hover:border-purple-300 hover:shadow-2xl dark:border-purple-900 dark:bg-slate-900"
                            >
                                {/* Decorative gradient top */}
                                <div className="h-2 bg-linear-to-r from-blue-400 via-purple-400 to-pink-400"></div>

                                <CardHeader className="space-y-3">
                                    <CardTitle className="flex items-center gap-2 text-2xl font-bold">
                                        <Sparkles className="h-5 w-5 text-yellow-500" />
                                        {plan.name}
                                    </CardTitle>
                                    <CardDescription className="text-base">
                                        {plan.description || '—'}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    <div className="rounded-2xl bg-linear-to-br from-blue-50 to-purple-50 p-6 dark:from-blue-950/30 dark:to-purple-950/30">
                                        <div className="flex items-baseline gap-3">
                                            <span className="bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-4xl font-black text-transparent">
                                                {plan.formatted_price}
                                            </span>
                                            <span className="text-base font-semibold text-slate-600 dark:text-slate-400">
                                                /{plan.formatted_duration}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>

                                <CardFooter className="justify-between border-t-2 border-purple-100 pt-6 dark:border-purple-900">
                                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                        <div className="h-1.5 w-1.5 rounded-full bg-slate-400"></div>
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
                                                    ' sélectionné avec succès',
                                            );
                                        }}
                                    >
                                        <Input
                                            type="hidden"
                                            name="plan_id"
                                            value={String(plan.id)}
                                        />
                                        <Button
                                            type="submit"
                                            className="rounded-2xl bg-linear-to-r from-blue-500 to-purple-600 font-bold shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                                        >
                                            🚀 S'abonner
                                        </Button>
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
