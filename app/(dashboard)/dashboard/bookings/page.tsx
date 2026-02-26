import { prisma } from '@/lib/db';
import { BookingForm } from '@/components/bookings/BookingForm';
import { BookingStatusActions } from '@/components/bookings/BookingStatusActions';
import { BookingActions } from '@/components/bookings/BookingActions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getBookings } from '@/app/actions/bookings';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, MapPin } from 'lucide-react';
import { SearchFilter } from '@/components/ui/SearchFilter';
import { Pagination } from '@/components/ui/Pagination';

export default async function BookingsPage({
    searchParams
}: {
    searchParams: Promise<{ q?: string; status?: string; resourceId?: string; page?: string }>
}) {
    const params = await searchParams;

    const resourcesData = await prisma.resource.findMany({
        select: { id: true, name: true, type: { select: { name: true } }, building: { select: { name: true } } }
    });

    const resources = resourcesData.map(r => ({
        id: r.id,
        name: r.name,
        type: r.type.name,
        building: r.building.name
    }));

    const users = await prisma.user.findMany({
        select: { id: true, name: true }
    });

    const bookingsResult = await getBookings(params);
    const bookings = bookingsResult.success ? bookingsResult.data : [];
    const total = bookingsResult.success ? (bookingsResult as any).total : 0;
    const page = bookingsResult.success ? (bookingsResult as any).page : 1;
    const limit = bookingsResult.success ? (bookingsResult as any).limit : 5;

    const filters = [
        {
            name: 'status',
            options: [
                { label: 'Pending', value: 'pending' },
                { label: 'Approved', value: 'approved' },
                { label: 'Rejected', value: 'rejected' },
                { label: 'Cancelled', value: 'cancelled' }
            ]
        },
        {
            name: 'resourceId',
            options: resources.map(r => ({ label: r.name, value: r.id.toString() }))
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-foreground">Bookings</h1>
                    <p className="text-muted-foreground">Manage and view all facility bookings.</p>
                </div>
            </div>

            <SearchFilter
                placeholder="Search by purpose, user, or resource..."
                filters={filters}
            />

            <div className="grid lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4">
                    <Card className="sticky top-24 border-primary/10">
                        <CardHeader>
                            <CardTitle>Book a Resource</CardTitle>
                            <CardDescription>Select a resource and time slot.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <BookingForm resources={resources} users={users} />
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-8 space-y-6">
                    <Card className="border-none shadow-none bg-transparent">
                        <CardContent className="p-0">
                            {bookings && bookings.length > 0 ? (
                                <div className="space-y-4">
                                    {bookings.map((booking: any) => (
                                        <div key={booking.id} className="group relative overflow-hidden flex flex-col md:flex-row border rounded-xl bg-card hover:shadow-md transition-all duration-200">
                                            <div className={`w-1.5 self-stretch ${booking.status === 'approved' ? 'bg-green-500' :
                                                booking.status === 'rejected' ? 'bg-red-500' :
                                                    booking.status === 'cancelled' ? 'bg-slate-400' :
                                                        'bg-yellow-500'
                                                }`} />

                                            <div className="flex-1 p-5">
                                                <div className="flex flex-col md:flex-row justify-between gap-4">
                                                    <div className="space-y-3">
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <h4 className="font-bold text-lg">{booking.resource.name}</h4>
                                                                <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
                                                                    {booking.resource.type.name}
                                                                </Badge>
                                                            </div>
                                                            <p className="text-sm font-medium text-foreground">{booking.purpose}</p>
                                                        </div>

                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-xs text-muted-foreground">
                                                            <div className="flex items-center gap-2">
                                                                <CalendarDays className="h-3.5 w-3.5" />
                                                                {new Date(booking.bookingDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Clock className="h-3.5 w-3.5" />
                                                                {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                                                                {new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </div>
                                                            <div className="flex items-center gap-2 sm:col-span-2">
                                                                <MapPin className="h-3.5 w-3.5" />
                                                                {booking.resource.building?.name || 'Main Building'}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-row md:flex-col justify-between items-end gap-3 min-w-[120px]">
                                                        <div className="flex flex-col items-end gap-2">
                                                            <Badge className={`${booking.status === 'approved' ? 'bg-green-500/10 text-green-700 hover:bg-green-500/20' :
                                                                booking.status === 'rejected' ? 'bg-red-500/10 text-red-700 hover:bg-red-500/20' :
                                                                    booking.status === 'cancelled' ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' :
                                                                        'bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/20'
                                                                } border-none shadow-none uppercase tracking-tighter font-bold`}>
                                                                {booking.status}
                                                            </Badge>
                                                            <span className="text-[10px] text-muted-foreground font-medium uppercase">
                                                                by {booking.user.name}
                                                            </span>
                                                        </div>

                                                        <div className="flex gap-2">
                                                            <BookingStatusActions id={booking.id} status={booking.status} />
                                                            <BookingActions booking={booking} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    <div className="pt-4">
                                        <Pagination
                                            totalItems={total}
                                            itemsPerPage={limit}
                                            currentPage={page}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-muted/10 border border-dashed rounded-xl">
                                    <div className="p-4 bg-muted w-max mx-auto rounded-full mb-4">
                                        <CalendarDays className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                    <h3 className="text-lg font-semibold">No bookings found</h3>
                                    <p className="text-muted-foreground text-sm">Try adjusting your search or filters.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
