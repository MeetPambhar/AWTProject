import { prisma } from '@/lib/db';
import { UserForm } from '@/components/users/UserForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getUsers } from '@/app/actions/users';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, Building, User as UserIcon } from 'lucide-react';
import { UserActions } from '@/components/users/UserActions';
import { SearchFilter } from '@/components/ui/SearchFilter';
import { Pagination } from '@/components/ui/Pagination';

export default async function UsersPage({
    searchParams
}: {
    searchParams: Promise<{ q?: string; role?: string; department?: string; page?: string }>
}) {
    const params = await searchParams;
    const usersResult = await getUsers(params);
    const users = usersResult.success ? usersResult.data : [];
    const total = usersResult.success ? (usersResult as any).total : 0;
    const page = usersResult.success ? (usersResult as any).page : 1;
    const limit = usersResult.success ? (usersResult as any).limit : 8;

    const filters = [
        {
            name: 'role',
            options: [
                { label: 'Admin', value: 'admin' },
                { label: 'User', value: 'user' }
            ]
        },
        {
            name: 'department',
            options: [
                { label: 'CS', value: 'CS' },
                { label: 'IT', value: 'IT' },
                { label: 'Admin', value: 'Admin' }
            ]
        }
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-heading font-bold text-foreground">Users</h1>
                <p className="text-muted-foreground">Manage system users and their permissions.</p>
            </div>

            <SearchFilter
                placeholder="Search by name or email..."
                filters={filters}
            />

            <div className="grid lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4">
                    <Card className="sticky top-24 border-primary/10">
                        <CardHeader>
                            <CardTitle>Add New User</CardTitle>
                            <CardDescription>Create a new system account.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <UserForm />
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-8 space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                        {users && users.map((user: any) => (
                            <Card key={user.id} className="relative overflow-hidden group hover:border-primary/50 transition-all duration-300">
                                <div className={`absolute top-0 right-0 h-16 w-16 bg-gradient-to-br transition-opacity ${user.role === 'admin' ? 'from-amber-200/20 to-transparent' : 'from-blue-200/10 to-transparent'}`} />
                                <CardHeader className="pb-3 border-b bg-muted/20">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-full ${user.role === 'admin' ? 'bg-amber-100/50 text-amber-700' : 'bg-primary/10 text-primary'}`}>
                                                <UserIcon className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-base font-bold">{user.name}</CardTitle>
                                                <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-tight">
                                                    {user.role}
                                                </Badge>
                                            </div>
                                        </div>
                                        <UserActions user={user} />
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-4 space-y-3">
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Mail className="h-3.5 w-3.5" />
                                            <span className="text-foreground truncate font-medium">{user.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Building className="h-3.5 w-3.5" />
                                            <span className="text-foreground font-medium">{user.department || 'General'}</span>
                                        </div>
                                        {user.phone && (
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Phone className="h-3.5 w-3.5" />
                                                <span className="text-foreground font-medium">{user.phone}</span>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {users && users.length > 0 && (
                        <div className="pt-4">
                            <Pagination
                                totalItems={total}
                                itemsPerPage={limit}
                                currentPage={page}
                            />
                        </div>
                    )}

                    {(!users || users.length === 0) && (
                        <div className="text-center py-20 bg-muted/10 border border-dashed rounded-xl">
                            <div className="p-4 bg-muted w-max mx-auto rounded-full mb-4">
                                <UserIcon className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold">No users found</h3>
                            <p className="text-muted-foreground text-sm">Try adjusting your search or filters.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
