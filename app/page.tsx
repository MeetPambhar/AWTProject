import Link from 'next/link';
import { Building2, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="glass p-12 rounded-2xl shadow-xl border border-border max-w-lg w-full text-center space-y-8">
        <div className="flex justify-center">
          <div className="bg-primary/10 p-4 rounded-full">
            <Building2 className="w-12 h-12 text-primary" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-heading font-bold text-foreground">Resource Management</h1>
          <p className="text-muted-foreground text-lg">
            Streamline your facility bookings and maintenance with our premium digital solution.
          </p>
        </div>

        <div className="flex flex-col gap-4 pt-4">
          <Link
            href="/dashboard"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            Enter Dashboard <ArrowRight className="w-4 h-4" />
          </Link>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Link href="/login" className="hover:text-primary underline">Admin Login</Link>
            <span>•</span>
            <Link href="/help" className="hover:text-primary underline">Need Help?</Link>
          </div>
        </div>
      </div>

      <footer className="mt-8 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Organization Name. All rights reserved.
      </footer>
    </div>
  );
}
