import { prisma } from '@/lib/db';
import { ResourceForm } from '@/components/resources/ResourceForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getResources } from '@/app/actions/resources';
import { Badge } from '@/components/ui/badge'; // Will need to create this later or use inline styles

export default async function ResourcesPage() {
    const buildingsData = await prisma.building.findMany({
        select: { id: true, name: true }
    });

    const typesData = await prisma.resourceType.findMany({
        select: { id: true, name: true }
    });

    const componentBuildings = buildingsData.map(b => ({ id: b.id, name: b.name }));
    const componentTypes = typesData.map(t => ({ id: t.id, name: t.name }));

    const resourcesResult = await getResources();
    const resources = resourcesResult.success ? resourcesResult.data : [];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-heading font-bold text-foreground">Resources</h1>
                <p className="text-muted-foreground">Manage classrooms, labs, and other facilities.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Add New Resource</CardTitle>
                            <CardDescription>Register a new facility in the system.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResourceForm buildings={componentBuildings} types={componentTypes} />
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-2 space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        {resources && resources.map((res: any) => (
                            <Card key={res.id}>
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">
                                                {res.type.type_name}
                                            </div>
                                            <CardTitle className="text-lg">{res.name}</CardTitle>
                                        </div>
                                        <div className={`px-2 py-1 rounded text-xs font-medium ${res.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                            {res.status}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-sm text-muted-foreground space-y-1">
                                        <p>Building: {res.building.building_name} (Floor {res.floorNumber})</p>
                                        <p>Capacity: {res.capacity} People</p>
                                        <p className="italic">{res.description}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    {(!resources || resources.length === 0) && (
                        <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg">
                            No resources found. Add one to get started.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
