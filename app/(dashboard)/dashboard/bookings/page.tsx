import { prisma } from '@/lib/db';
import { BookingForm } from '@/components/bookings/BookingForm';
import { BookingStatusActions } from '@/components/bookings/BookingStatusActions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getBookings } from '@/app/actions/bookings';

export default async function BookingsPage() {
    const resourcesData = await prisma.resource.findMany({
        select: { id: true, name: true, type: { select: { name: true } } }
    });

    // Transform data to match component expectation
    const resources = resourcesData.map(r => ({
        id: r.id,
        name: r.name,
        type: r.type.name
    }));

    const users = await prisma.user.findMany({
        select: { id: true, name: true }x
    });

    const bookingsResult = await getBookings();
    const bookings = bookingsResult.success ? bookingsResult.data : [];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-heading font-bold text-foreground">Bookings</h1>
                <p className="text-muted-foreground">Manage and view all facility bookings.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column: Booking Form */}
                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Book a Resource</CardTitle>
                            <CardDescription>Select a resource and time slot.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <BookingForm resources={resources} users={users} />
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Bookings List */}
                <div className="lg:col-span-2 space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Bookings</CardTitle>
                            <CardDescription>Overview of all booking requests.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {bookings && bookings.length > 0 ? (
                                <div className="space-y-4">
                                    {bookings.map((booking: any) => (
                                        <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                            <div>
                                                <div className="font-semibold">{booking.resource.name}</div>
                                                <div className="text-sm text-muted-foreground">
                                                    {booking.purpose} • {new Date(booking.bookingDate).toLocaleDateString()}
                                                </div>
                                                <div className="text-xs text-muted-foreground mt-1">
                                                    {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                                                    {new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="flex justify-end mb-2">
                                                    <BookingStatusActions id={booking.id} status={booking.status} />
                                                </div>
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${booking.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                    booking.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                                </span>
                                                <div className="text-xs text-muted-foreground mt-1">
                                                    by {booking.user.name}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    No bookings found.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
