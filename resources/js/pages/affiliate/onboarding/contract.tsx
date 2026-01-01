import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { FileSignature, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface Affiliate {
    id: number;
    user_name: string;
    company_name: string | null;
}

interface Props {
    affiliate: Affiliate;
}

export default function AffiliateContract({ affiliate }: Props) {
    const [agreed, setAgreed] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        signature: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!agreed) {
            return;
        }
        post('/affiliate/onboarding/contract/sign');
    };

    return (
        <AppLayout>
            <Head title="Contrat d'Affiliation" />

            <div className="mx-auto max-w-4xl space-y-6 p-6">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                        Contrat d'Affiliation
                    </h1>
                    <p className="mt-2 text-slate-600 dark:text-slate-400">
                        Veuillez lire attentivement le contrat avant de signer
                    </p>
                </div>

                {/* Contract Content */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Contrat d'Affiliation - Soutien Scolaire
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="max-h-96 space-y-4 overflow-y-auto text-sm">
                        <section>
                            <h3 className="mb-2 font-semibold text-slate-900 dark:text-slate-100">
                                Article 1 - Objet
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                Le présent contrat a pour objet de définir les
                                conditions dans lesquelles{' '}
                                <strong>
                                    {affiliate.company_name ||
                                        affiliate.user_name}
                                </strong>{' '}
                                (ci-après "l'Affilié") accepte de promouvoir les
                                services de la plateforme de soutien scolaire
                                (ci-après "la Plateforme") moyennant une
                                commission sur les ventes générées.
                            </p>
                        </section>

                        <section>
                            <h3 className="mb-2 font-semibold text-slate-900 dark:text-slate-100">
                                Article 2 - Obligations de l'Affilié
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                L'Affilié s'engage à :
                            </p>
                            <ul className="ml-6 list-disc space-y-1 text-slate-600 dark:text-slate-400">
                                <li>
                                    Promouvoir les services de la Plateforme de
                                    manière loyale et éthique
                                </li>
                                <li>
                                    Utiliser uniquement les liens d'affiliation
                                    fournis par la Plateforme
                                </li>
                                <li>
                                    Ne pas utiliser de techniques de promotion
                                    trompeuses ou contraires aux bonnes mœurs
                                </li>
                                <li>
                                    Respecter l'image de marque de la Plateforme
                                </li>
                                <li>
                                    Ne pas usurper l'identité de la Plateforme
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h3 className="mb-2 font-semibold text-slate-900 dark:text-slate-100">
                                Article 3 - Commissions
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                L'Affilié percevra une commission sur chaque
                                vente générée via son lien d'affiliation. Le
                                taux de commission est défini dans l'espace
                                personnel de l'Affilié et peut être modifié par
                                la Plateforme avec un préavis de 30 jours.
                            </p>
                            <p className="mt-2 text-slate-600 dark:text-slate-400">
                                Les commissions sont calculées sur le montant HT
                                de chaque transaction et sont versées
                                mensuellement, sous réserve d'un montant minimum
                                de 50€.
                            </p>
                        </section>

                        <section>
                            <h3 className="mb-2 font-semibold text-slate-900 dark:text-slate-100">
                                Article 4 - Attribution et Cookie
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                Un client est attribué de façon permanente à
                                l'Affilié dès lors qu'il :
                            </p>
                            <ul className="ml-6 list-disc space-y-1 text-slate-600 dark:text-slate-400">
                                <li>
                                    Clique sur le lien d'affiliation de
                                    l'Affilié
                                </li>
                                <li>Crée un compte sur la Plateforme</li>
                                <li>Effectue un achat</li>
                            </ul>
                            <p className="mt-2 text-slate-600 dark:text-slate-400">
                                Cette attribution est définitive et toutes les
                                transactions futures de ce client génèreront des
                                commissions pour l'Affilié.
                            </p>
                        </section>

                        <section>
                            <h3 className="mb-2 font-semibold text-slate-900 dark:text-slate-100">
                                Article 5 - Paiement
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                Les paiements sont effectués mensuellement par
                                virement bancaire sur le compte fourni par
                                l'Affilié. Une facture est générée
                                automatiquement pour chaque paiement.
                            </p>
                        </section>

                        <section>
                            <h3 className="mb-2 font-semibold text-slate-900 dark:text-slate-100">
                                Article 6 - Résiliation
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                Le présent contrat peut être résilié par l'une
                                ou l'autre des parties avec un préavis de 30
                                jours. En cas de manquement grave aux
                                obligations, la Plateforme peut résilier le
                                contrat sans préavis.
                            </p>
                        </section>

                        <section>
                            <h3 className="mb-2 font-semibold text-slate-900 dark:text-slate-100">
                                Article 7 - Données Personnelles
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                Les données personnelles de l'Affilié sont
                                traitées conformément au RGPD et à notre
                                politique de confidentialité. L'Affilié dispose
                                d'un droit d'accès, de rectification et de
                                suppression de ses données.
                            </p>
                        </section>

                        <section>
                            <h3 className="mb-2 font-semibold text-slate-900 dark:text-slate-100">
                                Article 8 - Loi Applicable
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                Le présent contrat est soumis au droit français.
                                Tout litige sera de la compétence exclusive des
                                tribunaux français.
                            </p>
                        </section>
                    </CardContent>
                </Card>

                {/* Signature Form */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileSignature className="h-5 w-5" />
                            Signature Électronique
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Agreement Checkbox */}
                            <div className="flex items-start space-x-3 rounded-lg border p-4">
                                <Checkbox
                                    id="agree"
                                    checked={agreed}
                                    onCheckedChange={(c) => setAgreed(!!c)}
                                />
                                <div className="space-y-1">
                                    <Label
                                        htmlFor="agree"
                                        className="cursor-pointer text-sm leading-none font-medium"
                                    >
                                        J'ai lu et j'accepte les termes du
                                        contrat d'affiliation
                                    </Label>
                                    <p className="text-xs text-slate-500">
                                        En cochant cette case, vous acceptez
                                        d'être lié par les termes de ce contrat
                                    </p>
                                </div>
                            </div>

                            {/* Signature Input */}
                            <div className="space-y-2">
                                <Label htmlFor="signature">
                                    Votre Signature{' '}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="signature"
                                    type="text"
                                    value={data.signature}
                                    onChange={(e) =>
                                        setData('signature', e.target.value)
                                    }
                                    placeholder="Tapez votre nom complet"
                                    disabled={!agreed}
                                    required
                                />
                                <InputError message={errors.signature} />
                                <p className="text-xs text-slate-500">
                                    Votre signature électronique a la même
                                    valeur juridique qu'une signature manuscrite
                                </p>
                            </div>

                            {/* Info Box */}
                            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/20">
                                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                    📅 Date de signature :{' '}
                                    {new Date().toLocaleDateString('fr-FR')}
                                </p>
                                <p className="mt-1 text-sm text-blue-800 dark:text-blue-200">
                                    Signataire : {affiliate.user_name}
                                    {affiliate.company_name &&
                                        ` - ${affiliate.company_name}`}
                                </p>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end gap-4">
                                <a href="/affiliate/onboarding">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        disabled={processing}
                                    >
                                        Retour
                                    </Button>
                                </a>
                                <Button
                                    type="submit"
                                    disabled={!agreed || processing}
                                >
                                    {processing && (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    Signer le Contrat
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
