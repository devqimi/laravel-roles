import { Button } from '@/components/ui/button';
import {
    Card,
    CardAction,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import CrfForm from './crfform';

type Department = {
    id: number;
    dname: string;
};

type Category = {
    id: number;
    cname: string;
};

type User = {
    id: number;
    name: string;
    nric: string;
    email: string;
    department_id: number | null;
    department_name?: string;
};

type Props = {
    user: User;
    departments: Department[];
    categories: Category[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Create CRF',
        href: '/crfs/create',
    },
];

export default function CreateUsers({ user, departments, categories }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create User" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card>
                    <CardHeader className="flex items-center justify-between">
                        <CardTitle>Create CRF</CardTitle>
                        <CardAction>
                            <Link href={'/dashboard'}>
                                <Button variant={'default'}>Go Back</Button>
                            </Link>
                        </CardAction>
                    </CardHeader>
                    <hr />
                    <CardContent>
                        <CrfForm
                            user={user}
                            departments={departments}
                            categories={categories}
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
