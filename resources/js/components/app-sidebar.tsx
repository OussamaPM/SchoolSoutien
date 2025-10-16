import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { levelCategories } from '@/routes/admin/educational-programs';
import forfaits from '@/routes/admin/forfaits';
import { SharedData, type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Globe, GraduationCap, HandCoins, LayoutGrid } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
];

const adminMainNavItems: NavItem[] = [
    {
        title: 'Forfaits',
        href: forfaits.index(),
        icon: HandCoins,
    },
    {
        title: 'Programme',
        href: levelCategories.url(),
        icon: GraduationCap,
    },
];

const parentMainNavItems: NavItem[] = [];

const teacherMainNavItems: NavItem[] = [];

const footerNavItems: NavItem[] = [
    {
        title: 'School Soutien',
        href: 'https://schoolsoutien.com',
        icon: Globe,
    },
];

const getNavItemsByRole = (role: 'admin' | 'parent' | 'teacher') => {
    switch (role) {
        case 'admin':
            return mainNavItems.concat(adminMainNavItems);
        case 'parent':
            return mainNavItems.concat(parentMainNavItems);
        case 'teacher':
            return mainNavItems.concat(teacherMainNavItems);
        default:
            return mainNavItems;
    }
};

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain
                    items={getNavItemsByRole(
                        usePage<SharedData>().props.auth.user.role,
                    )}
                />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
