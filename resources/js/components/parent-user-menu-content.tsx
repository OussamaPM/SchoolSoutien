import {
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { cn } from '@/lib/utils';
import { dashboard, logout } from '@/routes';
import forfaitStore from '@/routes/parent/forfait-store';
import { edit } from '@/routes/profile';
import { type NavItem, type User } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import {
    HandCoins,
    LayoutGrid,
    LogOut,
    Settings,
    Sparkles,
} from 'lucide-react';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Boutique',
        href: forfaitStore.index(),
        icon: HandCoins,
    },
];

interface UserMenuContentProps {
    user: User;
}

export function ParentUserMenuContent({ user }: UserMenuContentProps) {
    const cleanup = useMobileNavigation();
    const page = usePage();
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

    return (
        <>
            <DropdownMenuLabel className="rounded-t-2xl bg-linear-to-r from-blue-50 via-purple-50 to-pink-50 p-0 font-normal dark:from-slate-800 dark:via-slate-800 dark:to-slate-800">
                <div className="flex items-center gap-3 px-4 py-3 text-left">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-blue-400 to-purple-500 shadow-md">
                        <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <UserInfo user={user} showEmail={true} />
                </div>
            </DropdownMenuLabel>

            {isMobile && (
                <>
                    <DropdownMenuSeparator className="bg-linear-to-r from-transparent via-blue-200 to-transparent dark:via-slate-700" />
                    <DropdownMenuGroup>
                        <div className="space-y-1 px-2 py-2">
                            {mainNavItems.map((item) => {
                                const Icon = item.icon;
                                const isActive =
                                    page.url ===
                                    (typeof item.href === 'string'
                                        ? item.href
                                        : item.href.url);
                                return (
                                    <DropdownMenuItem key={item.title} asChild>
                                        <Link
                                            href={item.href}
                                            onClick={cleanup}
                                            className={cn(
                                                'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 font-semibold transition-all',
                                                isActive
                                                    ? 'bg-linear-to-r from-blue-500 to-purple-500 text-white shadow-md'
                                                    : 'text-slate-700 hover:bg-blue-50 dark:text-slate-300 dark:hover:bg-slate-800',
                                            )}
                                        >
                                            {Icon && (
                                                <Icon className="h-4 w-4" />
                                            )}
                                            {item.title}
                                        </Link>
                                    </DropdownMenuItem>
                                );
                            })}
                        </div>
                    </DropdownMenuGroup>
                </>
            )}

            <DropdownMenuSeparator className="bg-linear-to-r from-transparent via-blue-200 to-transparent dark:via-slate-700" />
            <DropdownMenuGroup>
                <div className="space-y-1 px-2 py-2">
                    <DropdownMenuItem asChild>
                        <Link
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 font-semibold text-slate-700 transition-all hover:bg-blue-50 dark:text-slate-300 dark:hover:bg-slate-800"
                            href={edit()}
                            as="button"
                            prefetch
                            onClick={cleanup}
                        >
                            <Settings className="h-4 w-4" />
                            Paramètres
                        </Link>
                    </DropdownMenuItem>
                </div>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-linear-to-r from-transparent via-red-200 to-transparent dark:via-red-900" />
            <div className="px-2 pt-1 pb-2">
                <DropdownMenuItem asChild>
                    <Link
                        className="flex w-full items-center gap-3 rounded-xl bg-red-50 px-3 py-2.5 font-semibold text-red-600 transition-all hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/50"
                        href={logout()}
                        as="button"
                        onClick={handleLogout}
                        data-test="logout-button"
                    >
                        <LogOut className="h-4 w-4" />
                        Se déconnecter
                    </Link>
                </DropdownMenuItem>
            </div>
        </>
    );
}
