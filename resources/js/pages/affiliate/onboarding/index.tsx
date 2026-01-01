import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import {
    Building2,
    CheckCircle,
    CreditCard,
    FileSignature,
    Loader2,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Affiliate {
    id: number;
    has_bank_info: boolean;
    has_company_info: boolean;
    contract_signed: boolean;
    bank_name: string | null;
    account_holder_name: string | null;
    iban: string | null;
    swift_bic: string | null;
    company_name: string | null;
    company_registration: string | null;
    tax_id: string | null;
    company_address: string | null;
}

interface Props {
    affiliate: Affiliate;
}

type Step = 'bank' | 'company' | 'contract';

export default function AffiliateOnboarding({ affiliate }: Props) {
    const [currentStep, setCurrentStep] = useState<Step>(
        !affiliate.has_bank_info
            ? 'bank'
            : !affiliate.has_company_info
              ? 'company'
              : 'contract',
    );

    const bankForm = useForm({
        bank_name: affiliate.bank_name || '',
        account_holder_name: affiliate.account_holder_name || '',
        iban: affiliate.iban || '',
        swift_bic: affiliate.swift_bic || '',
    });

    const companyForm = useForm({
        company_name: affiliate.company_name || '',
        company_registration: affiliate.company_registration || '',
        tax_id: affiliate.tax_id || '',
        company_address: affiliate.company_address || '',
    });

    const handleBankSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        bankForm.post('/affiliate/onboarding/bank-info', {
            onSuccess: () => {
                toast.success('Informations bancaires enregistrées');
                setCurrentStep('company');
            },
        });
    };

    const handleCompanySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        companyForm.post('/affiliate/onboarding/company-info', {
            onSuccess: () => {
                toast.success('Informations de société enregistrées');
                setCurrentStep('contract');
            },
        });
    };

    const steps = [
        {
            id: 'bank' as Step,
            title: 'Informations Bancaires',
            icon: CreditCard,
            completed: affiliate.has_bank_info,
        },
        {
            id: 'company' as Step,
            title: 'Informations Société',
            icon: Building2,
            completed: affiliate.has_company_info,
        },
        {
            id: 'contract' as Step,
            title: 'Contrat',
            icon: FileSignature,
            completed: affiliate.contract_signed,
        },
    ];

    return (
        <AppLayout>
            <Head title="Configuration du Compte Affilié" />

            <div className="mx-auto max-w-4xl space-y-8 p-6">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                        Bienvenue dans votre Espace Affilié
                    </h1>
                    <p className="mt-2 text-slate-600 dark:text-slate-400">
                        Complétez votre profil en 3 étapes pour commencer à
                        gagner des commissions
                    </p>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-between">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        const isActive = currentStep === step.id;
                        const isCompleted = step.completed;

                        return (
                            <div
                                key={step.id}
                                className="flex flex-1 items-center"
                            >
                                <div className="flex flex-col items-center">
                                    <button
                                        onClick={() => setCurrentStep(step.id)}
                                        disabled={!isCompleted && !isActive}
                                        className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all ${
                                            isCompleted
                                                ? 'border-green-500 bg-green-500 text-white'
                                                : isActive
                                                  ? 'border-purple-500 bg-purple-500 text-white'
                                                  : 'border-slate-300 bg-white text-slate-400 dark:border-slate-700 dark:bg-slate-800'
                                        }`}
                                    >
                                        {isCompleted ? (
                                            <CheckCircle className="h-6 w-6" />
                                        ) : (
                                            <Icon className="h-6 w-6" />
                                        )}
                                    </button>
                                    <p
                                        className={`mt-2 text-sm font-medium ${
                                            isActive || isCompleted
                                                ? 'text-slate-900 dark:text-slate-100'
                                                : 'text-slate-500'
                                        }`}
                                    >
                                        {step.title}
                                    </p>
                                </div>
                                {index < steps.length - 1 && (
                                    <div
                                        className={`mx-4 h-0.5 flex-1 ${
                                            steps[index + 1].completed
                                                ? 'bg-green-500'
                                                : 'bg-slate-200 dark:bg-slate-700'
                                        }`}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Step Content */}
                {currentStep === 'bank' && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5" />
                                Informations Bancaires
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form
                                onSubmit={handleBankSubmit}
                                className="space-y-4"
                            >
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    Ces informations sont nécessaires pour le
                                    versement de vos commissions.
                                </p>

                                <div className="space-y-2">
                                    <Label htmlFor="bank_name">
                                        Nom de la Banque{' '}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="bank_name"
                                        value={bankForm.data.bank_name}
                                        onChange={(e) =>
                                            bankForm.setData(
                                                'bank_name',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Crédit Agricole"
                                        required
                                    />
                                    <InputError
                                        message={bankForm.errors.bank_name}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="account_holder_name">
                                        Titulaire du Compte{' '}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="account_holder_name"
                                        value={
                                            bankForm.data.account_holder_name
                                        }
                                        onChange={(e) =>
                                            bankForm.setData(
                                                'account_holder_name',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Jean Dupont"
                                        required
                                    />
                                    <InputError
                                        message={
                                            bankForm.errors.account_holder_name
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="iban">
                                        IBAN{' '}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="iban"
                                        value={bankForm.data.iban}
                                        onChange={(e) =>
                                            bankForm.setData(
                                                'iban',
                                                e.target.value.toUpperCase(),
                                            )
                                        }
                                        placeholder="FR76 1234 5678 9012 3456 7890 123"
                                        maxLength={34}
                                        required
                                    />
                                    <InputError
                                        message={bankForm.errors.iban}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="swift_bic">
                                        Code SWIFT/BIC
                                    </Label>
                                    <Input
                                        id="swift_bic"
                                        value={bankForm.data.swift_bic}
                                        onChange={(e) =>
                                            bankForm.setData(
                                                'swift_bic',
                                                e.target.value.toUpperCase(),
                                            )
                                        }
                                        placeholder="BNPAFRPP"
                                        maxLength={11}
                                    />
                                    <InputError
                                        message={bankForm.errors.swift_bic}
                                    />
                                </div>

                                <div className="flex justify-end pt-4">
                                    <Button
                                        type="submit"
                                        disabled={bankForm.processing}
                                    >
                                        {bankForm.processing && (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        )}
                                        Continuer
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {currentStep === 'company' && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Building2 className="h-5 w-5" />
                                Informations Société
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form
                                onSubmit={handleCompanySubmit}
                                className="space-y-4"
                            >
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    Renseignez les informations de votre société
                                    ou activité professionnelle.
                                </p>

                                <div className="space-y-2">
                                    <Label htmlFor="company_name">
                                        Nom de la Société{' '}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="company_name"
                                        value={companyForm.data.company_name}
                                        onChange={(e) =>
                                            companyForm.setData(
                                                'company_name',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="SARL MonEntreprise"
                                        required
                                    />
                                    <InputError
                                        message={
                                            companyForm.errors.company_name
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="company_registration">
                                        Numéro SIRET/SIREN
                                    </Label>
                                    <Input
                                        id="company_registration"
                                        value={
                                            companyForm.data
                                                .company_registration
                                        }
                                        onChange={(e) =>
                                            companyForm.setData(
                                                'company_registration',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="123 456 789 00010"
                                    />
                                    <InputError
                                        message={
                                            companyForm.errors
                                                .company_registration
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tax_id">
                                        Numéro TVA Intracommunautaire
                                    </Label>
                                    <Input
                                        id="tax_id"
                                        value={companyForm.data.tax_id}
                                        onChange={(e) =>
                                            companyForm.setData(
                                                'tax_id',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="FR12345678901"
                                    />
                                    <InputError
                                        message={companyForm.errors.tax_id}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="company_address">
                                        Adresse{' '}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Textarea
                                        id="company_address"
                                        value={companyForm.data.company_address}
                                        onChange={(e) =>
                                            companyForm.setData(
                                                'company_address',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="123 Rue Exemple&#10;75001 Paris&#10;France"
                                        rows={4}
                                        required
                                    />
                                    <InputError
                                        message={
                                            companyForm.errors.company_address
                                        }
                                    />
                                </div>

                                <div className="flex justify-between pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setCurrentStep('bank')}
                                    >
                                        Retour
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={companyForm.processing}
                                    >
                                        {companyForm.processing && (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        )}
                                        Continuer
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {currentStep === 'contract' && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileSignature className="h-5 w-5" />
                                Signature du Contrat
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    La dernière étape consiste à lire et signer
                                    le contrat d'affiliation.
                                </p>

                                <a href="/affiliate/onboarding/contract">
                                    <Button className="w-full">
                                        <FileSignature className="mr-2 h-4 w-4" />
                                        Lire et Signer le Contrat
                                    </Button>
                                </a>

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setCurrentStep('company')}
                                    className="w-full"
                                >
                                    Retour
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
