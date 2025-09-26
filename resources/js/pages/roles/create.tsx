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
        title: 'Create Role',
        href: '/roles/create',
    },
];

export default function CreateRoles({permissions}: { permissions: string[] }) {

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        permissions: [] as string[]
    });

    function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        post('/roles');
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Role" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card>
                    <CardHeader className="flex items-center justify-between">
                        <CardTitle>Create Role</CardTitle>
                        <CardAction>
                            <Link href={'/roles'}>
                                <Button variant={'default'} >Go Back</Button>
                            </Link>
                        </CardAction>
                    </CardHeader>
                    <hr />
                    <CardContent>
                        <form onSubmit={submit}>
                            <div className='mb-4'>
                                <Label htmlFor="name">Role Name</Label>
                                <Input id="name" name="name" type="text" onChange={(e) => setData('name', e.target.value)} aria-invalid={!!errors.name} />
                                <InputError message={errors.name} />
                            </div>

                            <Label>Select Permissions</Label>
                            <div className='my-4'>
                                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5'>
                                    {permissions.map((permission) => (
                                        <div key={permission} className="flex items-center gap-3">
                                            <Checkbox
                                                id={permission}
                                                onCheckedChange={(checked) => {
                                                    if (checked) {
                                                        setData('permissions', [...data.permissions, permission]);
                                                    } else {
                                                        setData('permissions', data.permissions.filter((p) => p !== permission));
                                                    }
                                                }}
                                            />
                                            <Label htmlFor={permission}>{permission}</Label>
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