import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Loader2, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
    can_recommend: boolean;
}

export default function AffiliateRecommend({ can_recommend }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        candidate_name: '',
        candidate_email: '',
        candidate_phone: '',
        message: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/affiliate/recommend', {
            onSuccess: () => {
                toast('Recommandation envoyée', {
                    description:
                        'Votre recommandation a été envoyée avec succès et sera examinée par notre équipe',
                });
                reset();
            },
        });
    };

    if (!can_recommend) {
        return (
            <AppLayout>
                <Head title="Recommander un Affilié" />

                <div className="mx-auto max-w-2xl space-y-6 p-6">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                            Recommander un Affilié
                        </h1>
                        <p className="mt-2 text-slate-600 dark:text-slate-400">
                            Parrainez de nouveaux affiliés et gagnez des
                            commissions supplémentaires
                        </p>
                    </div>

                    <Card>
                        <CardContent className="p-12 text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/20">
                                <UserPlus className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                                Fonctionnalité non disponible
                            </h3>
                            <p className="mt-2 text-slate-600 dark:text-slate-400">
                                Vous n'avez pas actuellement la permission de
                                recommander de nouveaux affiliés. Contactez
                                notre équipe pour plus d'informations.
                            </p>
                            <a
                                href="/affiliate/dashboard"
                                className="mt-6 inline-block"
                            >
                                <Button variant="outline">
                                    Retour au Tableau de Bord
                                </Button>
                            </a>
                        </CardContent>
                    </Card>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <Head title="Recommander un Affilié" />

            <div className="mx-auto max-w-2xl space-y-6 p-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                        Recommander un Affilié
                    </h1>
                    <p className="mt-2 text-slate-600 dark:text-slate-400">
                        Parrainez de nouveaux affiliés et gagnez 5% sur leurs
                        commissions
                    </p>
                </div>

                {/* Info Card */}
                <Card>
                    <CardContent className="p-6">
                        <h3 className="mb-3 font-semibold text-slate-900 dark:text-slate-100">
                            💰 Comment ça marche ?
                        </h3>
                        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                            <li>
                                • Recommandez une personne que vous pensez être
                                un bon affilié
                            </li>
                            <li>• Notre équipe examine la candidature</li>
                            <li>
                                • Si approuvée, la personne devient affiliée
                            </li>
                            <li>
                                • Vous gagnez{' '}
                                <strong className="text-slate-900 dark:text-slate-100">
                                    5%
                                </strong>{' '}
                                sur toutes ses commissions, à vie !
                            </li>
                            <li>
                                • Il n'y a pas de limite au nombre de
                                recommandations
                            </li>
                        </ul>
                    </CardContent>
                </Card>

                {/* Recommendation Form */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UserPlus className="h-5 w-5" />
                            Formulaire de Recommandation
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Candidate Name */}
                            <div className="space-y-2">
                                <Label htmlFor="candidate_name">
                                    Nom du Candidat{' '}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="candidate_name"
                                    type="text"
                                    value={data.candidate_name}
                                    onChange={(e) =>
                                        setData(
                                            'candidate_name',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Jean Dupont"
                                    required
                                />
                                <InputError message={errors.candidate_name} />
                            </div>

                            {/* Candidate Email */}
                            <div className="space-y-2">
                                <Label htmlFor="candidate_email">
                                    Email du Candidat{' '}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="candidate_email"
                                    type="email"
                                    value={data.candidate_email}
                                    onChange={(e) =>
                                        setData(
                                            'candidate_email',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="jean.dupont@example.com"
                                    required
                                />
                                <InputError message={errors.candidate_email} />
                            </div>

                            {/* Candidate Phone */}
                            <div className="space-y-2">
                                <Label htmlFor="candidate_phone">
                                    Téléphone du Candidat
                                </Label>
                                <Input
                                    id="candidate_phone"
                                    type="tel"
                                    value={data.candidate_phone}
                                    onChange={(e) =>
                                        setData(
                                            'candidate_phone',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="+33 6 12 34 56 78"
                                />
                                <InputError message={errors.candidate_phone} />
                            </div>

                            {/* Message */}
                            <div className="space-y-2">
                                <Label htmlFor="message">
                                    Message{' '}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Textarea
                                    id="message"
                                    value={data.message}
                                    onChange={(e) =>
                                        setData('message', e.target.value)
                                    }
                                    placeholder="Expliquez pourquoi vous recommandez cette personne et ses qualifications..."
                                    rows={6}
                                    required
                                />
                                <InputError message={errors.message} />
                                <p className="text-xs text-slate-500">
                                    Parlez-nous de cette personne, son
                                    expérience, ses compétences en marketing,
                                    etc.
                                </p>
                            </div>

                            {/* Terms */}
                            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/20">
                                <p className="text-sm text-blue-800 dark:text-blue-200">
                                    ℹ️ En envoyant cette recommandation, vous
                                    confirmez connaître cette personne et pensez
                                    qu'elle ferait un bon affilié pour notre
                                    plateforme.
                                </p>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end gap-4">
                                <a href="/affiliate/dashboard">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        disabled={processing}
                                    >
                                        Annuler
                                    </Button>
                                </a>
                                <Button type="submit" disabled={processing}>
                                    {processing && (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    Envoyer la Recommandation
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Additional Info */}
                <Card>
                    <CardContent className="p-6">
                        <h3 className="mb-3 font-semibold text-slate-900 dark:text-slate-100">
                            🎯 Profil Idéal
                        </h3>
                        <p className="mb-3 text-sm text-slate-600 dark:text-slate-400">
                            Les meilleurs candidats affiliés ont généralement :
                        </p>
                        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                            <li>
                                • Une audience intéressée par l'éducation et le
                                soutien scolaire
                            </li>
                            <li>
                                • Une présence en ligne active (blog, réseaux
                                sociaux, chaîne YouTube, etc.)
                            </li>
                            <li>
                                • De l'expérience en marketing digital ou
                                création de contenu
                            </li>
                            <li>
                                • Une bonne réputation et éthique
                                professionnelle
                            </li>
                            <li>
                                • La motivation pour promouvoir des services
                                éducatifs de qualité
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
