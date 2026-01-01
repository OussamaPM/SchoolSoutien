import { Badge } from '@/components/ui/badge';
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
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {
    CheckCircle,
    Copy,
    Edit,
    ExternalLink,
    Plus,
    Search,
    Trash2,
    TrendingUp,
    Users,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Affiliate {
    id: number;
    user: {
        id: number;
        name: string;
        email: string;
        phone: string | null;
    };
    unique_code: string;
    commission_rate: number;
    referral_bonus_rate: number;
    is_active: boolean;
    can_recommend: boolean;
    onboarding_complete: boolean;
    total_clicks: number;
    total_conversions: number;
    total_commissions: number;
    recommended_by: {
        id: number;
        name: string;
    } | null;
    created_at: string;
}

interface Props {
    affiliates: {
        data: Affiliate[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters: {
        search?: string;
        status?: string;
    };
    pendingRequestsCount: number;
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
];

export default function AffiliatesIndex({
    affiliates,
    filters,
    pendingRequestsCount,
}: Props) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [affiliateToDelete, setAffiliateToDelete] =
        useState<Affiliate | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/admin/affiliates',
            {
                search: searchQuery,
                status: statusFilter !== 'all' ? statusFilter : undefined,
            },
            { preserveState: true },
        );
    };

    const handleStatusFilter = (value: string) => {
        setStatusFilter(value);
        router.get(
            '/admin/affiliates',
            {
                search: searchQuery || undefined,
                status: value !== 'all' ? value : undefined,
            },
            { preserveState: true },
        );
    };

    const copyAffiliateLink = (code: string) => {
        const link = `${window.location.origin}/sales/${code}`;
        navigator.clipboard.writeText(link);
        toast.success('Lien copié dans le presse-papiers');
    };

    const handleDelete = () => {
        if (!affiliateToDelete) return;

        router.delete(`/admin/affiliates/${affiliateToDelete.id}`, {
            onSuccess: () => {
                toast.success('Affilié supprimé avec succès');
                setDeleteDialogOpen(false);
                setAffiliateToDelete(null);
            },
            onError: () => {
                toast.error('Erreur lors de la suppression');
            },
        });
    };

    const stats = [
        {
            title: 'Total Affiliés',
            value: affiliates.total,
            icon: Users,
            color: 'text-blue-600 dark:text-blue-400',
            bgColor: 'bg-blue-50 dark:bg-blue-950/20',
        },
        {
            title: 'Actifs',
            value: affiliates.data.filter((a) => a.is_active).length,
            icon: CheckCircle,
            color: 'text-green-600 dark:text-green-400',
            bgColor: 'bg-green-50 dark:bg-green-950/20',
        },
        {
            title: 'Demandes en attente',
            value: pendingRequestsCount,
            icon: TrendingUp,
            color: 'text-orange-600 dark:text-orange-400',
            bgColor: 'bg-orange-50 dark:bg-orange-950/20',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Affiliés" />

            <div className="mx-auto max-w-7xl space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                            Gestion des Affiliés
                        </h1>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                            Créez et gérez vos affiliés et leurs performances
                        </p>
                    </div>
                    <div className="flex gap-3">
                        {pendingRequestsCount > 0 && (
                            <Link href="/admin/affiliates/requests">
                                <Button variant="outline" className="relative">
                                    <TrendingUp className="mr-2 h-4 w-4" />
                                    Demandes
                                    <Badge className="ml-2 bg-orange-500">
                                        {pendingRequestsCount}
                                    </Badge>
                                </Button>
                            </Link>
                        )}
                        <Link href="/admin/affiliates/create">
                            <Button className="bg-gradient-to-r from-purple-500 to-blue-500">
                                <Plus className="mr-2 h-4 w-4" />
                                Nouvel Affilié
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    {stats.map((stat) => (
                        <Card key={stat.title}>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                            {stat.title}
                                        </p>
                                        <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
                                            {stat.value}
                                        </p>
                                    </div>
                                    <div
                                        className={`rounded-full p-3 ${stat.bgColor}`}
                                    >
                                        <stat.icon
                                            className={`h-6 w-6 ${stat.color}`}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="p-6">
                        <form onSubmit={handleSearch} className="flex gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    <Input
                                        type="text"
                                        placeholder="Rechercher par nom ou email..."
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <Select
                                value={statusFilter}
                                onValueChange={handleStatusFilter}
                            >
                                <SelectTrigger className="w-48">
                                    <SelectValue placeholder="Statut" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tous</SelectItem>
                                    <SelectItem value="active">
                                        Actifs
                                    </SelectItem>
                                    <SelectItem value="inactive">
                                        Inactifs
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <Button type="submit">Rechercher</Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Liste des Affiliés</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nom</TableHead>
                                        <TableHead>Contact</TableHead>
                                        <TableHead>Code</TableHead>
                                        <TableHead>Commission</TableHead>
                                        <TableHead>Performance</TableHead>
                                        <TableHead>Statut</TableHead>
                                        <TableHead>Onboarding</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead className="text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {affiliates.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={9}
                                                className="text-center"
                                            >
                                                <div className="py-12">
                                                    <Users className="mx-auto h-12 w-12 text-slate-400" />
                                                    <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
                                                        Aucun affilié trouvé
                                                    </p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        affiliates.data.map((affiliate) => (
                                            <TableRow key={affiliate.id}>
                                                <TableCell>
                                                    <div>
                                                        <p className="font-medium text-slate-900 dark:text-slate-100">
                                                            {
                                                                affiliate.user
                                                                    .name
                                                            }
                                                        </p>
                                                        {affiliate.recommended_by && (
                                                            <p className="text-xs text-slate-500">
                                                                Recommandé par{' '}
                                                                {
                                                                    affiliate
                                                                        .recommended_by
                                                                        .name
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-sm">
                                                        <p className="text-slate-900 dark:text-slate-100">
                                                            {
                                                                affiliate.user
                                                                    .email
                                                            }
                                                        </p>
                                                        {affiliate.user
                                                            .phone && (
                                                            <p className="text-slate-500">
                                                                {
                                                                    affiliate
                                                                        .user
                                                                        .phone
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <code className="rounded bg-slate-100 px-2 py-1 font-mono text-xs dark:bg-slate-800">
                                                            {
                                                                affiliate.unique_code
                                                            }
                                                        </code>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                copyAffiliateLink(
                                                                    affiliate.unique_code,
                                                                )
                                                            }
                                                        >
                                                            <Copy className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-sm">
                                                        <p className="font-medium text-slate-900 dark:text-slate-100">
                                                            {
                                                                affiliate.commission_rate
                                                            }
                                                            %
                                                        </p>
                                                        {affiliate.can_recommend && (
                                                            <p className="text-xs text-slate-500">
                                                                +
                                                                {
                                                                    affiliate.referral_bonus_rate
                                                                }
                                                                % référence
                                                            </p>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-sm">
                                                        <p className="text-slate-900 dark:text-slate-100">
                                                            {
                                                                affiliate.total_clicks
                                                            }{' '}
                                                            clics
                                                        </p>
                                                        <p className="text-xs text-slate-500">
                                                            {
                                                                affiliate.total_conversions
                                                            }{' '}
                                                            conversions
                                                        </p>
                                                        <p className="text-xs font-medium text-green-600">
                                                            {affiliate.total_commissions.toFixed(
                                                                2,
                                                            )}{' '}
                                                            €
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={
                                                            affiliate.is_active
                                                                ? 'default'
                                                                : 'secondary'
                                                        }
                                                        className={
                                                            affiliate.is_active
                                                                ? 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400'
                                                                : ''
                                                        }
                                                    >
                                                        {affiliate.is_active ? (
                                                            <>
                                                                <CheckCircle className="mr-1 h-3 w-3" />
                                                                Actif
                                                            </>
                                                        ) : (
                                                            <>
                                                                <XCircle className="mr-1 h-3 w-3" />
                                                                Inactif
                                                            </>
                                                        )}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={
                                                            affiliate.onboarding_complete
                                                                ? 'default'
                                                                : 'secondary'
                                                        }
                                                        className={
                                                            affiliate.onboarding_complete
                                                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400'
                                                                : ''
                                                        }
                                                    >
                                                        {affiliate.onboarding_complete
                                                            ? 'Complet'
                                                            : 'En cours'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-sm text-slate-600">
                                                    {new Date(
                                                        affiliate.created_at,
                                                    ).toLocaleDateString(
                                                        'fr-FR',
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                window.open(
                                                                    `/sales/${affiliate.unique_code}`,
                                                                    '_blank',
                                                                )
                                                            }
                                                        >
                                                            <ExternalLink className="h-4 w-4" />
                                                        </Button>
                                                        <Link
                                                            href={`/admin/affiliates/${affiliate.id}/edit`}
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => {
                                                                setAffiliateToDelete(
                                                                    affiliate,
                                                                );
                                                                setDeleteDialogOpen(
                                                                    true,
                                                                );
                                                            }}
                                                        >
                                                            <Trash2 className="h-4 w-4 text-red-600" />
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

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirmer la suppression</DialogTitle>
                        <DialogDescription>
                            Êtes-vous sûr de vouloir supprimer l'affilié{' '}
                            <strong>{affiliateToDelete?.user.name}</strong> ?
                            Cette action est irréversible.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteDialogOpen(false)}
                        >
                            Annuler
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Supprimer
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
