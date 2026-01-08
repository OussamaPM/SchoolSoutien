import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Head, router } from '@inertiajs/react';
import {
    BarChart3,
    CheckCircle2,
    DollarSign,
    TrendingUp,
    UserPlus,
    Users,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

interface SubAffiliate {
    id: number;
    name: string;
    email: string;
    unique_code: string;
    is_active: boolean;
    commission_rate: number;
    joined_at: string;
    your_commission: number;
    their_total_commission: number;
    their_conversions: number;
}

interface Stats {
    total_sub_affiliates: number;
    active_sub_affiliates: number;
    total_referral_commissions: number;
    referral_bonus_rate: number;
}

interface ChartData {
    month: string;
    commissions: number;
}

interface Props {
    subAffiliates: SubAffiliate[];
    stats: Stats;
    chartData: ChartData[];
    years: number[];
}

export default function SubAffiliates({
    subAffiliates,
    stats,
    chartData,
    years,
}: Props) {
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear.toString());
    const [statusFilter, setStatusFilter] = useState('all');

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
        }).format(amount);
    };

    const handleYearChange = (year: string) => {
        setSelectedYear(year);
        router.get(
            '/affiliate/sub-affiliates',
            { year, status: statusFilter },
            { preserveState: true },
        );
    };

    const handleStatusChange = (status: string) => {
        setStatusFilter(status);
        router.get(
            '/affiliate/sub-affiliates',
            { year: selectedYear, status },
            { preserveState: true },
        );
    };

    return (
        <AppLayout>
            <Head title="Mes Affiliés Recommandés" />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                            Affiliés Recommandés
                        </h1>
                        <p className="mt-2 text-slate-600 dark:text-slate-400">
                            Suivez les performances de vos affiliés recommandés
                            et vos commissions de parrainage
                        </p>
                    </div>
                    <Button asChild>
                        <a href="/affiliate/recommend">
                            <UserPlus className="mr-2 h-4 w-4" />
                            Recommander un Affilié
                        </a>
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {/* Total Sub-Affiliates */}
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                        Total Affiliés
                                    </p>
                                    <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
                                        {stats.total_sub_affiliates}
                                    </p>
                                </div>
                                <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/20">
                                    <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Active Sub-Affiliates */}
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                        Affiliés Actifs
                                    </p>
                                    <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
                                        {stats.active_sub_affiliates}
                                    </p>
                                    <p className="mt-1 text-xs text-green-600 dark:text-green-400">
                                        {stats.total_sub_affiliates > 0
                                            ? Math.round(
                                                  (stats.active_sub_affiliates /
                                                      stats.total_sub_affiliates) *
                                                      100,
                                              )
                                            : 0}
                                        % du total
                                    </p>
                                </div>
                                <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/20">
                                    <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Total Referral Commissions */}
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                        Commissions Totales
                                    </p>
                                    <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
                                        {formatCurrency(
                                            stats.total_referral_commissions,
                                        )}
                                    </p>
                                    <p className="mt-1 text-xs text-slate-500">
                                        De vos affiliés recommandés
                                    </p>
                                </div>
                                <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900/20">
                                    <DollarSign className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Referral Bonus Rate */}
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                        Taux de Commission
                                    </p>
                                    <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
                                        {stats.referral_bonus_rate}%
                                    </p>
                                    <p className="mt-1 text-xs text-slate-500">
                                        Sur leurs commissions
                                    </p>
                                </div>
                                <div className="rounded-full bg-orange-100 p-3 dark:bg-orange-900/20">
                                    <BarChart3 className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Performance Chart */}
                <Card>
                    <CardHeader>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <CardTitle>
                                Commissions de Parrainage Mensuelles
                            </CardTitle>
                            <Select
                                value={selectedYear}
                                onValueChange={handleYearChange}
                            >
                                <SelectTrigger className="w-32">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {years.map((year) => (
                                        <SelectItem
                                            key={year}
                                            value={year.toString()}
                                        >
                                            {year}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient
                                            id="colorReferralCommissions"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="5%"
                                                stopColor="#f97316"
                                                stopOpacity={0.8}
                                            />
                                            <stop
                                                offset="95%"
                                                stopColor="#f97316"
                                                stopOpacity={0}
                                            />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        className="stroke-slate-200 dark:stroke-slate-700"
                                    />
                                    <XAxis
                                        dataKey="month"
                                        className="text-xs text-slate-600 dark:text-slate-400"
                                    />
                                    <YAxis className="text-xs text-slate-600 dark:text-slate-400" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--card))',
                                            border: '1px solid hsl(var(--border))',
                                            borderRadius: '8px',
                                        }}
                                        formatter={(value: number) => [
                                            formatCurrency(value),
                                            'Commissions',
                                        ]}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="commissions"
                                        stroke="#f97316"
                                        fillOpacity={1}
                                        fill="url(#colorReferralCommissions)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Legend */}
                        <div className="mt-4 flex items-center justify-center gap-6 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-full bg-orange-500" />
                                <span className="text-slate-600 dark:text-slate-400">
                                    Commissions de Parrainage (€)
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Sub-Affiliates Table */}
                <Card>
                    <CardHeader>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <CardTitle>Liste des Affiliés</CardTitle>
                            <Select
                                value={statusFilter}
                                onValueChange={handleStatusChange}
                            >
                                <SelectTrigger className="w-40">
                                    <SelectValue />
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
                        </div>
                    </CardHeader>
                    <CardContent>
                        {subAffiliates.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Users className="mb-4 h-12 w-12 text-slate-400" />
                                <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                                    Aucun affilié recommandé
                                </h3>
                                <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
                                    Commencez à recommander des affiliés pour
                                    gagner des commissions supplémentaires
                                </p>
                                <Button asChild>
                                    <a href="/affiliate/recommend">
                                        <UserPlus className="mr-2 h-4 w-4" />
                                        Recommander un Affilié
                                    </a>
                                </Button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Affilié</TableHead>
                                            <TableHead>Code</TableHead>
                                            <TableHead>Statut</TableHead>
                                            <TableHead className="text-right">
                                                Leur Commission
                                            </TableHead>
                                            <TableHead className="text-right">
                                                Conversions
                                            </TableHead>
                                            <TableHead className="text-right">
                                                Votre Commission
                                            </TableHead>
                                            <TableHead>Rejoint le</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {subAffiliates.map((affiliate) => (
                                            <TableRow key={affiliate.id}>
                                                <TableCell>
                                                    <div>
                                                        <div className="font-medium text-slate-900 dark:text-slate-100">
                                                            {affiliate.name}
                                                        </div>
                                                        <div className="text-sm text-slate-500">
                                                            {affiliate.email}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <code className="rounded bg-slate-100 px-2 py-1 text-xs dark:bg-slate-800">
                                                        {affiliate.unique_code}
                                                    </code>
                                                </TableCell>
                                                <TableCell>
                                                    {affiliate.is_active ? (
                                                        <Badge
                                                            variant="default"
                                                            className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400"
                                                        >
                                                            <CheckCircle2 className="mr-1 h-3 w-3" />
                                                            Actif
                                                        </Badge>
                                                    ) : (
                                                        <Badge
                                                            variant="secondary"
                                                            className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                                                        >
                                                            <XCircle className="mr-1 h-3 w-3" />
                                                            Inactif
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right font-medium">
                                                    {formatCurrency(
                                                        affiliate.their_total_commission,
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {
                                                        affiliate.their_conversions
                                                    }
                                                </TableCell>
                                                <TableCell className="text-right font-bold text-green-600 dark:text-green-400">
                                                    {formatCurrency(
                                                        affiliate.your_commission,
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-slate-600 dark:text-slate-400">
                                                    {new Date(
                                                        affiliate.joined_at,
                                                    ).toLocaleDateString(
                                                        'fr-FR',
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
