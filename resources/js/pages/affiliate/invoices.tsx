import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Download, FileText } from 'lucide-react';

interface Invoice {
    id: number;
    invoice_number: string;
    period_start: string;
    period_end: string;
    total_amount: number;
    status: 'pending' | 'paid';
    paid_at: string | null;
}

interface PaginatedInvoices {
    data: Invoice[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Props {
    invoices: PaginatedInvoices;
}

export default function AffiliateInvoices({ invoices }: Props) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
        }).format(amount);
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatPeriod = (start: string, end: string) => {
        const startDate = new Date(start);
        const endDate = new Date(end);

        return `${startDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}`;
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'paid':
                return (
                    <Badge variant="default" className="bg-green-500">
                        Payée
                    </Badge>
                );
            case 'pending':
                return <Badge variant="secondary">En attente</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const downloadInvoice = (invoiceId: number) => {
        window.open(`/affiliate/invoices/${invoiceId}/download`, '_blank');
    };

    return (
        <AppLayout>
            <Head title="Mes Factures - Affiliation" />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                        Mes Factures
                    </h1>
                    <p className="mt-2 text-slate-600 dark:text-slate-400">
                        Consultez et téléchargez vos factures de commissions
                    </p>
                </div>

                {/* Stats Card */}
                <div className="grid gap-6 md:grid-cols-3">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                        Total des Factures
                                    </p>
                                    <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
                                        {invoices.total}
                                    </p>
                                </div>
                                <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/20">
                                    <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                        Factures Payées
                                    </p>
                                    <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
                                        {
                                            invoices.data.filter(
                                                (i) => i.status === 'paid',
                                            ).length
                                        }
                                    </p>
                                </div>
                                <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/20">
                                    <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                        Montant Total
                                    </p>
                                    <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
                                        {formatCurrency(
                                            invoices.data.reduce(
                                                (sum, inv) =>
                                                    sum + inv.total_amount,
                                                0,
                                            ),
                                        )}
                                    </p>
                                </div>
                                <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900/20">
                                    <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Invoices Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Historique des Factures</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {invoices.data.length === 0 ? (
                            <div className="py-12 text-center">
                                <FileText className="mx-auto h-12 w-12 text-slate-400" />
                                <h3 className="mt-4 text-lg font-medium text-slate-900 dark:text-slate-100">
                                    Aucune facture
                                </h3>
                                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                                    Vous n'avez pas encore de factures générées.
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Numéro</TableHead>
                                                <TableHead>Période</TableHead>
                                                <TableHead>Montant</TableHead>
                                                <TableHead>Statut</TableHead>
                                                <TableHead>
                                                    Date de Paiement
                                                </TableHead>
                                                <TableHead className="text-right">
                                                    Actions
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {invoices.data.map((invoice) => (
                                                <TableRow key={invoice.id}>
                                                    <TableCell className="font-medium">
                                                        {invoice.invoice_number}
                                                    </TableCell>
                                                    <TableCell>
                                                        {formatPeriod(
                                                            invoice.period_start,
                                                            invoice.period_end,
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="font-semibold">
                                                        {formatCurrency(
                                                            invoice.total_amount,
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {getStatusBadge(
                                                            invoice.status,
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {invoice.paid_at ? (
                                                            <span className="text-slate-900 dark:text-slate-100">
                                                                {formatDate(
                                                                    invoice.paid_at,
                                                                )}
                                                            </span>
                                                        ) : (
                                                            <span className="text-slate-500">
                                                                -
                                                            </span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                downloadInvoice(
                                                                    invoice.id,
                                                                )
                                                            }
                                                        >
                                                            <Download className="mr-2 h-4 w-4" />
                                                            Télécharger
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* Pagination */}
                                {invoices.last_page > 1 && (
                                    <div className="mt-4 flex items-center justify-between">
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            Page {invoices.current_page} sur{' '}
                                            {invoices.last_page}
                                        </p>
                                        <div className="flex gap-2">
                                            {invoices.current_page > 1 && (
                                                <a
                                                    href={`/affiliate/invoices?page=${invoices.current_page - 1}`}
                                                >
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                    >
                                                        Précédent
                                                    </Button>
                                                </a>
                                            )}
                                            {invoices.current_page <
                                                invoices.last_page && (
                                                <a
                                                    href={`/affiliate/invoices?page=${invoices.current_page + 1}`}
                                                >
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                    >
                                                        Suivant
                                                    </Button>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Info Card */}
                <Card>
                    <CardContent className="p-6">
                        <h3 className="mb-3 font-semibold text-slate-900 dark:text-slate-100">
                            📋 Informations sur les Factures
                        </h3>
                        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                            <li>
                                • Les factures sont générées automatiquement à
                                la fin de chaque mois
                            </li>
                            <li>
                                • Les paiements sont effectués dans les 7 jours
                                suivant la génération de la facture
                            </li>
                            <li>
                                • Un montant minimum de 50€ est requis pour
                                générer une facture
                            </li>
                            <li>
                                • Les factures peuvent être téléchargées au
                                format PDF
                            </li>
                            <li>
                                • Pour toute question, contactez notre support
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
