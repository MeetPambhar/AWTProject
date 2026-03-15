'use client';

import { useActionState, useEffect, useRef } from 'react';
import { changePassword } from '@/app/actions/settings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export function PasswordForm() {
    const [state, action, pending] = useActionState(changePassword, null);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (state?.success) {
            toast.success(state.message);
            formRef.current?.reset();
        } else if (state?.error) {
            toast.error(state.error);
        }
    }, [state]);

    return (
        <form ref={formRef} action={action} className="space-y-5 max-w-md">
            <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" name="currentPassword" type="password" required />
            </div>
            <div className="p-4 bg-muted/30 rounded-lg space-y-4 border border-border/50">
                <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" name="newPassword" type="password" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" name="confirmPassword" type="password" required />
                </div>
            </div>
            <div className="flex justify-start pt-3">
                <Button type="submit" disabled={pending} variant="secondary" className="min-w-[160px]">
                    {pending ? 'Updating Password...' : 'Update Password'}
                </Button>
            </div>
        </form>
    );
}
