import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import {
    BarChart3,
    Copy,
    DollarSign,
    MousePointerClick,
    TrendingUp,
    Users,
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
import { toast } from 'sonner';

interface Affiliate {
    id: number;
    unique_code: string;
    affiliate_link: string;
    commission_rate: number;
}

interface Stats {
    total_clicks: number;
    total_conversions: number;
    total_commissions: number;
    active_subscribers: number;
    conversion_rate: number;
    avg_commission: number;
}

interface ChartData {
    month: string;
    commissions: number;
    clicks: number;
    conversions: number;
}

interface Props {
    affiliate: Affiliate;
    stats: Stats;
    chartData: ChartData[];
    years: number[];
}

export default function AffiliateDashboard({
    affiliate,
    stats,
    chartData,
    years,
}: Props) {
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear.toString());

    const copyLink = () => {
        navigator.clipboard.writeText(affiliate.affiliate_link);
        toast('Lien copié !', {
            description:
                "Le lien d'affiliation a été copié dans le presse-papier",
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
        }).format(amount);
    };

    return (
        <AppLayout>
            <Head title="Tableau de Bord - Affiliation" />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                        Tableau de Bord
                    </h1>
                    <p className="mt-2 text-slate-600 dark:text-slate-400">
                        Suivez vos performances et vos commissions
                    </p>
                </div>

                {/* Affiliate Link Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Votre Lien d'Affiliation</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Code unique:{' '}
                                    <span className="font-mono text-blue-600">
                                        {affiliate.unique_code}
                                    </span>
                                </p>
                                <p className="mt-1 text-sm break-all text-slate-600 dark:text-slate-400">
                                    {affiliate.affiliate_link}
                                </p>
                            </div>
                            <Button
                                onClick={copyLink}
                                variant="outline"
                                className="shrink-0"
                            >
                                <Copy className="mr-2 h-4 w-4" />
                                Copier
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Stats Cards */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* Total Clicks */}
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                        Clics Totaux
                                    </p>
                                    <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
                                        {stats.total_clicks.toLocaleString()}
                                    </p>
                                </div>
                                <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/20">
                                    <MousePointerClick className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Total Conversions */}
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                        Conversions
                                    </p>
                                    <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
                                        {stats.total_conversions.toLocaleString()}
                                    </p>
                                    <p className="mt-1 text-xs text-green-600 dark:text-green-400">
                                        {stats.conversion_rate.toFixed(1)}% taux
                                        de conversion
                                    </p>
                                </div>
                                <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/20">
                                    <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Total Commissions */}
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                        Commissions Totales
                                    </p>
                                    <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
                                        {formatCurrency(
                                            stats.total_commissions,
                                        )}
                                    </p>
                                    <p className="mt-1 text-xs text-slate-500">
                                        Moy.{' '}
                                        {formatCurrency(stats.avg_commission)} /
                                        vente
                                    </p>
                                </div>
                                <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900/20">
                                    <DollarSign className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Active Subscribers */}
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                        Abonnés Actifs
                                    </p>
                                    <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
                                        {stats.active_subscribers.toLocaleString()}
                                    </p>
                                    <p className="mt-1 text-xs text-slate-500">
                                        Clients avec abonnement actif
                                    </p>
                                </div>
                                <div className="rounded-full bg-orange-100 p-3 dark:bg-orange-900/20">
                                    <Users className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Commission Rate */}
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                        Taux de Commission
                                    </p>
                                    <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
                                        {affiliate.commission_rate}%
                                    </p>
                                    <p className="mt-1 text-xs text-slate-500">
                                        Sur chaque vente générée
                                    </p>
                                </div>
                                <div className="rounded-full bg-pink-100 p-3 dark:bg-pink-900/20">
                                    <BarChart3 className="h-6 w-6 text-pink-600 dark:text-pink-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Performance Chart */}
                <Card>
                    <CardHeader>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <CardTitle>Performance Mensuelle</CardTitle>
                            <Select
                                value={selectedYear}
                                onValueChange={setSelectedYear}
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
                                            id="colorCommissions"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="5%"
                                                stopColor="#8b5cf6"
                                                stopOpacity={0.8}
                                            />
                                            <stop
                                                offset="95%"
                                                stopColor="#8b5cf6"
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
                                        formatter={(
                                            value: number,
                                            name: string,
                                        ) => {
                                            if (name === 'commissions') {
                                                return [
                                                    formatCurrency(value),
                                                    'Commissions',
                                                ];
                                            }
                                            return [
                                                value,
                                                name === 'clicks'
                                                    ? 'Clics'
                                                    : 'Conversions',
                                            ];
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="commissions"
                                        stroke="#8b5cf6"
                                        fillOpacity={1}
                                        fill="url(#colorCommissions)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Legend */}
                        <div className="mt-4 flex items-center justify-center gap-6 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-full bg-purple-500" />
                                <span className="text-slate-600 dark:text-slate-400">
                                    Commissions (€)
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recommander un Affilié</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
                                Recommandez de nouveaux affiliés et gagnez 5%
                                sur leurs commissions
                            </p>
                            <a href="/affiliate/recommend">
                                <Button>Recommander</Button>
                            </a>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Mes Factures</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
                                Consultez et téléchargez vos factures mensuelles
                            </p>
                            <a href="/affiliate/invoices">
                                <Button variant="outline">
                                    Voir les Factures
                                </Button>
                            </a>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
