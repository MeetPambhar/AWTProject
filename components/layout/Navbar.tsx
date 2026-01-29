'use client';

import { Bell, Search, UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Navbar() {
    return (
        <header className="h-16 bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-10 flex items-center justify-between px-6 transition-all">
            {/* Left: Mobile Menu Trigger (Hidden on Desktop) & Breadcrumbs placeholder */}
            <div className="flex items-center gap-4">
                {/* Mobile menu button would go here */}
                <div className="text-sm font-semibold text-muted-foreground hidden md:block">
                    Welcome back, Admin
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-4">
                {/* Search Bar - Visual only for now */}
                <div className="relative hidden sm:block">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="h-9 w-64 rounded-full border border-input bg-muted/50 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                </div>

                {/* Notifications */}
                <button className="relative p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-background"></span>
                </button>

                {/* User Profile */}
                <div className="flex items-center gap-3 pl-4 border-l border-border">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-foreground">System Admin</p>
                        <p className="text-xs text-muted-foreground">IT Department</p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <UserCircle className="w-6 h-6" />
                    </div>
                </div>
            </div>
        </header>
    );
}
