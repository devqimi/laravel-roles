import { Button } from '@/components/ui/button';
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
import { router } from '@inertiajs/react';
import { useState } from 'react';

type User = {
    id: number;
    name: string;
};

type Props = {
    crfId: number;
    isOpen: boolean;
    onClose: () => void;
    itdPics: User[];
    vendorPics: User[];
    canAssignItd: boolean;
    canAssignVendor: boolean;
};

export default function AssignCrfModal({
    crfId,
    isOpen,
    onClose,
    itdPics,
    vendorPics,
    canAssignItd,
    canAssignVendor,
}: Props) {
    const [assignType, setAssignType] = useState<'itd' | 'vendor' | ''>('');
    const [selectedUser, setSelectedUser] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = () => {
        if (!assignType || !selectedUser) {
            alert('Please select assignment type and user');
            return;
        }

        setIsSubmitting(true);

        const route =
            assignType === 'itd'
                ? `/crfs/${crfId}/assign-to-itd`
                : `/crfs/${crfId}/assign-to-vendor`;

        router.post(
            route,
            { assigned_to: selectedUser },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsSubmitting(false);
                    resetForm();
                    onClose();
                },
                onError: () => {
                    setIsSubmitting(false);
                    alert('Failed to assign CRF');
                },
            }
        );
    };

    const resetForm = () => {
        setAssignType('');
        setSelectedUser('');
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const availableUsers = assignType === 'itd' ? itdPics : vendorPics;

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Assign CRF</DialogTitle>
                    <DialogDescription>
                        Choose whether to assign this CRF to ITD or Vendor,
                        then select the specific person.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {/* Assignment Type Selection */}
                    <div className="grid gap-2">
                        <Label>Assign To</Label>
                        <div className="flex gap-4">
                            {canAssignItd && (
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="assignType"
                                        value="itd"
                                        checked={assignType === 'itd'}
                                        onChange={(e) => {
                                            setAssignType('itd');
                                            setSelectedUser('');
                                        }}
                                        className="h-4 w-4"
                                    />
                                    <span>ITD</span>
                                </label>
                            )}
                            {canAssignVendor && (
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="assignType"
                                        value="vendor"
                                        checked={assignType === 'vendor'}
                                        onChange={(e) => {
                                            setAssignType('vendor');
                                            setSelectedUser('');
                                        }}
                                        className="h-4 w-4"
                                    />
                                    <span>Vendor</span>
                                </label>
                            )}
                        </div>
                    </div>

                    {/* User Selection */}
                    {assignType && (
                        <div className="grid gap-2">
                            <Label htmlFor="user">
                                Select {assignType === 'itd' ? 'ITD' : 'Vendor'}{' '}
                                PIC
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
                                            No {assignType === 'itd' ? 'ITD' : 'Vendor'} PICs available
                                        </div>
                                    ) : (
                                        availableUsers.map((user) => (
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
                        onClick={handleClose}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={!assignType || !selectedUser || isSubmitting}
                    >
                        {isSubmitting ? 'Assigning...' : 'Assign CRF'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}