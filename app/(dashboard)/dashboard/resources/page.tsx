import { prisma } from '@/lib/db';
import { ResourceForm } from '@/components/resources/ResourceForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getResources } from '@/app/actions/resources';
import { ResourceActions } from '@/components/resources/ResourceActions';
import { SearchFilter } from '@/components/ui/SearchFilter';
import { Pagination } from '@/components/ui/Pagination';

export default async function ResourcesPage({
    searchParams
}: {
    searchParams: Promise<{ q?: string; type?: string; building?: string; status?: string; page?: string }>
}) {
    const params = await searchParams;

    const buildingsData = await prisma.building.findMany({
        select: { id: true, name: true }
    });

    const typesData = await prisma.resourceType.findMany({
        select: { id: true, name: true }
    });

    const componentBuildings = buildingsData.map(b => ({ id: b.id, name: b.name }));
    const componentTypes = typesData.map(t => ({ id: t.id, name: t.name }));

    const resourcesResult = await getResources(params);
    const resources = resourcesResult.success ? resourcesResult.data : [];
    const total = resourcesResult.success ? (resourcesResult as any).total : 0;
    const page = resourcesResult.success ? (resourcesResult as any).page : 1;
    const limit = resourcesResult.success ? (resourcesResult as any).limit : 6;

    const filters = [
        {
            name: 'type',
            options: componentTypes.map(t => ({ label: t.name, value: t.id.toString() }))
        },
        {
            name: 'building',
            options: componentBuildings.map(b => ({ label: b.name, value: b.id.toString() }))
        },
        {
            name: 'status',
            options: [
                { label: 'Available', value: 'available' },
                { label: 'Maintenance', value: 'maintenance' },
                { label: 'Occupied', value: 'occupied' }
            ]
        }
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-heading font-bold text-foreground">Resources</h1>
                <p className="text-muted-foreground">Manage classrooms, labs, and other facilities.</p>
            </div>

            <SearchFilter
                placeholder="Search by resource name or description..."
                filters={filters}
            />

            <div className="grid lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4">
                    <Card className="sticky top-24">
                        <CardHeader>
                            <CardTitle>Add New Resource</CardTitle>
                            <CardDescription>Register a new facility in the system.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResourceForm buildings={componentBuildings} types={componentTypes} />
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-8 space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                        {resources && resources.map((res: any) => (
                            <Card key={res.id} className="overflow-hidden group hover:border-primary/50 transition-all duration-300">
                                {res.imageUrl && (
                                    <div className="relative h-40 w-full overflow-hidden bg-muted">
                                        <img
                                            src={res.imageUrl}
                                            alt={res.name}
                                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                )}
                                <CardHeader className={`pb-2 ${res.imageUrl ? '' : 'bg-muted/30'}`}>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="text-xs text-primary font-bold tracking-wider mb-1 px-2 py-0.5 bg-primary/10 rounded-full inline-block">
                                                {res.type.name}
                                            </div>
                                            <CardTitle className="text-lg mt-2">{res.name}</CardTitle>
                                        </div>
                                        <div className={`px-2 py-1 rounded text-xs font-medium uppercase tracking-tight ${res.status === 'available' ? 'bg-green-100 text-green-800' :
                                            res.status === 'maintenance' ? 'bg-orange-100 text-orange-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                            {res.status}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <div className="text-sm text-muted-foreground space-y-1 mb-4">
                                        <p className="flex justify-between">
                                            <span>Building:</span>
                                            <span className="text-foreground font-medium">{res.building.name} (Floor {res.floorNumber})</span>
                                        </p>
                                        <p className="flex justify-between">
                                            <span>Capacity:</span>
                                            <span className="text-foreground font-medium">{res.capacity} People</span>
                                        </p>
                                        <p className="mt-2 text-xs line-clamp-2 italic">{res.description}</p>
                                    </div>
                                    <div className="flex justify-end pt-2 border-t border-border/50">
                                        <ResourceActions
                                            resource={res}
                                            buildings={componentBuildings}
                                            types={componentTypes}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {resources && resources.length > 0 && (
                        <div className="pt-4">
                            <Pagination
                                totalItems={total}
                                itemsPerPage={limit}
                                currentPage={page}
                            />
                        </div>
                    )}

                    {(!resources || resources.length === 0) && (
                        <div className="text-center py-20 text-muted-foreground border border-dashed rounded-xl bg-muted/10">
                            <p className="text-lg font-medium">No resources found.</p>
                            <p className="text-sm">Try adjusting your search or filters.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
