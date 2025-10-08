import TablePagination from '@/components/table-pagination';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardAction,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { usePermission } from '@/hooks/user-permissions';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Crf } from '@/types/crf';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard({ crfs }: { crfs: Crf }) {
    const { can } = usePermission();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="CRF" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card>
                    <CardHeader className="flex items-center justify-between">
                        <CardTitle>CRF</CardTitle>
                        <CardAction>
                            {can('Create CRF') && (
                                <Link href={'crfs/create'}>
                                    <Button variant={'default'}>
                                        Create CRF
                                    </Button>
                                </Link>
                            )}
                        </CardAction>
                    </CardHeader>
                    <hr />
                    <CardContent>
                        <Table>
                            <TableHeader className="bg-slate-500">
                                <TableRow>
                                    <TableHead className="font-bold text-white">
                                        No.
                                    </TableHead>
                                    <TableHead className="font-bold text-white">
                                        Name
                                    </TableHead>
                                    <TableHead className="font-bold text-white">
                                        NRIC
                                    </TableHead>
                                    <TableHead className="font-bold text-white">
                                        Department
                                    </TableHead>
                                    <TableHead className="font-bold text-white">
                                        Designation
                                    </TableHead>
                                    <TableHead className="font-bold text-white">
                                        Ext & HP No
                                    </TableHead>
                                    <TableHead className="font-bold text-white">
                                        Category
                                    </TableHead>
                                    <TableHead className="font-bold text-white">
                                        Issue
                                    </TableHead>
                                    <TableHead className="font-bold text-white">
                                        Reason
                                    </TableHead>
                                    <TableHead className="font-bold text-white">
                                        User ID
                                    </TableHead>
                                    <TableHead className="font-bold text-white">
                                        Created At
                                    </TableHead>
                                    <TableHead className="font-bold text-white">
                                        Updated At
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {crfs.data.map((crf, index) => (
                                    <TableRow
                                        key={crf.id}
                                        className="odd:bg-slate-100 dark:odd:bg-slate-800"
                                    >
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{crf.fname}</TableCell>
                                        <TableCell>{crf.nric}</TableCell>
                                        <TableCell>
                                            {crf.department?.dname || 'N/A'}
                                        </TableCell>
                                        <TableCell>{crf.designation}</TableCell>
                                        <TableCell>{crf.extno}</TableCell>
                                        <TableCell>
                                            {crf.category?.cname || 'N/A'}
                                        </TableCell>
                                        <TableCell>{crf.issue}</TableCell>
                                        <TableCell>{crf.reason}</TableCell>
                                        <TableCell>{crf.user_id}</TableCell>
                                        <TableCell>
                                            {new Date(
                                                crf.created_at,
                                            ).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(
                                                crf.updated_at,
                                            ).toLocaleDateString()}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                    {crfs.data.length > 0 ? (
                        <TablePagination
                            total={crfs.total}
                            from={crfs.from}
                            to={crfs.to}
                            links={crfs.links}
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center">
                            No Results Found!
                        </div>
                    )}
                </Card>
            </div>
        </AppLayout>
    );
}
