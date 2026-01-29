import { prisma } from '@/lib/db';
import { UserForm } from '@/components/users/UserForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getUsers } from '@/app/actions/users';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Shield, Building } from 'lucide-react';

export default async function UsersPage() {
    const usersResult = await getUsers();
    const users = usersResult.success ? usersResult.data : [];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-heading font-bold text-foreground">Users</h1>
                <p className="text-muted-foreground">Manage system access and roles.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Add New User</CardTitle>
                            <CardDescription>Create accounts for staff and faculty.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <UserForm />
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-2 space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>All Users</CardTitle>
                            <CardDescription>List of registered system users.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {users && users.map((user: any) => (
                                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-semibold flex items-center gap-2">
                                                    {user.name}
                                                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                                                        {user.role}
                                                    </Badge>
                                                </div>
                                                <div className="text-sm text-muted-foreground flex items-center gap-3">
                                                    <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {user.email}</span>
                                                    {user.department && <span className="flex items-center gap-1"><Building className="w-3 h-3" /> {user.department}</span>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right text-xs text-muted-foreground">
                                            Added: {new Date(user.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                ))}
                                {(!users || users.length === 0) && (
                                    <div className="text-center py-8 text-muted-foreground">
                                        No users found.
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
