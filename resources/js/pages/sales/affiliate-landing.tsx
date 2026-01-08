import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Head, useForm } from '@inertiajs/react';
import {
    BookOpen,
    Check,
    Crown,
    Gift,
    Heart,
    Loader2,
    Rocket,
    Sparkles,
    Star,
    Target,
    Trophy,
    Zap,
} from 'lucide-react';
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

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
                {/* Header */}
                <header className="border-b border-purple-200/50 bg-white/50 backdrop-blur-sm dark:border-purple-900/50 dark:bg-slate-900/50">
                    <div className="container mx-auto px-4 py-4 md:py-6">
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 md:gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg md:h-12 md:w-12">
                                    <BookOpen className="h-5 w-5 text-white md:h-6 md:w-6" />
                                </div>
                                <h1 className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-lg font-black text-transparent md:text-2xl">
                                    Soutien Scolaire
                                </h1>
                            </div>
                            <Badge className="rounded-2xl bg-gradient-to-r from-green-400 to-emerald-500 px-2 py-1.5 text-xs font-bold text-white shadow-lg md:px-4 md:py-2 md:text-sm">
                                <Gift className="mr-1 h-3 w-3 md:mr-1.5 md:h-4 md:w-4" />
                                <span className="hidden sm:inline">
                                    Recommandé par{' '}
                                </span>
                                {affiliate.user_name}
                            </Badge>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="container mx-auto px-4 py-20 text-center">
                    <div className="mx-auto max-w-4xl space-y-8">
                        <div className="flex items-center justify-center gap-3">
                            <div className="animate-bounce">
                                <Sparkles className="h-10 w-10 text-yellow-500" />
                            </div>
                            <h2 className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-5xl font-black tracking-tight text-transparent sm:text-6xl">
                                Excellez dans vos études
                            </h2>
                            <div className="animate-bounce delay-150">
                                <Trophy className="h-10 w-10 text-pink-500" />
                            </div>
                        </div>

                        <p className="flex items-center justify-center gap-2 text-xl font-semibold text-slate-600 dark:text-slate-400">
                            <Rocket className="h-6 w-6 text-purple-500" />
                            Des cours interactifs, des exercices personnalisés
                            et un suivi sur mesure pour réussir votre année
                            scolaire
                        </p>

                        <div className="mt-8 inline-flex items-center gap-2 rounded-3xl bg-gradient-to-r from-yellow-400 to-orange-400 px-8 py-4 shadow-2xl ring-4 ring-yellow-200 dark:ring-yellow-900/50">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className="h-6 w-6 fill-white text-white"
                                />
                            ))}
                            <span className="ml-2 text-lg font-bold text-white">
                                4.9/5 (2,345 avis)
                            </span>
                        </div>
                    </div>
                </section>

                {/* Plans Section */}
                <section className="container mx-auto px-4 py-16">
                    <div className="mb-12 flex items-center justify-center gap-3 text-center">
                        <Crown className="h-8 w-8 text-yellow-500" />
                        <h3 className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-4xl font-black text-transparent">
                            Choisissez votre formule
                        </h3>
                        <Sparkles className="h-8 w-8 text-pink-500" />
                    </div>
                    <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
                        {plans.map((plan, index) => {
                            const isPremium = plan.duration_months === 12;
                            const colors = [
                                {
                                    gradient: 'from-blue-400 to-blue-600',
                                    ring: 'ring-blue-400/50',
                                    badge: 'from-blue-500 to-blue-600',
                                },
                                {
                                    gradient: 'from-purple-400 to-purple-600',
                                    ring: 'ring-purple-400/50',
                                    badge: 'from-purple-500 to-purple-600',
                                },
                                {
                                    gradient: 'from-pink-400 to-pink-600',
                                    ring: 'ring-pink-400/50',
                                    badge: 'from-pink-500 to-pink-600',
                                },
                            ];
                            const color = colors[index % colors.length];

                            return (
                                <div
                                    key={plan.id}
                                    className={`group relative transition-all duration-300 ${
                                        isPremium ? 'scale-105' : ''
                                    }`}
                                >
                                    {isPremium && (
                                        <div className="absolute -top-4 left-1/2 z-10 -translate-x-1/2">
                                            <Badge className="animate-bounce rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 px-4 py-2 text-sm font-bold text-white shadow-xl ring-4 ring-yellow-200">
                                                <Star className="mr-1 h-4 w-4 fill-current" />
                                                Le plus populaire
                                            </Badge>
                                        </div>
                                    )}
                                    <Card
                                        className={`h-full rounded-3xl border-2 bg-white shadow-xl transition-all duration-500 hover:scale-105 hover:shadow-2xl dark:bg-slate-900 ${
                                            isPremium
                                                ? 'border-purple-300 ring-4 ring-purple-200 dark:border-purple-700 dark:ring-purple-900/50'
                                                : 'border-blue-200 hover:border-purple-300 dark:border-slate-800 dark:hover:border-purple-700'
                                        }`}
                                    >
                                        <CardHeader className="space-y-4 text-center">
                                            <div
                                                className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br ${color.gradient} shadow-2xl ring-4 ${color.ring}`}
                                            >
                                                <Trophy className="h-10 w-10 text-white" />
                                            </div>
                                            <CardTitle className="text-2xl font-black text-slate-900 dark:text-slate-100">
                                                {plan.name}
                                            </CardTitle>
                                            <div className="space-y-1">
                                                <div
                                                    className={`bg-gradient-to-r ${color.badge} bg-clip-text text-5xl font-black text-transparent`}
                                                >
                                                    {formatPrice(plan.price)}
                                                </div>
                                                <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                                                    pour {plan.duration_months}{' '}
                                                    mois
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <ul className="space-y-3">
                                                {plan.features.map(
                                                    (feature, idx) => (
                                                        <li
                                                            key={idx}
                                                            className="flex items-start gap-3"
                                                        >
                                                            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-500 shadow-md">
                                                                <Check className="h-4 w-4 text-white" />
                                                            </div>
                                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                                {feature}
                                                            </span>
                                                        </li>
                                                    ),
                                                )}
                                            </ul>
                                        </CardContent>
                                    </Card>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Signup Form */}
                <section className="container mx-auto px-4 py-16">
                    <div className="mx-auto max-w-2xl">
                        <Card className="rounded-3xl border-2 border-purple-200 bg-white shadow-2xl dark:border-purple-900 dark:bg-slate-900">
                            <CardHeader className="space-y-4">
                                <div className="flex items-center justify-center gap-3">
                                    <Rocket className="h-8 w-8 text-purple-500" />
                                    <CardTitle className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-3xl font-black text-transparent">
                                        Créez votre compte
                                    </CardTitle>
                                    <Sparkles className="h-8 w-8 text-pink-500" />
                                </div>
                                <p className="text-center text-lg font-semibold text-slate-600 dark:text-slate-400">
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
                                        <Label
                                            htmlFor="name"
                                            className="flex items-center gap-2 text-sm font-bold"
                                        >
                                            <Heart className="h-4 w-4 text-pink-500" />
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
                                            className="h-11 rounded-xl border-2 border-blue-200 focus:border-purple-400 focus:ring-purple-400"
                                            required
                                        />
                                        <InputError message={errors.name} />
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="email"
                                            className="flex items-center gap-2 text-sm font-bold"
                                        >
                                            <Zap className="h-4 w-4 text-yellow-500" />
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
                                            className="h-11 rounded-xl border-2 border-blue-200 focus:border-purple-400 focus:ring-purple-400"
                                            required
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    {/* Password */}
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="password"
                                            className="flex items-center gap-2 text-sm font-bold"
                                        >
                                            <Crown className="h-4 w-4 text-purple-500" />
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
                                            className="h-11 rounded-xl border-2 border-blue-200 focus:border-purple-400 focus:ring-purple-400"
                                            required
                                        />
                                        <InputError message={errors.password} />
                                    </div>

                                    {/* Password Confirmation */}
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="password_confirmation"
                                            className="flex items-center gap-2 text-sm font-bold"
                                        >
                                            <Check className="h-4 w-4 text-green-500" />
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
                                            className="h-11 rounded-xl border-2 border-blue-200 focus:border-purple-400 focus:ring-purple-400"
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
                                        <Label
                                            htmlFor="plan_id"
                                            className="flex items-center gap-2 text-sm font-bold"
                                        >
                                            <Trophy className="h-4 w-4 text-blue-500" />
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
                                            className="flex h-11 w-full rounded-xl border-2 border-blue-200 bg-background px-3 py-2 text-sm font-semibold ring-offset-background focus-visible:border-purple-400 focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
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
                                    <div className="flex items-start gap-3 rounded-2xl border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50 p-5 shadow-lg dark:border-green-700 dark:from-green-950/20 dark:to-emerald-950/20">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-500 shadow-md">
                                            <Gift className="h-5 w-5 text-white" />
                                        </div>
                                        <p className="text-sm font-semibold text-green-800 dark:text-green-200">
                                            ✨ Offre spéciale : En vous
                                            inscrivant via ce lien, vous
                                            soutenez{' '}
                                            <strong className="font-black">
                                                {affiliate.user_name}
                                            </strong>{' '}
                                            qui vous a recommandé notre
                                            plateforme.
                                        </p>
                                    </div>

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        className="w-full rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 py-6 text-lg font-bold shadow-xl shadow-purple-200 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-purple-300 dark:shadow-purple-900/30"
                                        size="lg"
                                        disabled={processing}
                                    >
                                        {processing && (
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        )}
                                        {!processing && (
                                            <Rocket className="mr-2 h-5 w-5" />
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
                    <div className="mb-12 flex items-center justify-center gap-3">
                        <Target className="h-8 w-8 text-blue-500" />
                        <h3 className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-4xl font-black text-transparent">
                            Pourquoi nous choisir ?
                        </h3>
                        <Sparkles className="h-8 w-8 text-pink-500" />
                    </div>
                    <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
                        <div className="group transition-all duration-300 hover:scale-105">
                            <Card className="h-full rounded-3xl border-2 border-blue-200 bg-white shadow-xl transition-all duration-500 hover:border-blue-300 hover:shadow-2xl dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-700">
                                <CardContent className="space-y-4 p-8 text-center">
                                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 shadow-2xl ring-4 ring-blue-400/50">
                                        <BookOpen className="h-10 w-10 text-white" />
                                    </div>
                                    <h4 className="text-2xl font-black text-slate-900 dark:text-slate-100">
                                        Contenu de Qualité
                                    </h4>
                                    <p className="text-base font-medium text-slate-600 dark:text-slate-400">
                                        Des cours créés par des enseignants
                                        certifiés et adaptés au programme
                                        officiel
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="group transition-all duration-300 hover:scale-105">
                            <Card className="h-full rounded-3xl border-2 border-purple-200 bg-white shadow-xl transition-all duration-500 hover:border-purple-300 hover:shadow-2xl dark:border-slate-800 dark:bg-slate-900 dark:hover:border-purple-700">
                                <CardContent className="space-y-4 p-8 text-center">
                                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-purple-600 shadow-2xl ring-4 ring-purple-400/50">
                                        <Target className="h-10 w-10 text-white" />
                                    </div>
                                    <h4 className="text-2xl font-black text-slate-900 dark:text-slate-100">
                                        Apprentissage Personnalisé
                                    </h4>
                                    <p className="text-base font-medium text-slate-600 dark:text-slate-400">
                                        Des exercices adaptés au niveau de
                                        chaque élève avec un suivi de
                                        progression
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="group transition-all duration-300 hover:scale-105">
                            <Card className="h-full rounded-3xl border-2 border-green-200 bg-white shadow-xl transition-all duration-500 hover:border-green-300 hover:shadow-2xl dark:border-slate-800 dark:bg-slate-900 dark:hover:border-green-700">
                                <CardContent className="space-y-4 p-8 text-center">
                                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-600 shadow-2xl ring-4 ring-green-400/50">
                                        <Trophy className="h-10 w-10 text-white" />
                                    </div>
                                    <h4 className="text-2xl font-black text-slate-900 dark:text-slate-100">
                                        Résultats Garantis
                                    </h4>
                                    <p className="text-base font-medium text-slate-600 dark:text-slate-400">
                                        95% de nos élèves constatent une
                                        amélioration de leurs notes en 3 mois
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-purple-200/50 bg-white/50 backdrop-blur-sm dark:border-purple-900/50 dark:bg-slate-900/50">
                    <div className="container mx-auto px-4 py-8 text-center">
                        <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                            &copy; 2024 Soutien Scolaire. Tous droits réservés.
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}
