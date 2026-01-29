'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { logout } from '@/app/actions/auth';
import {
    LayoutDashboard,
    CalendarDays,
    Users,
    Building2,
    Wrench,
    LogOut,
    Settings,
} from 'lucide-react';

const sidebarItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Bookings', href: '/dashboard/bookings', icon: CalendarDays },
    { label: 'Resources', href: '/dashboard/resources', icon: Building2 },
    { label: 'Users', href: '/dashboard/users', icon: Users },
    { label: 'Maintenance', href: '/dashboard/maintenance', icon: Wrench },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 h-screen bg-card border-r border-border flex flex-col fixed left-0 top-0 overflow-y-auto z-20 hidden md:flex">
            {/* Logo Area */}
            <div className="h-16 flex items-center px-6 border-b border-border">
                <div className="flex items-center gap-2 font-bold text-xl text-primary">
                    <Building2 className="w-6 h-6" />
                    <span>RMS</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                                isActive
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                            )}
                        >
                            <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground")} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-border space-y-1">
                <Link
                    href="/dashboard/settings"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                    <Settings className="w-5 h-5" />
                    Settings
                </Link>
                <form action={async () => {
                    await logout();
                }}>
                    <button
                        type="submit"
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors text-left"
                    >
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </button>
                </form>
            </div>
        </aside>
    );
}
