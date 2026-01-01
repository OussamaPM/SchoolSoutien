import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Building, CreditCard, Loader2, User } from 'lucide-react';
import { toast } from 'sonner';

interface Affiliate {
    id: number;
    unique_code: string;
    commission_rate: number;
    can_recommend: boolean;
    user: {
        name: string;
        email: string;
        phone: string | null;
    };
    bank_name: string | null;
    bank_account_holder: string | null;
    bank_iban: string | null;
    bank_swift: string | null;
    company_name: string | null;
    company_registration_number: string | null;
    company_tax_id: string | null;
    company_address: string | null;
}

interface Props {
    affiliate: Affiliate;
}

export default function AffiliateProfile({ affiliate }: Props) {
    const {
        data: personalData,
        setData: setPersonalData,
        put: updatePersonal,
        processing: processingPersonal,
        errors: personalErrors,
    } = useForm({
        name: affiliate.user.name,
        email: affiliate.user.email,
        phone: affiliate.user.phone || '',
    });

    const {
        data: bankData,
        setData: setBankData,
        put: updateBank,
        processing: processingBank,
        errors: bankErrors,
    } = useForm({
        bank_name: affiliate.bank_name || '',
        bank_account_holder: affiliate.bank_account_holder || '',
        bank_iban: affiliate.bank_iban || '',
        bank_swift: affiliate.bank_swift || '',
    });

    const {
        data: companyData,
        setData: setCompanyData,
        put: updateCompany,
        processing: processingCompany,
        errors: companyErrors,
    } = useForm({
        company_name: affiliate.company_name || '',
        company_registration_number:
            affiliate.company_registration_number || '',
        company_tax_id: affiliate.company_tax_id || '',
        company_address: affiliate.company_address || '',
    });

    const handlePersonalSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updatePersonal('/affiliate/profile/personal', {
            onSuccess: () => {
                toast('Profil mis à jour', {
                    description:
                        'Vos informations personnelles ont été mises à jour avec succès',
                });
            },
        });
    };

    const handleBankSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateBank('/affiliate/profile/bank', {
            onSuccess: () => {
                toast('Informations bancaires mises à jour', {
                    description:
                        'Vos coordonnées bancaires ont été mises à jour avec succès',
                });
            },
        });
    };

    const handleCompanySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateCompany('/affiliate/profile/company', {
            onSuccess: () => {
                toast('Informations société mises à jour', {
                    description:
                        'Les informations de votre société ont été mises à jour avec succès',
                });
            },
        });
    };

    return (
        <AppLayout>
            <Head title="Mon Profil - Affiliation" />

            <div className="mx-auto max-w-4xl space-y-6 p-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                        Mon Profil
                    </h1>
                    <p className="mt-2 text-slate-600 dark:text-slate-400">
                        Gérez vos informations personnelles et bancaires
                    </p>
                </div>

                {/* Info Card */}
                <Card>
                    <CardContent className="p-6">
                        <div className="grid gap-4 md:grid-cols-3">
                            <div>
                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                    Code Affilié
                                </p>
                                <p className="mt-1 font-mono text-lg font-bold text-blue-600">
                                    {affiliate.unique_code}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                    Taux de Commission
                                </p>
                                <p className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100">
                                    {affiliate.commission_rate}%
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                    Peut Recommander
                                </p>
                                <p className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100">
                                    {affiliate.can_recommend ? 'Oui' : 'Non'}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Tabs */}
                <Tabs defaultValue="personal" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="personal">
                            <User className="mr-2 h-4 w-4" />
                            Personnel
                        </TabsTrigger>
                        <TabsTrigger value="bank">
                            <CreditCard className="mr-2 h-4 w-4" />
                            Banque
                        </TabsTrigger>
                        <TabsTrigger value="company">
                            <Building className="mr-2 h-4 w-4" />
                            Société
                        </TabsTrigger>
                    </TabsList>

                    {/* Personal Information */}
                    <TabsContent value="personal">
                        <Card>
                            <CardHeader>
                                <CardTitle>Informations Personnelles</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form
                                    onSubmit={handlePersonalSubmit}
                                    className="space-y-4"
                                >
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
                                            value={personalData.name}
                                            onChange={(e) =>
                                                setPersonalData(
                                                    'name',
                                                    e.target.value,
                                                )
                                            }
                                            required
                                        />
                                        <InputError
                                            message={personalErrors.name}
                                        />
                                    </div>

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
                                            value={personalData.email}
                                            onChange={(e) =>
                                                setPersonalData(
                                                    'email',
                                                    e.target.value,
                                                )
                                            }
                                            required
                                        />
                                        <InputError
                                            message={personalErrors.email}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Téléphone</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            value={personalData.phone}
                                            onChange={(e) =>
                                                setPersonalData(
                                                    'phone',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <InputError
                                            message={personalErrors.phone}
                                        />
                                    </div>

                                    <div className="flex justify-end">
                                        <Button
                                            type="submit"
                                            disabled={processingPersonal}
                                        >
                                            {processingPersonal && (
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            )}
                                            Enregistrer
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Bank Information */}
                    <TabsContent value="bank">
                        <Card>
                            <CardHeader>
                                <CardTitle>Informations Bancaires</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form
                                    onSubmit={handleBankSubmit}
                                    className="space-y-4"
                                >
                                    <div className="space-y-2">
                                        <Label htmlFor="bank_name">
                                            Nom de la Banque{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="bank_name"
                                            type="text"
                                            value={bankData.bank_name}
                                            onChange={(e) =>
                                                setBankData(
                                                    'bank_name',
                                                    e.target.value,
                                                )
                                            }
                                            required
                                        />
                                        <InputError
                                            message={bankErrors.bank_name}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="bank_account_holder">
                                            Titulaire du Compte{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="bank_account_holder"
                                            type="text"
                                            value={bankData.bank_account_holder}
                                            onChange={(e) =>
                                                setBankData(
                                                    'bank_account_holder',
                                                    e.target.value,
                                                )
                                            }
                                            required
                                        />
                                        <InputError
                                            message={
                                                bankErrors.bank_account_holder
                                            }
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="bank_iban">
                                            IBAN{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="bank_iban"
                                            type="text"
                                            value={bankData.bank_iban}
                                            onChange={(e) =>
                                                setBankData(
                                                    'bank_iban',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="FR76 1234 5678 9012 3456 7890 123"
                                            required
                                        />
                                        <InputError
                                            message={bankErrors.bank_iban}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="bank_swift">
                                            Code SWIFT/BIC
                                        </Label>
                                        <Input
                                            id="bank_swift"
                                            type="text"
                                            value={bankData.bank_swift}
                                            onChange={(e) =>
                                                setBankData(
                                                    'bank_swift',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="BNPAFRPP"
                                        />
                                        <InputError
                                            message={bankErrors.bank_swift}
                                        />
                                    </div>

                                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/20">
                                        <p className="text-sm text-amber-800 dark:text-amber-200">
                                            💡 Ces informations sont nécessaires
                                            pour le versement de vos
                                            commissions. Elles sont sécurisées
                                            et confidentielles.
                                        </p>
                                    </div>

                                    <div className="flex justify-end">
                                        <Button
                                            type="submit"
                                            disabled={processingBank}
                                        >
                                            {processingBank && (
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            )}
                                            Enregistrer
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Company Information */}
                    <TabsContent value="company">
                        <Card>
                            <CardHeader>
                                <CardTitle>Informations Société</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form
                                    onSubmit={handleCompanySubmit}
                                    className="space-y-4"
                                >
                                    <div className="space-y-2">
                                        <Label htmlFor="company_name">
                                            Nom de la Société
                                        </Label>
                                        <Input
                                            id="company_name"
                                            type="text"
                                            value={companyData.company_name}
                                            onChange={(e) =>
                                                setCompanyData(
                                                    'company_name',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <InputError
                                            message={companyErrors.company_name}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="company_registration_number">
                                            Numéro SIRET/SIREN
                                        </Label>
                                        <Input
                                            id="company_registration_number"
                                            type="text"
                                            value={
                                                companyData.company_registration_number
                                            }
                                            onChange={(e) =>
                                                setCompanyData(
                                                    'company_registration_number',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <InputError
                                            message={
                                                companyErrors.company_registration_number
                                            }
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="company_tax_id">
                                            Numéro TVA Intracommunautaire
                                        </Label>
                                        <Input
                                            id="company_tax_id"
                                            type="text"
                                            value={companyData.company_tax_id}
                                            onChange={(e) =>
                                                setCompanyData(
                                                    'company_tax_id',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="FR12345678901"
                                        />
                                        <InputError
                                            message={
                                                companyErrors.company_tax_id
                                            }
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="company_address">
                                            Adresse de la Société
                                        </Label>
                                        <Input
                                            id="company_address"
                                            type="text"
                                            value={companyData.company_address}
                                            onChange={(e) =>
                                                setCompanyData(
                                                    'company_address',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <InputError
                                            message={
                                                companyErrors.company_address
                                            }
                                        />
                                    </div>

                                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/20">
                                        <p className="text-sm text-blue-800 dark:text-blue-200">
                                            ℹ️ Ces informations sont
                                            optionnelles mais recommandées si
                                            vous exercez en tant que société.
                                        </p>
                                    </div>

                                    <div className="flex justify-end">
                                        <Button
                                            type="submit"
                                            disabled={processingCompany}
                                        >
                                            {processingCompany && (
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            )}
                                            Enregistrer
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
