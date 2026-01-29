'use client';

import { Button } from '@/components/ui/button';
import { updateBookingStatus } from '@/app/actions/bookings';
import { BookingStatus } from '@prisma/client'; // Keep in mind this might need to be imported from a type file if client-side import issues arise, but usually ok.
import { Check, X, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

// Manually defining enum if import fails on client boundary or just use strings
// enum BookingStatus {
//   pending = 'pending',
//   approved = 'approved',
//   rejected = 'rejected',
//   cancelled = 'cancelled',
//   completed = 'completed'
// }

export function BookingStatusActions({ id, status }: { id: number, status: string }) {
    const [isLoading, setIsLoading] = useState(false);

    const handleUpdate = async (newStatus: 'approved' | 'rejected') => {
        setIsLoading(true);
        try {
            // For now, we are not passing approverId specifically as authentication context is simple
            const result = await updateBookingStatus(id, newStatus as any);
            if (result.success) {
                toast.success(`Booking ${newStatus} successfully`);
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            toast.error("Failed to update status");
        } finally {
            setIsLoading(false);
        }
    };

    if (status !== 'pending') return null;

    return (
        <div className="flex gap-2">
            <Button
                size="sm"
                variant="outline"
                className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                onClick={() => handleUpdate('approved')}
                disabled={isLoading}
            >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                <span className="sr-only">Approve</span>
            </Button>
            <Button
                size="sm"
                variant="outline"
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => handleUpdate('rejected')}
                disabled={isLoading}
            >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
                <span className="sr-only">Reject</span>
            </Button>
        </div>
    );
}
