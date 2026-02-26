'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { deleteUser } from '@/app/actions/users';
import { Trash2, Loader2, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

type UserActionsProps = {
    user: any;
};

export function UserActions({ user }: UserActionsProps) {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Prevent deleting self (in a real app we'd check session, for now we just show the button but handle it)
    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const result = await deleteUser(user.id);
            if (result.success) {
                toast.success('User deleted successfully');
                setIsDeleteDialogOpen(false);
            } else {
                toast.error(result.error || 'Failed to delete user');
            }
        } catch (error) {
            toast.error('An unexpected error occurred');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="flex gap-2">
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
                            <ShieldAlert className="h-6 w-6 text-red-600" />
                        </div>
                        <DialogTitle className="text-center">Confirm User Deletion</DialogTitle>
                        <DialogDescription className="text-center">
                            Are you sure you want to delete <strong>{user.name}</strong> ({user.email})?
                            This will also remove all their associated data.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col sm:flex-row justify-center gap-3 mt-4">
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className="sm:w-28">Cancel</Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="sm:w-32"
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
