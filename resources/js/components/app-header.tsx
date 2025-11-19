import { Breadcrumbs } from '@/components/breadcrumbs';
import { Icon } from '@/components/icon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
} from '@/components/ui/navigation-menu';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import forfaitStore from '@/routes/parent/forfait-store';
import { type BreadcrumbItem, type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { HandCoins, LayoutGrid, Menu, Search } from 'lucide-react';
import AppLogo from './app-logo';
import AppLogoIcon from './app-logo-icon';

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

const rightNavItems: NavItem[] = [];

const activeItemStyles =
    'text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100';

interface AppHeaderProps {
    breadcrumbs?: BreadcrumbItem[];
}

export function AppHeader({ breadcrumbs = [] }: AppHeaderProps) {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const getInitials = useInitials();
    return (
        <>
            <div className="bg-white dark:bg-slate-950">
                <div className="mx-auto px-4 py-3 md:max-w-7xl">
                    <div className="rounded-3xl border-2 border-blue-100 bg-linear-to-r from-blue-50/50 via-pink-50/50 to-purple-50/50 shadow-lg shadow-blue-100/50 transition-all hover:shadow-xl hover:shadow-blue-200/50 dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 dark:shadow-slate-900/50">
                        <div className="flex h-16 items-center px-6">
                            <div className="lg:hidden">
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="mr-2 h-10 w-10 rounded-2xl bg-linear-to-br from-blue-400 to-purple-500 text-white shadow-md transition-all hover:scale-110 hover:from-blue-500 hover:to-purple-600 hover:shadow-lg"
                                        >
                                            <Menu className="h-5 w-5" />
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent
                                        side="left"
                                        className="flex h-full w-64 flex-col items-stretch justify-between bg-sidebar"
                                    >
                                        <SheetTitle className="sr-only">
                                            Navigation Menu
                                        </SheetTitle>
                                        <SheetHeader className="flex justify-start text-left">
                                            <AppLogoIcon className="h-6 w-6 fill-current text-black dark:text-white" />
                                        </SheetHeader>
                                        <div className="flex h-full flex-1 flex-col space-y-4 p-4">
                                            <div className="flex h-full flex-col justify-between text-sm">
                                                <div className="flex flex-col space-y-4">
                                                    {mainNavItems.map(
                                                        (item) => (
                                                            <Link
                                                                key={item.title}
                                                                href={item.href}
                                                                className="flex items-center space-x-2 font-medium"
                                                            >
                                                                {item.icon && (
                                                                    <Icon
                                                                        iconNode={
                                                                            item.icon
                                                                        }
                                                                        className="h-5 w-5"
                                                                    />
                                                                )}
                                                                <span>
                                                                    {item.title}
                                                                </span>
                                                            </Link>
                                                        ),
                                                    )}
                                                </div>

                                                <div className="flex flex-col space-y-4">
                                                    {rightNavItems.map(
                                                        (item) => (
                                                            <a
                                                                key={item.title}
                                                                href={
                                                                    typeof item.href ===
                                                                    'string'
                                                                        ? item.href
                                                                        : item
                                                                              .href
                                                                              .url
                                                                }
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex items-center space-x-2 font-medium"
                                                            >
                                                                {item.icon && (
                                                                    <Icon
                                                                        iconNode={
                                                                            item.icon
                                                                        }
                                                                        className="h-5 w-5"
                                                                    />
                                                                )}
                                                                <span>
                                                                    {item.title}
                                                                </span>
                                                            </a>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </SheetContent>
                                </Sheet>
                            </div>

                            <Link
                                href={dashboard()}
                                prefetch
                                className="flex items-center space-x-2"
                            >
                                <AppLogo />
                            </Link>

                            <div className="ml-6 hidden h-full items-center space-x-6 lg:flex">
                                <NavigationMenu className="flex h-full items-stretch">
                                    <NavigationMenuList className="flex h-full items-stretch space-x-2">
                                        {mainNavItems.map((item, index) => (
                                            <NavigationMenuItem
                                                key={index}
                                                className="relative flex h-full items-center"
                                            >
                                                <Link
                                                    href={item.href}
                                                    className={cn(
                                                        'flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition-all duration-300',
                                                        page.url ===
                                                            (typeof item.href ===
                                                            'string'
                                                                ? item.href
                                                                : item.href.url)
                                                            ? 'scale-105 bg-linear-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-purple-200 dark:shadow-purple-900/50'
                                                            : 'bg-white/80 text-slate-700 hover:scale-105 hover:bg-linear-to-r hover:from-blue-400 hover:to-purple-400 hover:text-white hover:shadow-md dark:bg-slate-800/50 dark:text-slate-300',
                                                    )}
                                                >
                                                    {item.icon && (
                                                        <Icon
                                                            iconNode={item.icon}
                                                            className="mr-2 h-4 w-4"
                                                        />
                                                    )}
                                                    {item.title}
                                                </Link>
                                            </NavigationMenuItem>
                                        ))}
                                    </NavigationMenuList>
                                </NavigationMenu>
                            </div>

                            <div className="ml-auto flex items-center space-x-2">
                                <div className="relative flex items-center space-x-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="group h-10 w-10 rounded-2xl bg-linear-to-br from-pink-400 to-rose-500 text-white shadow-md transition-all hover:scale-110 hover:from-pink-500 hover:to-rose-600 hover:shadow-lg"
                                    >
                                        <Search className="h-5 w-5" />
                                    </Button>
                                    <div className="hidden lg:flex">
                                        {rightNavItems.map((item) => (
                                            <TooltipProvider
                                                key={item.title}
                                                delayDuration={0}
                                            >
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <a
                                                            href={
                                                                typeof item.href ===
                                                                'string'
                                                                    ? item.href
                                                                    : item.href
                                                                          .url
                                                            }
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="group ml-1 inline-flex h-9 w-9 items-center justify-center rounded-md bg-transparent p-0 text-sm font-medium text-accent-foreground ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                                                        >
                                                            <span className="sr-only">
                                                                {item.title}
                                                            </span>
                                                            {item.icon && (
                                                                <Icon
                                                                    iconNode={
                                                                        item.icon
                                                                    }
                                                                    className="size-5 opacity-80 group-hover:opacity-100"
                                                                />
                                                            )}
                                                        </a>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>{item.title}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        ))}
                                    </div>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            className="h-10 w-10 rounded-full p-0 ring-2 ring-blue-200 ring-offset-2 transition-all hover:scale-110 hover:ring-4 hover:ring-purple-300 dark:ring-slate-700 dark:ring-offset-slate-950"
                                        >
                                            <Avatar className="h-10 w-10 overflow-hidden rounded-full">
                                                <AvatarImage
                                                    src={auth.user.avatar}
                                                    alt={auth.user.name}
                                                />
                                                <AvatarFallback className="rounded-full bg-linear-to-br from-blue-400 to-purple-500 text-sm font-bold text-white">
                                                    {getInitials(
                                                        auth.user.name,
                                                    )}
                                                </AvatarFallback>
                                            </Avatar>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        className="w-56"
                                        align="end"
                                    >
                                        <UserMenuContent user={auth.user} />
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {breadcrumbs.length > 1 && (
                <div className="mx-auto px-4 md:max-w-7xl">
                    <div className="mt-3 rounded-2xl bg-white/50 backdrop-blur-sm dark:bg-slate-900/50">
                        <div className="flex h-12 w-full items-center justify-start px-6 text-neutral-500">
                            <Breadcrumbs breadcrumbs={breadcrumbs} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
