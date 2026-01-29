'use client';

import { useActionState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createBooking } from '@/app/actions/bookings';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

type Resource = {
    id: number;
    name: string;
    type: string;
};

type User = {
    id: number;
    name: string;
};

type State = {
    success: boolean;
    error?: string;
    message?: string;
}

const initialState: State = {
    success: false,
    message: '',
    error: '',
};

export function BookingForm({ resources, users }: { resources: Resource[], users: User[] }) {
    const [state, action, isPending] = useActionState<State, FormData>(createBooking, initialState);

    useEffect(() => {
        if (state.success && state.message) {
            toast.success(state.message);
        } else if (state.error) {
            toast.error(state.error);
        }
    }, [state]);

    return (
        <form action={action} className="space-y-4 p-4 border rounded-lg bg-card text-card-foreground shadow-sm">
            <h3 className="text-lg font-semibold">New Booking Request</h3>

            <div className="grid gap-2">
                <label htmlFor="resourceId" className="text-sm font-medium">Select Resource</label>
                <select
                    name="resourceId"
                    id="resourceId"
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <option value="">-- Select a Resource --</option>
                    {resources.map((res) => (
                        <option key={res.id} value={res.id}>{res.name} ({res.type})</option>
                    ))}
                </select>
            </div>

            <div className="grid gap-2">
                <label htmlFor="userId" className="text-sm font-medium">Select Human (Temp for Dev)</label>
                <select
                    name="userId"
                    id="userId"
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <option value="">-- Select a User --</option>
                    {users.map((user) => (
                        <option key={user.id} value={user.id}>{user.name}</option>
                    ))}
                </select>
            </div>

            <div className="grid gap-2">
                <label htmlFor="bookingDate" className="text-sm font-medium">Date</label>
                <Input type="date" name="bookingDate" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <label htmlFor="startTime" className="text-sm font-medium">Start Time</label>
                    <Input type="time" name="startTime" required />
                </div>
                <div className="grid gap-2">
                    <label htmlFor="endTime" className="text-sm font-medium">End Time</label>
                    <Input type="time" name="endTime" required />
                </div>
            </div>

            <div className="grid gap-2">
                <label htmlFor="purpose" className="text-sm font-medium">Purpose</label>
                <Input type="text" name="purpose" placeholder="e.g., Team Meeting, Lecture" required />
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Submit Booking Request
            </Button>
        </form>
    );
}
