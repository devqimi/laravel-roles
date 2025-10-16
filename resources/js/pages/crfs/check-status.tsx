import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Search, Eye, Clock } from 'lucide-react';
import { useState } from 'react';

type CrfResult = {
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
    assigned_user: { name: string } | null;
    approver: { name: string } | null;
    it_remark: string | null;
    created_at: string;
    updated_at: string;
};

type Props = {
    searchResults?: CrfResult[];
    searchNric?: string;
    searchValue?: string;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Check CRF Status', href: '/crfs/check-status' },
];

export default function CheckCrfStatus({ searchResults, searchNric }: Props) {
    const [nric, setNric] = useState(searchNric || '');
    const [searchValue, setSearchValue] = useState(searchNric || '');
    const [isSearching, setIsSearching] = useState(false);
    const [selectedCrf, setSelectedCrf] = useState<CrfResult | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchValue.trim()) {
            alert('Please enter your Name/NRIC/CRF ID');
            return;
        }

        setIsSearching(true);
        router.get(
            '/crfs/check-status',
            { search: searchValue.trim() },
            {
                preserveState: true,
                preserveScroll: true,
                onFinish: () => setIsSearching(false),
            }
        );
    };

    const handleViewDetails = (crf: CrfResult) => {
        setSelectedCrf(crf);
        setModalOpen(true);
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            'First Created': 'bg-yellow-100 text-yellow-800 border-yellow-300',
            'Verified': 'bg-green-100 text-green-800 border-green-300',
            'ITD Acknowledged': 'bg-blue-100 text-blue-800 border-blue-300',
            'Assigned to ITD': 'bg-purple-100 text-purple-800 border-purple-300',
            'Assigned to Vendor': 'bg-orange-100 text-orange-800 border-orange-300',
            'Reassigned to ITD': 'bg-purple-200 text-purple-900 border-purple-400',
            'Reassigned to Vendor': 'bg-orange-200 text-orange-900 border-orange-400',
            'Work in progress': 'bg-indigo-100 text-indigo-800 border-indigo-300',
            'Closed': 'bg-gray-200 text-gray-900 border-gray-400',
        };

        return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
    };

    const getStatusIcon = (status: string) => {
        const icons: Record<string, string> = {
            'First Created': '📝',
            'Verified': '✅',
            'ITD Acknowledged': '👁️',
            'Assigned to ITD': '👤',
            'Assigned to Vendor': '🏢',
            'Reassigned to ITD': '🔄',
            'Reassigned to Vendor': '🔄',
            'Work in progress': '⚙️',
            'Closed': '✔️',
        };

        return icons[status] || '📄';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Check CRF Status" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Check CRF Status</CardTitle>
                        <CardDescription>
                            Enter your Name, NRIC, or CRF ID to track your CRF submissions
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch} className="flex gap-4">
                            <div className="flex-1">
                                <Label htmlFor="search" className="sr-only">
                                    Search
                                </Label>
                                <Input
                                    id="search"
                                    placeholder="Enter Name, NRIC, or CRF ID"
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    required
                                />
                            </div>
                            <Button type="submit" disabled={isSearching}>
                                <Search className="mr-2 h-4 w-4" />
                                {isSearching ? 'Searching...' : 'Search'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Search Results */}
                {searchResults && (
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {searchResults.length > 0
                                    ? `Found ${searchResults.length} CRF(s)`
                                    : 'No CRFs Found'}
                            </CardTitle>
                            {searchResults.length > 0 && (
                                <CardDescription>
                                    Showing results for: {searchNric}
                                </CardDescription>
                            )}
                        </CardHeader>
                        <CardContent>
                            {searchResults.length === 0 ? (
                                <div className="py-12 text-center">
                                    <p className="text-gray-500">
                                        No CRF submissions found for this NRIC.
                                    </p>
                                    <p className="mt-2 text-sm text-gray-400">
                                        Please check your NRIC or contact IT support.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {searchResults.map((crf) => (
                                        <div
                                            key={crf.id}
                                            className="rounded-lg border p-4 hover:bg-gray-50 transition"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1 space-y-2">
                                                    <div className="flex items-center gap-3">
                                                        <h3 className="font-semibold text-lg">
                                                            CRF #{crf.id}
                                                        </h3>
                                                        <span
                                                            className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(crf.application_status.status)}`}
                                                        >
                                                            {getStatusIcon(crf.application_status.status)}{' '}
                                                            {crf.application_status.status}
                                                        </span>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                                                        <div>
                                                            <span className="text-gray-500">Category:</span>{' '}
                                                            <span className="font-medium">
                                                                {crf.category.cname}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-500">Department:</span>{' '}
                                                            <span className="font-medium">
                                                                {crf.department.dname}
                                                            </span>
                                                        </div>
                                                        <div className="col-span-2">
                                                            <span className="text-gray-500">Issue:</span>{' '}
                                                            <span className="font-medium">{crf.issue}</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-500">Submitted:</span>{' '}
                                                            <span className="font-medium">
                                                                {new Date(crf.created_at).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-500">Last Updated:</span>{' '}
                                                            <span className="font-medium">
                                                                {new Date(crf.updated_at).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <Button
                                                    onClick={() => handleViewDetails(crf)}
                                                    variant="outline"
                                                    size="sm"
                                                    className="ml-4"
                                                >
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    View Details
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Details Modal */}
                {selectedCrf && (
                    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                        <DialogContent className="!max-w-5xl w-[90vw] max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>CRF Details - #{selectedCrf.id}</DialogTitle>
                                <DialogDescription>
                                    Complete information and status timeline for this CRF
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-6 py-4">
                                {/* Status Badge */}
                                <div className="flex items-center justify-center">
                                    <span
                                        className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(selectedCrf.application_status.status)}`}
                                    >
                                        {getStatusIcon(selectedCrf.application_status.status)}{' '}
                                        Current Status: {selectedCrf.application_status.status}
                                    </span>
                                </div>

                                {/* Status Timeline */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                                        <Clock className="h-4 w-4" />
                                        Status Timeline
                                    </h4>
                                    <div className="flex items-center gap-2 flex-wrap justify-center">
                                        <StatusStep
                                            label="Created"
                                            active={true}
                                            completed={true}
                                        />
                                        <Arrow />
                                        <StatusStep
                                            label="Verified"
                                            active={
                                                selectedCrf.application_status.status !== 'First Created'
                                            }
                                            completed={
                                                selectedCrf.application_status.status !== 'First Created'
                                            }
                                        />
                                        <Arrow />
                                        <StatusStep
                                            label="Acknowledged"
                                            active={[
                                                'ITD Acknowledged',
                                                'Assigned to ITD',
                                                'Assigned to Vendor',
                                                'Reassigned to ITD',
                                                'Reassigned to Vendor',
                                                'Work in progress',
                                                'Closed',
                                            ].includes(selectedCrf.application_status.status)}
                                            completed={[
                                                'Assigned to ITD',
                                                'Assigned to Vendor',
                                                'Reassigned to ITD',
                                                'Reassigned to Vendor',
                                                'Work in progress',
                                                'Closed',
                                            ].includes(selectedCrf.application_status.status)}
                                        />
                                        <Arrow />
                                        <StatusStep
                                            label="Assigned"
                                            active={[
                                                'Assigned to ITD',
                                                'Assigned to Vendor',
                                                'Reassigned to ITD',
                                                'Reassigned to Vendor',
                                                'Work in progress',
                                                'Closed',
                                            ].includes(selectedCrf.application_status.status)}
                                            completed={[
                                                'Work in progress',
                                                'Closed',
                                            ].includes(selectedCrf.application_status.status)}
                                        />
                                        <Arrow />
                                        <StatusStep
                                            label="In Progress"
                                            active={[
                                                'Work in progress',
                                                'Closed',
                                            ].includes(selectedCrf.application_status.status)}
                                            completed={
                                                selectedCrf.application_status.status === 'Closed'
                                            }
                                        />
                                        <Arrow />
                                        <StatusStep
                                            label="Closed"
                                            active={
                                                selectedCrf.application_status.status === 'Closed'
                                            }
                                            completed={
                                                selectedCrf.application_status.status === 'Closed'
                                            }
                                        />
                                    </div>
                                </div>

                                {/* CRF Details */}
                                <div className="space-y-4">
                                    <h4 className="font-semibold">Request Information</h4>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <Label className="text-gray-600">Name</Label>
                                            <p className="font-medium">{selectedCrf.fname}</p>
                                        </div>
                                        <div>
                                            <Label className="text-gray-600">NRIC</Label>
                                            <p className="font-medium">{selectedCrf.nric}</p>
                                        </div>
                                        <div>
                                            <Label className="text-gray-600">Department</Label>
                                            <p className="font-medium">{selectedCrf.department.dname}</p>
                                        </div>
                                        <div>
                                            <Label className="text-gray-600">Designation</Label>
                                            <p className="font-medium">{selectedCrf.designation}</p>
                                        </div>
                                        <div>
                                            <Label className="text-gray-600">Ext & HP No</Label>
                                            <p className="font-medium">{selectedCrf.extno}</p>
                                        </div>
                                        <div>
                                            <Label className="text-gray-600">Category</Label>
                                            <p className="font-medium">{selectedCrf.category.cname}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <Label className="text-gray-600">Issue / Change Required</Label>
                                            <p className="font-medium">{selectedCrf.issue}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <Label className="text-gray-600">Reason</Label>
                                            <p className="font-medium">{selectedCrf.reason || '-'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Assignment Info */}
                                <div className="space-y-4">
                                    <h4 className="font-semibold">Assignment Information</h4>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <Label className="text-gray-600">Approved By (HOU)</Label>
                                            <p className="font-medium">{selectedCrf.approver?.name || 'Pending approval'}</p>
                                        </div>
                                        <div>
                                            <Label className="text-gray-600">Assigned To</Label>
                                            <p className="font-medium">{selectedCrf.assigned_user?.name || 'Not assigned yet'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* IT Remark */}
                                {selectedCrf.it_remark && (
                                    <div className="space-y-2">
                                        <h4 className="font-semibold">IT/Vendor Remark</h4>
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                            <p className="text-sm">{selectedCrf.it_remark}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Timestamps */}
                                <div className="grid grid-cols-2 gap-4 text-sm pt-4 border-t">
                                    <div>
                                        <Label className="text-gray-600">Created At</Label>
                                        <p className="font-medium">{new Date(selectedCrf.created_at).toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <Label className="text-gray-600">Last Updated</Label>
                                        <p className="font-medium">{new Date(selectedCrf.updated_at).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                )}
            </div>
        </AppLayout>
    );
}

// Helper components for status timeline
function StatusStep({
    label,
    active,
    completed,
}: {
    label: string;
    active: boolean;
    completed: boolean;
}) {
    return (
        <div className="flex flex-col items-center">
            <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition ${
                    completed
                        ? 'bg-green-500 text-white'
                        : active
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-500'
                }`}
            >
                {completed ? '✓' : active ? '●' : '○'}
            </div>
            <span className="mt-2 text-xs text-gray-600 text-center max-w-[60px]">{label}</span>
        </div>
    );
}

function Arrow() {
    return <span className="text-gray-400 text-xl pb-6">→</span>;
}