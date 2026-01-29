import { prisma } from '@/lib/db';
import { MaintenanceForm } from '@/components/maintenance/MaintenanceForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getMaintenanceRecords } from '@/app/actions/maintenance';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';

export default async function MaintenancePage() {
    const resources = await prisma.resource.findMany({
        select: { id: true, name: true }
    });

    const users = await prisma.user.findMany({
        select: { id: true, name: true }
    });

    const recordsResult = await getMaintenanceRecords();
    const records = recordsResult.success ? recordsResult.data : [];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-heading font-bold text-foreground">Maintenance</h1>
                <p className="text-muted-foreground">Report and track facility issues.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Report Issue</CardTitle>
                            <CardDescription>Submit a new maintenance request.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <MaintenanceForm resources={resources} users={users} />
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-xl font-semibold">Maintenance Log</h3>
                    <div className="space-y-4">
                        {records && records.map((record: any) => (
                            <Card key={record.id}>
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-semibold text-lg">{record.issueTitle}</h4>
                                                <Badge variant={
                                                    record.priority === 'critical' ? 'destructive' :
                                                        record.priority === 'high' ? 'destructive' :
                                                            'secondary'
                                                }>
                                                    {record.priority}
                                                </Badge>
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {record.resource.name} • Reported by {record.reporter.name}
                                            </div>
                                            <p className="text-sm pt-2">{record.issueDescription}</p>
                                        </div>
                                        <div className="text-right">
                                            <Badge variant="outline" className={`
                                    ${record.status === 'resolved' ? 'border-green-500 text-green-600' :
                                                    record.status === 'in_progress' ? 'border-blue-500 text-blue-600' :
                                                        'border-yellow-500 text-yellow-600'}
                                `}>
                                                {record.status === 'resolved' && <CheckCircle className="w-3 h-3 mr-1" />}
                                                {record.status === 'reported' && <AlertCircle className="w-3 h-3 mr-1" />}
                                                {record.status === 'in_progress' && <Clock className="w-3 h-3 mr-1" />}
                                                {record.status}
                                            </Badge>
                                            <div className="text-xs text-muted-foreground mt-2">
                                                {new Date(record.reportedAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                        {(!records || records.length === 0) && (
                            <div className="text-center py-12 text-muted-foreground">
                                No maintenance records found.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
