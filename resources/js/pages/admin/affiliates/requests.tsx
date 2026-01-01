import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    CheckCircle,
    Mail,
    Phone,
    UserCheck,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface AffiliateRequest {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string | null;
    message: string | null;
    recommended_by: {
        id: number;
        name: string;
        email: string;
    };
    created_at: string;
}

interface Props {
    requests: {
        data: AffiliateRequest[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

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
        title: 'Demandes',
        href: '/admin/affiliates/requests',
    },
];

export default function AffiliateRequests({ requests }: Props) {
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] =
        useState<AffiliateRequest | null>(null);
    const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

    const { data, setData, post, processing } = useForm({
        rejection_reason: '',
    });

    const handleApprove = (request: AffiliateRequest) => {
        if (
            !confirm(
                `Approuver la demande de ${request.first_name} ${request.last_name}?`,
            )
        ) {
            return;
        }

        router.post(
            `/admin/affiliates/requests/${request.id}/approve`,
            {},
            {
                onSuccess: () => {
                    toast.success(
                        'Demande approuvée et affilié créé avec succès',
                    );
                },
                onError: () => {
                    toast.error("Erreur lors de l'approbation");
                },
            },
        );
    };

    const handleReject = () => {
        if (!selectedRequest) return;

        router.post(
            `/admin/affiliates/requests/${selectedRequest.id}/reject`,
            { rejection_reason: data.rejection_reason },
            {
                onSuccess: () => {
                    toast.success('Demande rejetée');
                    setRejectDialogOpen(false);
                    setSelectedRequest(null);
                    setData('rejection_reason', '');
                },
                onError: () => {
                    toast.error('Erreur lors du rejet');
                },
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Demandes d'Affiliés" />

            <div className="mx-auto max-w-7xl space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                            Demandes d'Affiliés
                        </h1>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                            Gérez les demandes de recommandation d'affiliés
                        </p>
                    </div>
                    <Link href="/admin/affiliates">
                        <Button variant="outline">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Retour
                        </Button>
                    </Link>
                </div>

                {/* Stats */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                    Demandes en Attente
                                </p>
                                <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
                                    {requests.total}
                                </p>
                            </div>
                            <div className="rounded-full bg-orange-50 p-3 dark:bg-orange-950/20">
                                <UserCheck className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Requests Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Liste des Demandes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Candidat</TableHead>
                                        <TableHead>Contact</TableHead>
                                        <TableHead>Recommandé par</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead className="text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {requests.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={5}
                                                className="text-center"
                                            >
                                                <div className="py-12">
                                                    <UserCheck className="mx-auto h-12 w-12 text-slate-400" />
                                                    <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
                                                        Aucune demande en
                                                        attente
                                                    </p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        requests.data.map((request) => (
                                            <TableRow key={request.id}>
                                                <TableCell>
                                                    <div>
                                                        <p className="font-medium text-slate-900 dark:text-slate-100">
                                                            {request.first_name}{' '}
                                                            {request.last_name}
                                                        </p>
                                                        {request.message && (
                                                            <Button
                                                                variant="link"
                                                                size="sm"
                                                                className="h-auto p-0 text-xs text-blue-600"
                                                                onClick={() => {
                                                                    setSelectedRequest(
                                                                        request,
                                                                    );
                                                                    setDetailsDialogOpen(
                                                                        true,
                                                                    );
                                                                }}
                                                            >
                                                                Voir le message
                                                            </Button>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-1 text-sm">
                                                        <div className="flex items-center gap-2">
                                                            <Mail className="h-3 w-3 text-slate-400" />
                                                            <span className="text-slate-900 dark:text-slate-100">
                                                                {request.email}
                                                            </span>
                                                        </div>
                                                        {request.phone && (
                                                            <div className="flex items-center gap-2">
                                                                <Phone className="h-3 w-3 text-slate-400" />
                                                                <span className="text-slate-600 dark:text-slate-400">
                                                                    {
                                                                        request.phone
                                                                    }
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        <p className="font-medium text-slate-900 dark:text-slate-100">
                                                            {
                                                                request
                                                                    .recommended_by
                                                                    .name
                                                            }
                                                        </p>
                                                        <p className="text-xs text-slate-500">
                                                            {
                                                                request
                                                                    .recommended_by
                                                                    .email
                                                            }
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-sm text-slate-600 dark:text-slate-400">
                                                    {new Date(
                                                        request.created_at,
                                                    ).toLocaleDateString(
                                                        'fr-FR',
                                                        {
                                                            day: 'numeric',
                                                            month: 'long',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        },
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            size="sm"
                                                            onClick={() =>
                                                                handleApprove(
                                                                    request,
                                                                )
                                                            }
                                                            className="bg-green-600 hover:bg-green-700"
                                                        >
                                                            <CheckCircle className="mr-1 h-4 w-4" />
                                                            Approuver
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => {
                                                                setSelectedRequest(
                                                                    request,
                                                                );
                                                                setRejectDialogOpen(
                                                                    true,
                                                                );
                                                            }}
                                                        >
                                                            <XCircle className="mr-1 h-4 w-4" />
                                                            Refuser
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Details Dialog */}
            <Dialog
                open={detailsDialogOpen}
                onOpenChange={setDetailsDialogOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Message du Recommandeur</DialogTitle>
                    </DialogHeader>
                    {selectedRequest && (
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                    Candidat
                                </p>
                                <p className="mt-1 font-medium text-slate-900 dark:text-slate-100">
                                    {selectedRequest.first_name}{' '}
                                    {selectedRequest.last_name}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                    Message
                                </p>
                                <p className="mt-1 text-slate-900 dark:text-slate-100">
                                    {selectedRequest.message || 'Aucun message'}
                                </p>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button onClick={() => setDetailsDialogOpen(false)}>
                            Fermer
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Reject Dialog */}
            <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Refuser la Demande</DialogTitle>
                        <DialogDescription>
                            Vous êtes sur le point de refuser la demande de{' '}
                            <strong>
                                {selectedRequest?.first_name}{' '}
                                {selectedRequest?.last_name}
                            </strong>
                            . Le recommandeur sera notifié.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Raison du refus (optionnel)
                            </label>
                            <Textarea
                                placeholder="Expliquez pourquoi cette demande a été refusée..."
                                value={data.rejection_reason}
                                onChange={(e) =>
                                    setData('rejection_reason', e.target.value)
                                }
                                rows={4}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setRejectDialogOpen(false)}
                        >
                            Annuler
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleReject}
                            disabled={processing}
                        >
                            Refuser la Demande
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
