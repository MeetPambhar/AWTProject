import { prisma } from '@/lib/db';
import { SettingsForm } from '@/components/settings/SettingsForm';
import { PasswordForm } from '@/components/settings/PasswordForm';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { cookies } from 'next/headers';
import { decrypt } from '@/lib/session';
import { User } from 'lucide-react';

export default async function SettingsPage() {
    const session = (await cookies()).get('session')?.value;
    const payload = await decrypt(session);
    
    if (!payload?.userId) return null;

    const user = await prisma.user.findUnique({
        where: { id: payload.userId as number },
        select: { id: true, name: true, email: true, phone: true, department: true, role: true }
    });

    if (!user) return null;

    return (
        <div className="space-y-8 max-w-4xl mx-auto fade-in pb-12">
            <div>
                <h1 className="text-3xl font-heading font-bold text-foreground">Account Settings</h1>
                <p className="text-muted-foreground mt-1">Manage your personal information and security preferences.</p>
            </div>
            
            <div className="grid gap-8">
                <Card className="border-border shadow-sm">
                    <CardHeader className="bg-muted/10 border-b pb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
                                <User className="w-5 h-5" />
                            </div>
                            <div>
                                <CardTitle className="text-xl">Profile Information</CardTitle>
                                <CardDescription className="mt-1">
                                    Update your personal details and how others see you on the system.
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <SettingsForm user={user} />
                    </CardContent>
                </Card>

                <Card className="border-border shadow-sm">
                    <CardHeader className="bg-muted/10 border-b pb-4">
                        <CardTitle className="text-xl text-foreground">Security</CardTitle>
                        <CardDescription className="mt-1">
                            Update your password to keep your account secure.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <PasswordForm />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
