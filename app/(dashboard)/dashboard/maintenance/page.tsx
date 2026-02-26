import { prisma } from '@/lib/db';
import { MaintenanceForm } from '@/components/maintenance/MaintenanceForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getMaintenanceRecords } from '@/app/actions/maintenance';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Clock, CheckCircle2, User, Building2, Wrench } from 'lucide-react';
import { MaintenanceActions } from '@/components/maintenance/MaintenanceActions';
import { SearchFilter } from '@/components/ui/SearchFilter';
import { Pagination } from '@/components/ui/Pagination';

export default async function MaintenancePage({
    searchParams
}: {
    searchParams: Promise<{ q?: string; status?: string; priority?: string; page?: string }>
}) {
    const params = await searchParams;

    const resources = await prisma.resource.findMany({
        select: { id: true, name: true }
    });

    const users = await prisma.user.findMany({
        select: { id: true, name: true }
    });

    const maintenanceResult = await getMaintenanceRecords(params);
    const maintenance = maintenanceResult.success ? maintenanceResult.data : [];
    const total = maintenanceResult.success ? (maintenanceResult as any).total : 0;
    const page = maintenanceResult.success ? (maintenanceResult as any).page : 1;
    const limit = maintenanceResult.success ? (maintenanceResult as any).limit : 5;

    const filters = [
        {
            name: 'status',
            options: [
                { label: 'Reported', value: 'reported' },
                { label: 'In Progress', value: 'in_progress' },
                { label: 'Resolved', value: 'resolved' }
            ]
        },
        {
            name: 'priority',
            options: [
                { label: 'Low', value: 'low' },
                { label: 'Medium', value: 'medium' },
                { label: 'High', value: 'high' },
                { label: 'Urgent', value: 'urgent' }
            ]
        }
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-heading font-bold text-foreground">Maintenance</h1>
                <p className="text-muted-foreground">Track and manage facility issues and repairs.</p>
            </div>

            <SearchFilter
                placeholder="Search by issue, resource, or reporter..."
                filters={filters}
            />

            <div className="grid lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4">
                    <Card className="sticky top-24 border-primary/10">
                        <CardHeader>
                            <CardTitle>Report Issue</CardTitle>
                            <CardDescription>Submit a new maintenance request.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <MaintenanceForm resources={resources} users={users} />
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-8 space-y-6">
                    <div className="space-y-4">
                        {maintenance && maintenance.map((record: any) => (
                            <Card key={record.id} className="relative overflow-hidden group hover:border-primary/50 transition-all duration-300">
                                <div className={`absolute top-0 left-0 w-1.5 h-full ${record.priority === 'urgent' ? 'bg-red-600' :
                                    record.priority === 'high' ? 'bg-orange-500' :
                                        record.priority === 'medium' ? 'bg-amber-400' :
                                            'bg-blue-400'
                                    }`} />
                                <CardHeader className="pb-3 border-b bg-muted/10">
                                    <div className="flex justify-between items-start pl-2">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <Badge className={`${record.priority === 'urgent' ? 'bg-red-500/10 text-red-700' :
                                                    record.priority === 'high' ? 'bg-orange-500/10 text-orange-700' :
                                                        'bg-muted text-muted-foreground'
                                                    } text-[10px] uppercase font-bold tracking-tight border-none`}>
                                                    {record.priority}
                                                </Badge>
                                                <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    Reported {new Date(record.reportedAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <CardTitle className="text-base font-bold">{record.issueTitle}</CardTitle>
                                        </div>
                                        <MaintenanceActions record={record} />
                                    </div>
                                </CardHeader>
                                <CardContent className="pl-6 pt-4 space-y-4">
                                    <p className="text-sm text-foreground/80 leading-relaxed italic border-l-2 border-primary/20 pl-3">
                                        "{record.issueDescription}"
                                    </p>
                                    <div className="flex flex-wrap gap-y-3 gap-x-6 items-center pt-2 text-xs">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Building2 className="h-3.5 w-3.5" />
                                            <span className="text-foreground font-semibold">{record.resource.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <User className="h-3.5 w-3.5" />
                                            <span className="text-foreground font-semibold">{record.reporter.name}</span>
                                        </div>
                                        <div className={`flex items-center gap-1.5 ml-auto px-2.5 py-1 rounded-full font-bold tracking-tight shadow-sm ${record.status === 'resolved' ? 'bg-green-100 text-green-700' :
                                            record.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                                                'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {record.status === 'resolved' ? <CheckCircle2 className="h-3 w-3" /> :
                                                record.status === 'in_progress' ? <Clock className="h-3 w-3" /> :
                                                    <AlertTriangle className="h-3 w-3" />
                                            }
                                            {record.status.replace('_', ' ').toUpperCase()}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {maintenance && maintenance.length > 0 && (
                            <div className="pt-4">
                                <Pagination
                                    totalItems={total}
                                    itemsPerPage={limit}
                                    currentPage={page}
                                />
                            </div>
                        )}

                        {(!maintenance || maintenance.length === 0) && (
                            <div className="text-center py-24 bg-muted/10 border border-dashed rounded-xl">
                                <div className="p-4 bg-muted w-max mx-auto rounded-full mb-4">
                                    <Wrench className="h-10 w-10 text-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-semibold">No maintenance records found</h3>
                                <p className="text-muted-foreground text-sm">Try adjusting your filters or search query.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
