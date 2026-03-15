import { prisma } from '@/lib/db';
import Link from 'next/link';
import {
    Users,
    CalendarDays,
    Building2,
    Wrench,
    ArrowRight,
    Clock
} from 'lucide-react';

export default async function DashboardPage() {
    // Fetch precise counts and recent data for the dashboard
    const [
        totalBookings,
        totalResources,
        totalUsers,
        activeMaintenanceCount,
        recentBookings,
        activeMaintenance
    ] = await Promise.all([
        prisma.booking.count(),
        prisma.resource.count(),
        prisma.user.count(),
        prisma.maintenance.count({ where: { status: { not: 'resolved' } } }),
        prisma.booking.findMany({
            take: 5,
            orderBy: { bookingDate: 'desc' },
            include: {
                user: true,
                resource: true,
            },
        }),
        prisma.maintenance.findMany({
            take: 5,
            where: { status: { not: 'resolved' } },
            orderBy: { reportedAt: 'desc' },
            include: {
                resource: true,
                reporter: true,
            },
        })
    ]);

    const stats = [
        {
            label: 'Total Bookings',
            value: totalBookings,
            icon: CalendarDays,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10',
            href: '/dashboard/bookings'
        },
        {
            label: 'Total Resources',
            value: totalResources,
            icon: Building2,
            color: 'text-violet-500',
            bg: 'bg-violet-500/10',
            href: '/dashboard/resources'
        },
        {
            label: 'Active Users',
            value: totalUsers,
            icon: Users,
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10',
            href: '/dashboard/users'
        },
        {
            label: 'Maintenance Issues',
            value: activeMaintenanceCount,
            icon: Wrench,
            color: 'text-amber-500',
            bg: 'bg-amber-500/10',
            href: '/dashboard/maintenance'
        },
    ];

    return (
        <div className="space-y-8 fade-in">
            <div>
                <h1 className="text-3xl font-heading font-bold text-foreground">Dashboard</h1>
                <p className="text-muted-foreground mt-1">Overview of your resource management system.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <Link
                        key={stat.label}
                        href={stat.href}
                        className="group p-6 bg-card hover:bg-card/50 border border-border rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                                <h3 className="text-3xl font-bold mt-2 font-heading">{stat.value}</h3>
                            </div>
                            <div className={`p-3 rounded-lg ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors">
                            View Details <ArrowRight className="w-3 h-3 ml-1" />
                        </div>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Activity */}
                <div className="p-6 bg-card border border-border rounded-xl shadow-sm">
                    <h3 className="text-lg font-bold font-heading mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-primary" />
                        Recent Bookings
                    </h3>
                    <div className="space-y-4">
                        {recentBookings.map((booking: any) => (
                            <div key={booking.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${booking.status === 'approved' ? 'bg-green-500' : 'bg-amber-500'}`} />
                                    <div>
                                        <p className="text-sm font-medium">{booking.resource?.name || 'Unknown Resource'}</p>
                                        <p className="text-xs text-muted-foreground">by {booking.user?.name || 'Unknown User'}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-medium">
                                        {new Date(booking.bookingDate).toLocaleDateString()}
                                    </p>
                                    <p className="text-xs text-muted-foreground capitalize">{booking.status}</p>
                                </div>
                            </div>
                        ))}
                        {recentBookings.length === 0 && (
                            <p className="text-sm text-muted-foreground text-center py-4">No recent bookings found.</p>
                        )}
                    </div>
                </div>

                {/* Maintenance Status */}
                <div className="p-6 bg-card border border-border rounded-xl shadow-sm">
                    <h3 className="text-lg font-bold font-heading mb-4 flex items-center gap-2">
                        <Wrench className="w-5 h-5 text-amber-500" />
                        Active Maintenance
                    </h3>
                    <div className="space-y-4">
                        {activeMaintenance.map((m: any) => (
                            <div key={m.id} className="flex items-start gap-4 p-3 rounded-lg border border-border hover:border-primary/20 transition-colors">
                                <div className={`mt-1 p-1.5 rounded-full ${m.priority === 'urgent' || m.priority === 'high' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                    <Wrench className="w-3 h-3" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">{m.issueTitle}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">{m.resource?.name} • Reported by {m.reporter?.name}</p>
                                </div>
                                <span className="ml-auto text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground capitalize">
                                    {m.status.replace('_', ' ')}
                                </span>
                            </div>
                        ))}
                        {activeMaintenance.length === 0 && (
                            <p className="text-sm text-muted-foreground text-center py-4">No active maintenance issues.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
