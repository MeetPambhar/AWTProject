'use client';

import { useActionState, useEffect } from 'react';
import { updateProfile } from '@/app/actions/settings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export function SettingsForm({ user }: { user: any }) {
    const [state, action, pending] = useActionState(updateProfile, null);

    useEffect(() => {
        if (state?.success) {
            toast.success(state.message);
        } else if (state?.error) {
            toast.error(state.error);
        }
    }, [state]);

    return (
        <form action={action} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" name="name" defaultValue={user.name} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" defaultValue={user.email} disabled className="bg-muted cursor-not-allowed text-muted-foreground" />
                    <p className="text-xs text-muted-foreground mt-1 px-1">Email address cannot be changed.</p>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" name="phone" defaultValue={user.phone || ''} placeholder="+1 (555) 000-0000" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input id="department" name="department" defaultValue={user.department || ''} placeholder="e.g. Engineering" />
                </div>
            </div>
            <div className="flex justify-end pt-6 border-t mt-6">
                <Button type="submit" disabled={pending} className="min-w-[140px]">
                    {pending ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>
        </form>
    );
}
