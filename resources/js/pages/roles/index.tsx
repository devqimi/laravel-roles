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
import { Badge } from '@/components/ui/badge';
import { usePermission } from '@/hooks/user-permissions';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Roles',
        href: '/roles',
    },
];

export default function Roles({ roles }: { roles: Role }) {

    const {flash} = usePage<{flash: {message?: string}} >().props;
    const {can} = usePermission();

    useEffect (() => {
        if (flash.message) {
            toast.success(flash.message);
        }
    }, [flash.message]);
    
    function deleteRole(id: number){
        if (confirm("Are you sure you want to delete this role?")) {
            router.delete(`roles/${id}`);
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card>
                    <CardHeader className="flex items-center justify-between">
                        <CardTitle>Roles Management</CardTitle>
                        <CardAction>
                            {can('create roles') && (
                                <Link href={'roles/create'}>
                                    <Button variant={'default'} >Add New</Button>
                                </Link>
                            )}
                        </CardAction>
                    </CardHeader>
                    <hr />
                    <CardContent>
                        <Table>
                            <TableHeader className="bg-slate-500 dark:bg-slate-700">
                                <TableRow>
                                    <TableHead className='font-bold text-white'>ID</TableHead>
                                    <TableHead className='font-bold text-white'>Name</TableHead>
                                    <TableHead className='font-bold text-white'>Permissions</TableHead>
                                    <TableHead className='font-bold text-white'>Created At</TableHead>
                                    <TableHead className='font-bold text-white'>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {roles.data.map((role, index) => (
                                    <TableRow className='odd:bg-slate-100 dark:odd:bg-slate-800'>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{role.name}</TableCell>
                                        <TableCell className='flex flex-wrap items-center gap-2'>{role.permissions.map((perm,index) => (
                                            <Badge variant={'outline'} key={index}>
                                                {perm}
                                            </Badge>
                                        ))}</TableCell>
                                        <TableCell>{role.created_at}</TableCell>
                                        <TableCell>
                                            {can('update roles') && (
                                                <Link href={`roles/${role.id}/edit`}>
                                                    <Button variant={'outline'} size={'sm'}>
                                                        Edit
                                                    </Button>
                                                </Link>
                                            )}
                                            {can('delete role') && (
                                                <Button className='m-2' variant={'destructive'} size={'sm'} onClick={() => deleteRole(role.id)}>
                                                    Delete
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                    {roles.data.length > 0 ? (
                        <TablePagination total={roles.total} from={roles.from} to={roles.to} links={roles.links} />
                    ): (
                        <div className='flex h-full items-center justify-center'>No Results Found!</div>
                    )}
                </Card>
            </div>
        </AppLayout>
    );
}