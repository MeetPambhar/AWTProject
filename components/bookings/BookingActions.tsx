'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { updateBookingStatus } from '@/app/actions/bookings';
import { BookingStatus } from '@prisma/client';
import { XCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

type BookingActionsProps = {
    booking: any;
};

export function BookingActions({ booking }: BookingActionsProps) {
    const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);

    // Only allow cancelling if it's not already cancelled or rejected
    const canCancel = booking.status !== BookingStatus.cancelled &&
        booking.status !== BookingStatus.rejected &&
        booking.status !== BookingStatus.completed;

    if (!canCancel) return null;

    const handleCancel = async () => {
        setIsCancelling(true);
        try {
            const result = await updateBookingStatus(booking.id, BookingStatus.cancelled);
            if (result.success) {
                toast.success('Booking cancelled successfully');
                setIsCancelDialogOpen(false);
            } else {
                toast.error(result.error || 'Failed to cancel booking');
            }
        } catch (error) {
            toast.error('An unexpected error occurred');
        } finally {
            setIsCancelling(false);
        }
    };

    return (
        <div className="flex gap-2">
            <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10 h-8">
                        <XCircle className="h-4 w-4 mr-1" />
                        Cancel
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Cancel Booking?</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to cancel your booking for <strong>{booking.resource.name}</strong> on {new Date(booking.bookingDate).toLocaleDateString()}?
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-3 mt-4">
                        <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)}>No, keep it</Button>
                        <Button
                            variant="destructive"
                            onClick={handleCancel}
                            disabled={isCancelling}
                        >
                            {isCancelling ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            Yes, cancel booking
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
