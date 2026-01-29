'use client';

import { useActionState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createMaintenanceReport } from '@/app/actions/maintenance';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

type Resource = {
    id: number;
    name: string;
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

export function MaintenanceForm({ resources, users }: { resources: Resource[], users: User[] }) {
    const [state, action, isPending] = useActionState<State, FormData>(createMaintenanceReport, initialState);

    useEffect(() => {
        if (state.success && state.message) {
            toast.success(state.message);
        } else if (state.error) {
            toast.error(state.error);
        }
    }, [state]);

    return (
        <form action={action} className="space-y-4">
            <div className="grid gap-2">
                <label htmlFor="resourceId" className="text-sm font-medium">Select Resource</label>
                <select
                    name="resourceId"
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <option value="">-- Select Resource --</option>
                    {resources.map((res) => (
                        <option key={res.id} value={res.id}>{res.name}</option>
                    ))}
                </select>
            </div>

            <div className="grid gap-2">
                <label htmlFor="userId" className="text-sm font-medium">Reported By</label>
                <select
                    name="userId"
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <option value="">-- Select Person --</option>
                    {users.map((user) => (
                        <option key={user.id} value={user.id}>{user.name}</option>
                    ))}
                </select>
            </div>

            <div className="grid gap-2">
                <label htmlFor="issueTitle" className="text-sm font-medium">Issue Title</label>
                <Input type="text" name="issueTitle" placeholder="e.g., Projector not working" required />
            </div>

            <div className="grid gap-2">
                <label htmlFor="priority" className="text-sm font-medium">Priority</label>
                <select
                    name="priority"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                </select>
            </div>

            <div className="grid gap-2">
                <label htmlFor="issueDescription" className="text-sm font-medium">Description</label>
                <textarea
                    name="issueDescription"
                    rows={4}
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Describe the issue in detail..."
                />
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Submit Report
            </Button>
        </form>
    );
}
