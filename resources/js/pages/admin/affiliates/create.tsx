import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Loader2, UserPlus } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Administration',
        href: '/admin',
    },
    {
        title: 'Affiliés',
        href: '/admin/affiliates',
    },
    {
        title: 'Créer',
        href: '/admin/affiliates/create',
    },
];

export default function CreateAffiliate() {
    const { data, setData, post, processing, errors } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        commission_rate: '10.00',
        can_recommend: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/affiliates', {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Créer un Affilié" />

            <div className="mx-auto max-w-3xl space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                            Créer un Affilié
                        </h1>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                            Créez un nouveau compte affilié avec accès au
                            système
                        </p>
                    </div>
                    <Link href="/admin/affiliates">
                        <Button variant="outline">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Retour
                        </Button>
                    </Link>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <UserPlus className="h-5 w-5" />
                                Informations de l'Affilié
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Personal Info */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                                    Informations Personnelles
                                </h3>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="first_name">
                                            Prénom{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="first_name"
                                            type="text"
                                            value={data.first_name}
                                            onChange={(e) =>
                                                setData(
                                                    'first_name',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Jean"
                                            required
                                        />
                                        <InputError
                                            message={errors.first_name}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="last_name">
                                            Nom{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="last_name"
                                            type="text"
                                            value={data.last_name}
                                            onChange={(e) =>
                                                setData(
                                                    'last_name',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Dupont"
                                            required
                                        />
                                        <InputError
                                            message={errors.last_name}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">
                                        Email{' '}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData('email', e.target.value)
                                        }
                                        placeholder="jean.dupont@example.com"
                                        required
                                    />
                                    <InputError message={errors.email} />
                                    <p className="text-xs text-slate-500">
                                        Un email sera envoyé avec les
                                        instructions de connexion
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Téléphone</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        value={data.phone}
                                        onChange={(e) =>
                                            setData('phone', e.target.value)
                                        }
                                        placeholder="+33 6 12 34 56 78"
                                    />
                                    <InputError message={errors.phone} />
                                </div>
                            </div>

                            {/* Commission Settings */}
                            <div className="space-y-4 border-t pt-6">
                                <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                                    Configuration des Commissions
                                </h3>

                                <div className="space-y-2">
                                    <Label htmlFor="commission_rate">
                                        Taux de Commission (%){' '}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="commission_rate"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max="100"
                                        value={data.commission_rate}
                                        onChange={(e) =>
                                            setData(
                                                'commission_rate',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="10.00"
                                        required
                                    />
                                    <InputError
                                        message={errors.commission_rate}
                                    />
                                    <p className="text-xs text-slate-500">
                                        Pourcentage de commission sur chaque
                                        vente générée par cet affilié
                                    </p>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="can_recommend"
                                        checked={data.can_recommend}
                                        onCheckedChange={(checked) =>
                                            setData(
                                                'can_recommend',
                                                checked as boolean,
                                            )
                                        }
                                    />
                                    <div className="space-y-1">
                                        <Label
                                            htmlFor="can_recommend"
                                            className="cursor-pointer font-normal"
                                        >
                                            Autoriser à recommander d'autres
                                            affiliés
                                        </Label>
                                        <p className="text-xs text-slate-500">
                                            Cet affilié pourra soumettre des
                                            demandes pour recommander de
                                            nouveaux affiliés
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Info Box */}
                            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/20">
                                <h4 className="mb-2 font-semibold text-blue-900 dark:text-blue-100">
                                    Prochaines Étapes
                                </h4>
                                <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
                                    <li>
                                        • Un compte sera créé avec un mot de
                                        passe temporaire
                                    </li>
                                    <li>
                                        • L'affilié recevra un email avec les
                                        instructions de connexion
                                    </li>
                                    <li>
                                        • Il devra compléter son onboarding
                                        (infos bancaires, société, contrat)
                                    </li>
                                    <li>
                                        • Une fois l'onboarding terminé, son
                                        compte sera activé
                                    </li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Submit Buttons */}
                    <div className="mt-6 flex justify-end gap-4">
                        <Link href="/admin/affiliates">
                            <Button
                                type="button"
                                variant="outline"
                                disabled={processing}
                            >
                                Annuler
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            {processing && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Créer l'Affilié
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
