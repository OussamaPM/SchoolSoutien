import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { FormEventHandler } from 'react';

interface Plan {
    id: number;
    name: string;
    description?: string;
    price: number;
    duration_days: number;
    is_active: boolean;
}

interface Props {
    plan: Plan;
}

export default function Edit({ plan }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Administration',
            href: '/admin',
        },
        {
            title: 'Forfaits',
            href: '/admin/forfaits',
        },
        {
            title: plan.name,
            href: `/admin/forfaits/${plan.id}`,
        },
        {
            title: 'Modifier',
            href: `/admin/forfaits/${plan.id}/edit`,
        },
    ];

    const { data, setData, put, processing, errors } = useForm({
        name: plan.name,
        description: plan.description || '',
        price: plan.price.toString(),
        duration_days: plan.duration_days.toString(),
        is_active: plan.is_active,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        put(`/admin/forfaits/${plan.id}`, {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Modifier ${plan.name}`} />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/admin/forfaits">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Modifier {plan.name}
                        </h1>
                        <p className="text-muted-foreground">
                            Modifiez les informations de ce forfait
                        </p>
                    </div>
                </div>

                {/* Form */}
                <div className="max-w-2xl">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informations du forfait</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="space-y-6">
                                {/* Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nom du forfait</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        placeholder="ex: Plan Mensuel"
                                        required
                                        className={
                                            errors.name
                                                ? 'border-destructive'
                                                : ''
                                        }
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-destructive">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <Label htmlFor="description">
                                        Description (optionnel)
                                    </Label>
                                    <textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                'description',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Décrivez les avantages de ce forfait..."
                                        rows={3}
                                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                    {errors.description && (
                                        <p className="text-sm text-destructive">
                                            {errors.description}
                                        </p>
                                    )}
                                </div>

                                {/* Price */}
                                <div className="space-y-2">
                                    <Label htmlFor="price">Prix (€)</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        value={data.price}
                                        onChange={(e) =>
                                            setData('price', e.target.value)
                                        }
                                        placeholder="29.99"
                                        required
                                        className={
                                            errors.price
                                                ? 'border-destructive'
                                                : ''
                                        }
                                    />
                                    {errors.price && (
                                        <p className="text-sm text-destructive">
                                            {errors.price}
                                        </p>
                                    )}
                                </div>

                                {/* Duration */}
                                <div className="space-y-2">
                                    <Label htmlFor="duration_days">
                                        Durée en jours
                                    </Label>
                                    <Input
                                        id="duration_days"
                                        type="number"
                                        value={data.duration_days}
                                        onChange={(e) =>
                                            setData(
                                                'duration_days',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="30"
                                        required
                                        className={
                                            errors.duration_days
                                                ? 'border-destructive'
                                                : ''
                                        }
                                    />
                                    {errors.duration_days && (
                                        <p className="text-sm text-destructive">
                                            {errors.duration_days}
                                        </p>
                                    )}
                                    <p className="text-sm text-muted-foreground">
                                        Exemples: 7 jours, 30 jours, 90 jours,
                                        365 jours
                                    </p>
                                </div>

                                {/* Is Active */}
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="is_active"
                                        checked={data.is_active}
                                        onChange={(e) =>
                                            setData(
                                                'is_active',
                                                e.target.checked,
                                            )
                                        }
                                        className="h-4 w-4 rounded border-input bg-background"
                                    />
                                    <Label htmlFor="is_active">
                                        Forfait actif
                                    </Label>
                                </div>

                                {/* Submit Buttons */}
                                <div className="flex items-center gap-4 pt-4">
                                    <Button type="submit" disabled={processing}>
                                        {processing
                                            ? 'Mise à jour...'
                                            : 'Mettre à jour'}
                                    </Button>
                                    <Link href="/admin/forfaits">
                                        <Button variant="outline" type="button">
                                            Annuler
                                        </Button>
                                    </Link>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
