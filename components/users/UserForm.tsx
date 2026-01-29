'use client';

import { useActionState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createUser } from '@/app/actions/users';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

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

export function UserForm() {
    const [state, action, isPending] = useActionState<State, FormData>(createUser, initialState);

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
                <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                <Input type="text" name="name" placeholder="John Doe" required />
            </div>

            <div className="grid gap-2">
                <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                <Input type="email" name="email" placeholder="john@example.com" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <label htmlFor="password" className="text-sm font-medium">Password</label>
                    <Input type="password" name="password" placeholder="••••••••" required />
                </div>
                <div className="grid gap-2">
                    <label htmlFor="role" className="text-sm font-medium">Role</label>
                    <select
                        name="role"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <label htmlFor="department" className="text-sm font-medium">Department</label>
                    <Input type="text" name="department" placeholder="e.g. IT, Science" />
                </div>
                <div className="grid gap-2">
                    <label htmlFor="phone" className="text-sm font-medium">Phone</label>
                    <Input type="tel" name="phone" placeholder="+1234567890" />
                </div>
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Create User
            </Button>
        </form>
    );
}
