import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Loader2, UserCog } from 'lucide-react';

interface Affiliate {
    id: number;
    user: {
        id: number;
        name: string;
        email: string;
        phone: string | null;
    };
    commission_rate: number;
    referral_bonus_rate: number;
    is_active: boolean;
    can_recommend: boolean;
    unique_code: string;
}

interface Props {
    affiliate: Affiliate;
}

const breadcrumbs = (affiliateId: number): BreadcrumbItem[] => [
    {
        title: 'Administration',
        href: '/admin',
    },
    {
        title: 'Affiliés',
        href: '/admin/affiliates',
    },
    {
        title: 'Modifier',
        href: `/admin/affiliates/${affiliateId}/edit`,
    },
];

export default function EditAffiliate({ affiliate }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: affiliate.user.name,
        email: affiliate.user.email,
        phone: affiliate.user.phone || '',
        commission_rate: affiliate.commission_rate.toString(),
        can_recommend: affiliate.can_recommend,
        is_active: affiliate.is_active,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/affiliates/${affiliate.id}`, {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs(affiliate.id)}>
            <Head title={`Modifier - ${affiliate.user.name}`} />

            <div className="mx-auto max-w-3xl space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                            Modifier l'Affilié
                        </h1>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                            {affiliate.user.name}
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
                                <UserCog className="h-5 w-5" />
                                Informations de l'Affilié
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Affiliate Code */}
                            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
                                <Label className="text-xs text-slate-600 uppercase dark:text-slate-400">
                                    Code Affilié
                                </Label>
                                <code className="mt-1 block font-mono text-lg font-semibold text-slate-900 dark:text-slate-100">
                                    {affiliate.unique_code}
                                </code>
                                <p className="mt-1 text-xs text-slate-500">
                                    Lien: {window.location.origin}/sales/
                                    {affiliate.unique_code}
                                </p>
                            </div>

                            {/* Personal Info */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                                    Informations Personnelles
                                </h3>

                                <div className="space-y-2">
                                    <Label htmlFor="name">
                                        Nom Complet{' '}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        placeholder="Jean Dupont"
                                        required
                                    />
                                    <InputError message={errors.name} />
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

                                <div className="flex items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-1">
                                        <Label
                                            htmlFor="can_recommend"
                                            className="font-medium"
                                        >
                                            Peut recommander d'autres affiliés
                                        </Label>
                                        <p className="text-xs text-slate-500">
                                            Autoriser cet affilié à soumettre
                                            des recommandations
                                        </p>
                                    </div>
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
                                </div>
                            </div>

                            {/* Account Status */}
                            <div className="space-y-4 border-t pt-6">
                                <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                                    Statut du Compte
                                </h3>

                                <div className="flex items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-1">
                                        <Label
                                            htmlFor="is_active"
                                            className="font-medium"
                                        >
                                            Compte Actif
                                        </Label>
                                        <p className="text-xs text-slate-500">
                                            Désactiver pour bloquer l'accès et
                                            arrêter le tracking des commissions
                                        </p>
                                    </div>
                                    <Switch
                                        id="is_active"
                                        checked={data.is_active}
                                        onCheckedChange={(checked) =>
                                            setData('is_active', checked)
                                        }
                                    />
                                </div>
                            </div>

                            {/* Warning */}
                            {!data.is_active && (
                                <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-900 dark:bg-orange-950/20">
                                    <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
                                        ⚠️ Attention: Désactiver ce compte
                                        empêchera l'affilié de se connecter et
                                        arrêtera le tracking de ses liens.
                                    </p>
                                </div>
                            )}
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
                            Enregistrer les Modifications
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
