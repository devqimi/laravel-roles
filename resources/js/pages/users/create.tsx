import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import InputError from '@/components/input-error';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Permission, Role, SinglePermission } from '@/types/role_permission';
import { permission } from 'node:process';
import { edit } from '@/routes/appearance';
import TablePagination from '@/components/table-pagination';
import { router } from '@inertiajs/core';
import { Checkbox } from '@/components/ui/checkbox';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Create User',
        href: '/users/create',
    },
];

export default function CreateUsers({ roles }: { roles: string[] }) {

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        roles: [] as string[],
    });

    function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        post('/users');
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create User" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card>
                    <CardHeader className="flex items-center justify-between">
                        <CardTitle>Create User</CardTitle>
                        <CardAction>
                            <Link href={'/users'}>
                                <Button variant={'default'} >Go Back</Button>
                            </Link>
                        </CardAction>
                    </CardHeader>
                    <hr />
                    <CardContent>
                        <form onSubmit={submit}>
                            <div className='mb-4'>
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" name="name" type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} aria-invalid={!!errors.name} />
                                <InputError message={errors.name} />
                            </div>
                            <div className='mb-4'>
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" name="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} aria-invalid={!!errors.email} />
                                <InputError message={errors.email} />
                            </div>
                            <div className='mb-4'>
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" name="password" type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} aria-invalid={!!errors.password} />
                                <InputError message={errors.password} />
                            </div>

                            <Label>Select Roles</Label>
                            <div className='my-4'>
                                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5'>
                                    {roles.map((role) => (
                                        <div key={role} className="flex items-center gap-3">
                                            <Checkbox
                                                id={role}
                                                onCheckedChange={(checked) => {
                                                    if (checked) {
                                                        setData('roles', [...data.roles, role]);
                                                    } else {
                                                        setData('roles', data.roles.filter((p) => p !== role));
                                                    }
                                                }}
                                            />
                                            <Label htmlFor={role}>{role}</Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className='flex justify-end'>
                                <Button size={'lg'} type='submit' disabled={processing}>
                                    Create
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}