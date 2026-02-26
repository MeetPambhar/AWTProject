'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { updateMaintenanceStatus, deleteMaintenance } from '@/app/actions/maintenance';
import { Trash2, Loader2, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { MaintenanceStatus } from '@prisma/client';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

type MaintenanceActionsProps = {
    record: any;
};

export function MaintenanceActions({ record }: MaintenanceActionsProps) {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const handleStatusUpdate = async (status: MaintenanceStatus) => {
        setIsUpdating(true);
        try {
            const result = await updateMaintenanceStatus(record.id, status);
            if (result.success) {
                toast.success(`Status updated to ${status}`);
            } else {
                toast.error('Failed to update status');
            }
        } catch (error) {
            toast.error('An unexpected error occurred');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const result = await deleteMaintenance(record.id);
            if (result.success) {
                toast.success('Record deleted successfully');
                setIsDeleteDialogOpen(false);
            } else {
                toast.error('Failed to delete record');
            }
        } catch (error) {
            toast.error('An unexpected error occurred');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="flex gap-2">
            {record.status === 'reported' && (
                <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-blue-600 hover:bg-blue-50 border-blue-200"
                    onClick={() => handleStatusUpdate(MaintenanceStatus.in_progress)}
                    disabled={isUpdating}
                >
                    <Clock className="h-4 w-4 mr-1" />
                    Start Fix
                </Button>
            )}

            {record.status === 'in_progress' && (
                <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-green-600 hover:bg-green-50 border-green-200"
                    onClick={() => handleStatusUpdate(MaintenanceStatus.resolved)}
                    disabled={isUpdating}
                >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Resolve
                </Button>
            )}

            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Maintenance Record</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this record? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-3 mt-4">
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            Delete
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
