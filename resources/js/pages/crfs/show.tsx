import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Textarea } from '@headlessui/react';
import { Head, router, useForm } from '@inertiajs/react';
import { UserCog } from 'lucide-react';
import { useState } from 'react';

type User = {
    id: number;
    name: string;
};

type CrfData = {
    id: number;
    fname: string;
    nric: string;
    department: { dname: string };
    designation: string;
    extno: string;
    category: { cname: string };
    issue: string;
    reason: string;
    application_status: { status: string };
    application_status_id: number;
    approver: { name: string } | null;
    assigned_user: { name: string } | null;
    assigned_to: number | null;
    created_at: string;
    it_remark: string | null;
};

type Props = {
    crf: CrfData;
    can_update: boolean;
    can_reassign_itd?: boolean;
    can_reassign_vendor?: boolean;
    itd_pics?: User[];
    vendor_pics?: User[];
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'View CRF', href: '#' },
];

export default function ShowCrf({ 
    crf, 
    can_update, 
    can_reassign_itd = false,
    can_reassign_vendor = false,
    itd_pics = [],
    vendor_pics = []
}: Props) {
    const [isEditing, setIsEditing] = useState(false);
    const [reassignModalOpen, setReassignModalOpen] = useState(false);
    const [reassignType, setReassignType] = useState<'itd' | 'vendor' | ''>('');
    const [selectedUser, setSelectedUser] = useState<string>('');
    const [isReassigning, setIsReassigning] = useState(false);

    const { data, setData, put, processing, errors } = useForm({
        it_remark: crf.it_remark || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/crfs/${crf.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setIsEditing(false);
            },
        });
    };

    const handleMarkInProgress = () => {
        if (confirm('Mark this CRF as "Work in progress"?')) {
            router.put(`/crfs/${crf.id}/mark-in-progress`, {}, {
                preserveScroll: true,
            });
        }
    };

    const handleMarkCompleted = () => {
        if (confirm('Mark this CRF as "Closed"?')) {
            router.put(`/crfs/${crf.id}/mark-completed`, {}, {
                preserveScroll: true,
            });
        }
    };

    const handleOpenReassignModal = () => {
        // Auto-select type based on current assignment
        if (crf.application_status_id === 4 || crf.application_status_id === 6 || crf.application_status_id === 8) {
            // Currently assigned to ITD
            setReassignType('itd');
        } else if (crf.application_status_id === 5 || crf.application_status_id === 7 || crf.application_status_id === 8) {
            // Currently assigned to Vendor
            setReassignType('vendor');
        }
        setReassignModalOpen(true);
    };

    const handleReassign = () => {
        if (!reassignType || !selectedUser) {
            alert('Please select user to reassign');
            return;
        }

        setIsReassigning(true);

        const route = reassignType === 'itd'
            ? `/crfs/${crf.id}/reassign-to-itd`
            : `/crfs/${crf.id}/reassign-to-vendor`;

        router.post(
            route,
            { assigned_to: selectedUser },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsReassigning(false);
                    setReassignModalOpen(false);
                    setReassignType('');
                    setSelectedUser('');
                },
                onError: () => {
                    setIsReassigning(false);
                    alert('Failed to reassign CRF');
                },
            }
        );
    };

    const availableUsers = reassignType === 'itd' ? itd_pics : vendor_pics;

    // Determine if reassign button should show
    const canReassign = (
        (can_reassign_itd && (crf.application_status_id === 4 || crf.application_status_id === 6 || crf.application_status_id === 8)) || // Assigned/Reassigned to ITD
        (can_reassign_vendor && (crf.application_status_id === 5 || crf.application_status_id === 7 || crf.application_status_id === 8)) // Assigned/Reassigned to Vendor
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="View CRF" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>CRF Details - #{crf.id}</CardTitle>
                        <div className="flex gap-2">
                            {canReassign && (
                                <Button 
                                    onClick={handleOpenReassignModal}
                                    variant="outline"
                                    className="border-purple-600 text-purple-600 hover:bg-purple-50"
                                >
                                    <UserCog className="mr-2 h-4 w-4" />
                                    Reassign
                                </Button>
                            )}
                            {can_update && (
                                <>
                                    {(crf.application_status.status === 'Assigned to ITD' || crf.application_status.status === 'Assigned to Vendor' || crf.application_status.status === 'Reassigned to ITD' || crf.application_status.status === 'Reassigned to Vendor') && (
                                        <Button onClick={handleMarkInProgress}>
                                            Mark as In Progress
                                        </Button>
                                    )}
                                    {crf.application_status.status === 'Work in progress' && (
                                        <Button onClick={handleMarkCompleted} className="bg-green-600 hover:bg-green-700">
                                            Mark as Closed
                                        </Button>
                                    )}
                                </>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        
                        {/* CRF Information */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-gray-600">Name</Label>
                                <p className="font-medium">{crf.fname}</p>
                            </div>
                            <div>
                                <Label className="text-gray-600">NRIC</Label>
                                <p className="font-medium">{crf.nric}</p>
                            </div>
                            <div>
                                <Label className="text-gray-600">Department</Label>
                                <p className="font-medium">{crf.department.dname}</p>
                            </div>
                            <div>
                                <Label className="text-gray-600">Designation</Label>
                                <p className="font-medium">{crf.designation}</p>
                            </div>
                            <div>
                                <Label className="text-gray-600">Ext & HP No</Label>
                                <p className="font-medium">{crf.extno}</p>
                            </div>
                            <div>
                                <Label className="text-gray-600">Category</Label>
                                <p className="font-medium">{crf.category.cname}</p>
                            </div>
                            <div className="col-span-2">
                                <Label className="text-gray-600">Issue</Label>
                                <p className="font-medium">{crf.issue}</p>
                            </div>
                            <div className="col-span-2">
                                <Label className="text-gray-600">Reason</Label>
                                <p className="font-medium">{crf.reason || '-'}</p>
                            </div>
                            <div>
                                <Label className="text-gray-600">Status</Label>
                                <p className="font-medium">{crf.application_status.status}</p>
                            </div>
                            <div>
                                <Label className="text-gray-600">Approved By</Label>
                                <p className="font-medium">{crf.approver?.name || '-'}</p>
                            </div>
                            <div>
                                <Label className="text-gray-600">Assigned To</Label>
                                <p className="font-medium">{crf.assigned_user?.name || '-'}</p>
                            </div>
                            <div>
                                <Label className="text-gray-600">Created At</Label>
                                <p className="font-medium">{new Date(crf.created_at).toLocaleString()}</p>
                            </div>
                        </div>

                        <hr />

                        {/* IT Remark Section */}
                        {can_update && (
                            <form onSubmit={handleSubmit}>
                                <div className="space-y-2">
                                    <Label htmlFor="it_remark">IT Remark</Label>
                                    {isEditing ? (
                                        <>
                                            <Textarea
                                                id="it_remark"
                                                value={data.it_remark}
                                                onChange={(e) => setData('it_remark', e.target.value)}
                                                rows={4}
                                                placeholder="Add your remark here..."
                                                className="w-full rounded border p-2"
                                            />
                                            {errors.it_remark && (
                                                <p className="text-sm text-red-500">{errors.it_remark}</p>
                                            )}
                                            <div className="flex gap-2">
                                                <Button type="submit" disabled={processing}>
                                                    Save Remark
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => setIsEditing(false)}
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <p className="rounded border p-3 bg-gray-50">
                                                {crf.it_remark || 'No remark yet'}
                                            </p>
                                            <Button type="button" onClick={() => setIsEditing(true)}>
                                                {crf.it_remark ? 'Edit Remark' : 'Add Remark'}
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </form>
                        )}
                        {!can_update && crf.it_remark && (
                            <div className="space-y-2">
                                <Label>IT Remark</Label>
                                <p className="rounded border p-3 bg-gray-50">{crf.it_remark}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Reassign Modal */}
                <Dialog open={reassignModalOpen} onOpenChange={setReassignModalOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Reassign CRF</DialogTitle>
                            <DialogDescription>
                                Select a new PIC to reassign this CRF to
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            {/* Show current assignment */}
                            <div className="bg-gray-50 p-3 rounded border">
                                <p className="text-sm text-gray-600">Currently assigned to:</p>
                                <p className="font-medium">{crf.assigned_user?.name || 'Unknown'}</p>
                            </div>

                            {/* Assignment Type (if both permissions) */}
                            {can_reassign_itd && can_reassign_vendor && (
                                <div className="grid gap-2">
                                    <Label>Reassign To</Label>
                                    <div className="flex gap-4">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="reassignType"
                                                value="itd"
                                                checked={reassignType === 'itd'}
                                                onChange={() => {
                                                    setReassignType('itd');
                                                    setSelectedUser('');
                                                }}
                                                className="h-4 w-4"
                                            />
                                            <span>ITD PIC</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="reassignType"
                                                value="vendor"
                                                checked={reassignType === 'vendor'}
                                                onChange={() => {
                                                    setReassignType('vendor');
                                                    setSelectedUser('');
                                                }}
                                                className="h-4 w-4"
                                            />
                                            <span>Vendor PIC</span>
                                        </label>
                                    </div>
                                </div>
                            )}

                            {/* User Selection */}
                            {reassignType && (
                                <div className="grid gap-2">
                                    <Label htmlFor="user">
                                        Select {reassignType === 'itd' ? 'ITD' : 'Vendor'} PIC
                                    </Label>
                                    <Select
                                        value={selectedUser}
                                        onValueChange={setSelectedUser}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choose a person" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableUsers.length === 0 ? (
                                                <div className="p-2 text-sm text-gray-500">
                                                    No {reassignType === 'itd' ? 'ITD' : 'Vendor'} PICs available
                                                </div>
                                            ) : (
                                                availableUsers
                                                    .filter((user) => user.id !== crf.assigned_to) // Exclude current assignee
                                                    .map((user) => (
                                                        <SelectItem
                                                            key={user.id}
                                                            value={user.id.toString()}
                                                        >
                                                            {user.name}
                                                        </SelectItem>
                                                    ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setReassignModalOpen(false)}
                                disabled={isReassigning}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                onClick={handleReassign}
                                disabled={!reassignType || !selectedUser || isReassigning}
                            >
                                {isReassigning ? 'Reassigning...' : 'Reassign CRF'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}