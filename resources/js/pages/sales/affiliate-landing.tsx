import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Head, useForm } from '@inertiajs/react';
import { Check, Loader2, Star } from 'lucide-react';
import { toast } from 'sonner';

interface Plan {
    id: number;
    name: string;
    price: number;
    duration_months: number;
    features: string[];
}

interface Affiliate {
    user_name: string;
}

interface Props {
    plans: Plan[];
    affiliate_code: string;
    affiliate: Affiliate;
}

export default function AffiliateLanding({
    plans,
    affiliate_code,
    affiliate,
}: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        plan_id: plans[0]?.id || null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/sales/${affiliate_code}/signup`, {
            onSuccess: () => {
                toast('Compte créé avec succès !', {
                    description: 'Vous allez être redirigé vers le paiement',
                });
            },
        });
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
        }).format(price);
    };

    return (
        <>
            <Head
                title={`Rejoignez-nous - Recommandé par ${affiliate.user_name}`}
            />

            <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 dark:from-slate-950 dark:to-slate-900">
                {/* Header */}
                <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
                    <div className="container mx-auto px-4 py-6">
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                                Soutien Scolaire
                            </h1>
                            <Badge variant="secondary" className="text-sm">
                                Recommandé par {affiliate.user_name}
                            </Badge>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="container mx-auto px-4 py-16 text-center">
                    <div className="mx-auto max-w-3xl">
                        <h2 className="text-4xl font-bold text-slate-900 sm:text-5xl dark:text-slate-100">
                            Excellez dans vos études avec notre plateforme de
                            soutien scolaire
                        </h2>
                        <p className="mt-6 text-xl text-slate-600 dark:text-slate-400">
                            Des cours interactifs, des exercices personnalisés
                            et un suivi sur mesure pour réussir votre année
                            scolaire
                        </p>
                        <div className="mt-8 flex items-center justify-center gap-2 text-yellow-500">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className="h-6 w-6 fill-current"
                                />
                            ))}
                            <span className="ml-2 text-slate-600 dark:text-slate-400">
                                Note moyenne : 4.9/5 (2,345 avis)
                            </span>
                        </div>
                    </div>
                </section>

                {/* Plans Section */}
                <section className="container mx-auto px-4 py-16">
                    <h3 className="mb-12 text-center text-3xl font-bold text-slate-900 dark:text-slate-100">
                        Choisissez votre formule
                    </h3>
                    <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
                        {plans.map((plan) => (
                            <Card
                                key={plan.id}
                                className={`relative ${
                                    plan.duration_months === 12
                                        ? 'border-purple-500 shadow-xl ring-2 ring-purple-500'
                                        : ''
                                }`}
                            >
                                {plan.duration_months === 12 && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                        <Badge className="bg-purple-500">
                                            Le plus populaire
                                        </Badge>
                                    </div>
                                )}
                                <CardHeader className="text-center">
                                    <CardTitle className="text-2xl">
                                        {plan.name}
                                    </CardTitle>
                                    <div className="mt-4">
                                        <span className="text-4xl font-bold text-slate-900 dark:text-slate-100">
                                            {formatPrice(plan.price)}
                                        </span>
                                        <span className="text-slate-600 dark:text-slate-400">
                                            / {plan.duration_months} mois
                                        </span>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-3">
                                        {plan.features.map((feature, index) => (
                                            <li
                                                key={index}
                                                className="flex items-start gap-2"
                                            >
                                                <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                                                <span className="text-sm text-slate-600 dark:text-slate-400">
                                                    {feature}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* Signup Form */}
                <section className="container mx-auto px-4 py-16">
                    <div className="mx-auto max-w-2xl">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-center text-2xl">
                                    Créez votre compte gratuitement
                                </CardTitle>
                                <p className="text-center text-slate-600 dark:text-slate-400">
                                    Commencez votre voyage vers la réussite
                                    scolaire dès aujourd'hui
                                </p>
                            </CardHeader>
                            <CardContent>
                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-6"
                                >
                                    {/* Name */}
                                    <div className="space-y-2">
                                        <Label htmlFor="name">
                                            Nom Complet{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
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

                                    {/* Email */}
                                    <div className="space-y-2">
                                        <Label htmlFor="email">
                                            Email{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
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

                                    {/* Password */}
                                    <div className="space-y-2">
                                        <Label htmlFor="password">
                                            Mot de Passe{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            value={data.password}
                                            onChange={(e) =>
                                                setData(
                                                    'password',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="••••••••"
                                            required
                                        />
                                        <InputError message={errors.password} />
                                    </div>

                                    {/* Password Confirmation */}
                                    <div className="space-y-2">
                                        <Label htmlFor="password_confirmation">
                                            Confirmer le Mot de Passe{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="password_confirmation"
                                            type="password"
                                            value={data.password_confirmation}
                                            onChange={(e) =>
                                                setData(
                                                    'password_confirmation',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="••••••••"
                                            required
                                        />
                                        <InputError
                                            message={
                                                errors.password_confirmation
                                            }
                                        />
                                    </div>

                                    {/* Plan Selection */}
                                    <div className="space-y-2">
                                        <Label htmlFor="plan_id">
                                            Choisir une Formule{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <select
                                            id="plan_id"
                                            value={data.plan_id || ''}
                                            onChange={(e) =>
                                                setData(
                                                    'plan_id',
                                                    parseInt(e.target.value),
                                                )
                                            }
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                            required
                                        >
                                            {plans.map((plan) => (
                                                <option
                                                    key={plan.id}
                                                    value={plan.id}
                                                >
                                                    {plan.name} -{' '}
                                                    {formatPrice(plan.price)} /{' '}
                                                    {plan.duration_months} mois
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.plan_id} />
                                    </div>

                                    {/* Info Box */}
                                    <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950/20">
                                        <p className="text-sm text-green-800 dark:text-green-200">
                                            ✨ Offre spéciale : En vous
                                            inscrivant via ce lien, vous
                                            soutenez{' '}
                                            <strong>
                                                {affiliate.user_name}
                                            </strong>{' '}
                                            qui vous a recommandé notre
                                            plateforme.
                                        </p>
                                    </div>

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        size="lg"
                                        disabled={processing}
                                    >
                                        {processing && (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        )}
                                        Créer mon Compte et Continuer
                                    </Button>

                                    <p className="text-center text-xs text-slate-500">
                                        En créant un compte, vous acceptez nos
                                        conditions d'utilisation et notre
                                        politique de confidentialité
                                    </p>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Features Section */}
                <section className="container mx-auto px-4 py-16">
                    <h3 className="mb-12 text-center text-3xl font-bold text-slate-900 dark:text-slate-100">
                        Pourquoi nous choisir ?
                    </h3>
                    <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
                        <Card>
                            <CardContent className="p-6 text-center">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                                    <span className="text-3xl">📚</span>
                                </div>
                                <h4 className="mb-2 text-xl font-semibold text-slate-900 dark:text-slate-100">
                                    Contenu de Qualité
                                </h4>
                                <p className="text-slate-600 dark:text-slate-400">
                                    Des cours créés par des enseignants
                                    certifiés et adaptés au programme officiel
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6 text-center">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20">
                                    <span className="text-3xl">🎯</span>
                                </div>
                                <h4 className="mb-2 text-xl font-semibold text-slate-900 dark:text-slate-100">
                                    Apprentissage Personnalisé
                                </h4>
                                <p className="text-slate-600 dark:text-slate-400">
                                    Des exercices adaptés au niveau de chaque
                                    élève avec un suivi de progression
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6 text-center">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                                    <span className="text-3xl">💪</span>
                                </div>
                                <h4 className="mb-2 text-xl font-semibold text-slate-900 dark:text-slate-100">
                                    Résultats Garantis
                                </h4>
                                <p className="text-slate-600 dark:text-slate-400">
                                    95% de nos élèves constatent une
                                    amélioration de leurs notes en 3 mois
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t bg-white dark:bg-slate-900">
                    <div className="container mx-auto px-4 py-8 text-center text-sm text-slate-600 dark:text-slate-400">
                        <p>
                            &copy; 2024 Soutien Scolaire. Tous droits réservés.
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}
