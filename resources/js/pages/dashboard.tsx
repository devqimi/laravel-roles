import TablePagination from '@/components/table-pagination';
import { Button } from '@/components/ui/button';
import {Card, CardAction, CardContent, CardHeader, CardTitle,} from '@/components/ui/card';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Crf } from '@/types/crf';
import { Head, Link, router } from '@inertiajs/react';
import { CheckCircle, Trash2, ClipboardCheck, UserPlus, Eye } from 'lucide-react';
import AssignCrfModal from '@/pages/crfs/AssignCrfModal';
import { useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

type User = {
    id: number;
    name: string;
};

type Factor = {
    id: number;
    name: string;
};

type CrfData = {
    id: number;
    fname: string;
    nric: string;
    designation: string;
    extno: string;
    issue: string;
    reason: string;
    department: { dname: string };
    category: { cname: string };
    factor?: { id: number; name: string } | null;
    application_status: { status: string };
    application_status_id: number;
    assigned_to: number | null;
    assigned_user?: { name: string } | null;
    approver?: { name: string } | null;
    created_at: string;
    updated_at: string;
};

type Props = {
    crfs: Crf;
    department_crfs: CrfData[] | null;
    can_view?: boolean;
    can_view_department?: boolean;
    can_delete?: boolean;
    can_create?: boolean;
    can_approve?: boolean;
    can_acknowledge?: boolean;
    can_assign_itd?: boolean;
    can_assign_vendor?: boolean;
    can_update_own_crf?: boolean;
    itd_pics?: User[];
    vendor_pics?: User[];
    factors: Factor[];
};

export default function Dashboard({
    crfs,
    department_crfs = null,
    can_view = false,
    can_view_department = false,
    can_delete = false,
    can_create = false,
    can_approve = false,
    can_acknowledge = false,
    can_assign_itd = false,
    can_assign_vendor = false,
    can_update_own_crf = false,
    itd_pics = [],
    vendor_pics = [],
    factors = [],
}: Props) {


    // const { can } = usePermission();
    // const [deletingId, setDeletingId] = useState<number | null>(null);
    const [approvingId, setApprovingId] = useState<number | null>(null);
    const [acknowledgingId, setAcknowledgingId] = useState<number | null>(null);
    const [assignModalOpen, setAssignModalOpen] = useState(false);
    const [selectedCrfId, setSelectedCrfId] = useState<number | null>(null);

    // const handleDelete = (crfId: number) => {
    //     if (confirm('Are you sure you want to delete this CRF?')) {
    //         setDeletingId(crfId);
    //         router.delete(`/crfs/${crfId}`, {
    //             preserveScroll: true,
    //             onSuccess: () => {
    //                 setDeletingId(null);
    //             },
    //             onError: () => {
    //                 setDeletingId(null);
    //                 alert('Failed to delete CRF');
    //             },
    //         });
    //     }
    // };

    const handleApprove = (crfId: number) => {
        if (confirm('Are you sure you want to approve this CRF?')) {
            setApprovingId(crfId);
            router.post(
                `/crfs/${crfId}/approve`,
                {},
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        setApprovingId(null);
                    },
                    onError: () => {
                        setApprovingId(null);
                        alert('Failed to approve CRF');
                    },
                },
            );
        }
    };

    const handleAcknowledge = (crfId: number) => {
        if (confirm('Are you sure you want to acknowledge this CRF?')) {
            setAcknowledgingId(crfId);
            router.post(`/crfs/${crfId}/acknowledge`, {}, {
                preserveScroll: true,
                onSuccess: () => {
                    setAcknowledgingId(null);
                },
                onError: () => {
                    setAcknowledgingId(null);
                    alert('Failed to acknowledge CRF');
                },
            });
        }
    };

    const handleOpenAssignModal = (crfId: number) => {
        setSelectedCrfId(crfId);
        setAssignModalOpen(true);
    };

    const handleCloseAssignModal = () => {
        setAssignModalOpen(false);
        setSelectedCrfId(null);
    };

    const getStatusBadge = (status: string | undefined) => {
        if (!status) return null;

        const statusColors: Record<string, string> = {
            'First Created': 'bg-amber-100 text-amber-800',
            'Verified': 'bg-green-100 text-green-800',
            'ITD Acknowledged': 'bg-indigo-100 text-indigo-800',
            'Assigned to ITD': 'bg-blue-100 text-blue-800',
            'Assigned to Vendor': 'bg-cyan-100 text-cyan-800',
            'Reassigned to ITD': 'bg-blue-200 text-blue-900',
            'Reassigned to Vendor': 'bg-cyan-200 text-cyan-900',
            'Work in progress': 'bg-sky-100 text-sky-800',
            'Closed': 'bg-gray-200 text-gray-800',
        };

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
                {status}
            </span>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="CRF" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card>
                    <CardHeader className="flex items-center justify-between">
                        {can_approve ? (
                            <CardTitle>CRF Pending Approval</CardTitle>
                        ) : (
                            <CardTitle>CRF</CardTitle>
                        )}
                        <CardAction>
                            
                            {can_create && (
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
                        <div className="rounded-md border overflow-hidden">
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
                                            Factor
                                        </TableHead>
                                        <TableHead className="font-bold text-white">
                                            Issue
                                        </TableHead>
                                        <TableHead className="font-bold text-white">
                                            Reason
                                        </TableHead>
                                        <TableHead className="font-bold text-white">
                                            Status
                                        </TableHead>
                                        <TableHead className="font-bold text-white">
                                            Approved By
                                        </TableHead>
                                        <TableHead className="font-bold text-white">
                                            Created At
                                        </TableHead>
                                        <TableHead className="font-bold text-white">
                                            Updated At
                                        </TableHead>

                                        {(can_view || can_delete || can_approve || can_acknowledge || can_assign_itd || can_assign_vendor) && (
                                            <TableHead className="font-bold text-white">
                                                Actions
                                            </TableHead>
                                        )}
                                        
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {crfs.data.map((crf, index) => (
                                        <TableRow key={crf.id} className="odd:bg-slate-100 dark:odd:bg-slate-800">
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{crf.fname}</TableCell>
                                            <TableCell>{crf.nric}</TableCell>
                                            <TableCell>{crf.department?.dname || 'N/A'}</TableCell>
                                            <TableCell>{crf.designation}</TableCell>
                                            <TableCell>{crf.extno}</TableCell>
                                            <TableCell>{crf.category?.cname || 'N/A'}</TableCell>
                                            <TableCell>{crf.factor ? crf.factor.name : 'N/A'}
                                            </TableCell>
                                            <TableCell className="max-w-xs">
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <p className="truncate cursor-help">
                                                                {crf.issue}
                                                            </p>
                                                        </TooltipTrigger>
                                                        <TooltipContent className="max-w-sm">
                                                            <p className="text-sm whitespace-pre-wrap">{crf.issue}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </TableCell>
                                            <TableCell>{crf.reason || '-'}</TableCell>
                                            <TableCell>{getStatusBadge(crf.application_status?.status)}</TableCell>
                                            <TableCell>{crf.approver?.name || '-'}</TableCell>
                                            <TableCell>{new Date(crf.created_at,).toLocaleString()}</TableCell>
                                            <TableCell>{new Date(crf.updated_at,).toLocaleString()}</TableCell>
                                            {(can_view || can_delete || can_approve || can_acknowledge || can_assign_itd || can_assign_vendor || can_update_own_crf) && (
                                                <TableCell>
                                                    <div className="flex gap-2">

                                                        {/* to update for PIC */}
                                                        {(can_view || (can_update_own_crf && crf.assigned_to)) && (
                                                            <Link href={`/crfs/${crf.id}`}>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    title="View CRF"
                                                                >
                                                                    <Eye className="h-4 w-4" />
                                                                </Button>
                                                            </Link>
                                                        )}

                                                        {/* FOR ADMIN TO REASSIGN PIC */}
                                                        {(can_assign_itd || can_assign_vendor) && (
                                                            <Link href={`/crfs/${crf.id}`}>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    title="View CRF"
                                                                >
                                                                    <Eye className="h-4 w-4" />
                                                                </Button>
                                                            </Link>
                                                        )}

                                                        {/* FOR HOU VIEW FULL DETAIL*/}
                                                        {can_approve && crf.application_status_id === 1 && (
                                                            <Link href={`/crfs/${crf.id}`}>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    title="View CRF"
                                                                >
                                                                    <Eye className="h-4 w-4" />
                                                                </Button>
                                                            </Link>
                                                        )}

                                                        {/* to approve for HOU*/}
                                                        {can_approve && crf.application_status_id === 1 && (
                                                                <>
                                                                    <Button
                                                                        variant="default"
                                                                        size="sm"
                                                                        onClick={() => handleApprove(crf.id,)}
                                                                        disabled={approvingId === crf.id}
                                                                        className="bg-green-600 hover:bg-green-700"
                                                                        title="Approve"
                                                                    >
                                                                        <CheckCircle className="h-4 w-4" />
                                                                    </Button>
                                                                </>    
                                                        )}

                                                        {/* to acknowledge */}
                                                        {can_acknowledge && crf.application_status_id === 2 && (
                                                            <Button
                                                                variant="default"
                                                                size="sm"
                                                                onClick={() => handleAcknowledge(crf.id)}
                                                                disabled={acknowledgingId === crf.id}
                                                                className="bg-blue-600 hover:bg-blue-700"
                                                                title="Acknowledge"
                                                            >
                                                                <ClipboardCheck className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                        
                                                        {/* to assign PIC */}
                                                        {(can_assign_itd || can_assign_vendor) && crf.application_status_id === 3 && (
                                                            <Button
                                                                variant="default"
                                                                size="sm"
                                                                onClick={() => handleOpenAssignModal(crf.id)}
                                                                className="bg-purple-600 hover:bg-purple-700"
                                                                title="Assign"
                                                            >
                                                                <UserPlus className="h-4 w-4" />
                                                            </Button>
                                                        )}

                                                        {/* to DELETE
                                                        {can_delete && (
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                onClick={() => handleDelete(crf.id)}
                                                                disabled={deletingId === crf.id}
                                                                title="Delete"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        )} */}
                                                        
                                                    </div>
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
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
                
                {/* FOR HOU DASHBOARD VIEW */}
                {(can_approve && can_view_department && department_crfs && department_crfs.length > 0) && (
                    <Card>
                        <CardHeader>
                            <CardTitle>CRF Progress/Closed</CardTitle>
                        </CardHeader>
                        <hr />
                        <CardContent>
                        <div className="rounded-md border overflow-hidden">
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
                                            Factor
                                        </TableHead>
                                        <TableHead className="font-bold text-white">
                                            Issue
                                        </TableHead>
                                        <TableHead className="font-bold text-white">
                                            Reason
                                        </TableHead>
                                        <TableHead className="font-bold text-white">
                                            Status
                                        </TableHead>
                                        <TableHead className="font-bold text-white">
                                            Approved By
                                        </TableHead>
                                        <TableHead className="font-bold text-white">
                                            Created At
                                        </TableHead>
                                        <TableHead className="font-bold text-white">
                                            Updated At
                                        </TableHead>

                                        {(can_view || can_delete || can_approve || can_acknowledge || can_assign_itd || can_assign_vendor) && (
                                            <TableHead className="font-bold text-white">
                                                Actions
                                            </TableHead>
                                        )}
                                        
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {department_crfs.map((crf, index) => (
                                        <TableRow key={crf.id} className="odd:bg-slate-100 dark:odd:bg-slate-800">
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{crf.fname}</TableCell>
                                            <TableCell>{crf.nric}</TableCell>
                                            <TableCell>{crf.department?.dname || 'N/A'}</TableCell>
                                            <TableCell>{crf.designation}</TableCell>
                                            <TableCell>{crf.extno}</TableCell>
                                            <TableCell>{crf.category?.cname || 'N/A'}</TableCell>
                                            <TableCell>{crf.factor ? crf.factor.name : 'N/A'}
                                            </TableCell>
                                            <TableCell className="max-w-xs">
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <p className="truncate cursor-help">
                                                                {crf.issue}
                                                            </p>
                                                        </TooltipTrigger>
                                                        <TooltipContent className="max-w-sm">
                                                            <p className="text-sm whitespace-pre-wrap">{crf.issue}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </TableCell>
                                            <TableCell>{crf.reason || '-'}</TableCell>
                                            <TableCell>{getStatusBadge(crf.application_status?.status)}</TableCell>
                                            <TableCell>{crf.approver?.name || '-'}</TableCell>
                                            <TableCell>{new Date(crf.created_at,).toLocaleString()}</TableCell>
                                            <TableCell>{new Date(crf.updated_at,).toLocaleString()}</TableCell>
                                            {(can_view || can_delete || can_approve || can_acknowledge || can_assign_itd || can_assign_vendor || can_update_own_crf) && (
                                                <TableCell>
                                                    <div className="flex gap-2">

                                                        {/* to update for PIC */}
                                                        {(can_view || (can_update_own_crf && crf.assigned_to)) && (
                                                            <Link href={`/crfs/${crf.id}`}>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    title="View CRF"
                                                                >
                                                                    <Eye className="h-4 w-4" />
                                                                </Button>
                                                            </Link>
                                                        )}

                                                        {/* FOR ADMIN TO REASSIGN PIC */}
                                                        {(can_assign_itd || can_assign_vendor) && (
                                                            <Link href={`/crfs/${crf.id}`}>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    title="View CRF"
                                                                >
                                                                    <Eye className="h-4 w-4" />
                                                                </Button>
                                                            </Link>
                                                        )}

                                                        {/* FOR HOU VIEW FULL DETAIL*/}
                                                        {can_approve && crf.application_status_id === 1 && (
                                                            <Link href={`/crfs/${crf.id}`}>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    title="View CRF"
                                                                >
                                                                    <Eye className="h-4 w-4" />
                                                                </Button>
                                                            </Link>
                                                        )}

                                                        {/* to approve for HOU*/}
                                                        {can_approve && crf.application_status_id === 1 && (
                                                                <>
                                                                    <Button
                                                                        variant="default"
                                                                        size="sm"
                                                                        onClick={() => handleApprove(crf.id,)}
                                                                        disabled={approvingId === crf.id}
                                                                        className="bg-green-600 hover:bg-green-700"
                                                                        title="Approve"
                                                                    >
                                                                        <CheckCircle className="h-4 w-4" />
                                                                    </Button>
                                                                </>    
                                                        )}

                                                        {/* to acknowledge */}
                                                        {can_acknowledge && crf.application_status_id === 2 && (
                                                            <Button
                                                                variant="default"
                                                                size="sm"
                                                                onClick={() => handleAcknowledge(crf.id)}
                                                                disabled={acknowledgingId === crf.id}
                                                                className="bg-blue-600 hover:bg-blue-700"
                                                                title="Acknowledge"
                                                            >
                                                                <ClipboardCheck className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                        
                                                        {/* to assign PIC */}
                                                        {(can_assign_itd || can_assign_vendor) && crf.application_status_id === 3 && (
                                                            <Button
                                                                variant="default"
                                                                size="sm"
                                                                onClick={() => handleOpenAssignModal(crf.id)}
                                                                className="bg-purple-600 hover:bg-purple-700"
                                                                title="Assign"
                                                            >
                                                                <UserPlus className="h-4 w-4" />
                                                            </Button>
                                                        )}

                                                        {/* to DELETE
                                                        {can_delete && (
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                onClick={() => handleDelete(crf.id)}
                                                                disabled={deletingId === crf.id}
                                                                title="Delete"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        )} */}
                                                        
                                                    </div>
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
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
                )}

                {/* Assignment Modal */}
                {selectedCrfId && (
                    <AssignCrfModal
                        crfId={selectedCrfId}
                        isOpen={assignModalOpen}
                        onClose={handleCloseAssignModal}
                        itdPics={itd_pics}
                        vendorPics={vendor_pics}
                        canAssignItd={can_assign_itd}
                        canAssignVendor={can_assign_vendor}
                    />
                )}

            </div>
        </AppLayout>
    );
}
