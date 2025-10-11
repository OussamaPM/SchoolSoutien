import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { SharedData, type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import AdminDashboard from './admin/admin-dashboard';
import ParentDashboard from './parent/parent-dashboard';
import TeacherDashboard from './teacher/teacher-dashboard';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    const role = usePage<SharedData>().props.auth.user.role;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            {role === 'admin' && <AdminDashboard />}
            {role === 'parent' && <ParentDashboard />}
            {role === 'teacher' && <TeacherDashboard />}
        </AppLayout>
    );
}
