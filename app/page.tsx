import Link from 'next/link';
import { Building2, ArrowRight, CalendarDays, ShieldCheck, Zap } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0b] text-zinc-50 flex flex-col selection:bg-primary/30">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 lg:px-12 border-b border-white/5 bg-transparent backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-primary p-2 rounded-xl">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <span className="font-heading font-bold text-xl tracking-tight hidden sm:block">RMS Enterprise</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/help" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
            Support
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium bg-white text-black px-5 py-2.5 rounded-full hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]"
          >
            Admin Login
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col">
        <section className="relative pt-32 pb-20 px-6 lg:px-12 flex flex-col items-center text-center overflow-hidden">
          {/* Abstract Glow Background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/20 blur-[120px] rounded-full pointer-events-none -z-10"></div>
          
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-primary mb-8 backdrop-blur-sm">
            <Zap className="w-3.5 h-3.5" />
            <span>RMS v2.0 is now live</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-heading font-extrabold tracking-tight max-w-4xl leading-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-500">
            Intelligent Facility <br className="hidden md:block" /> Management.
          </h1>
          
          <p className="mt-6 text-lg md:text-xl text-zinc-400 max-w-2xl font-light">
            Streamline your organization's entire physical infrastructure. From classrooms and labs to maintenance tickets, unified in one elegant platform.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto bg-primary text-white font-medium px-8 py-4 rounded-full flex items-center justify-center gap-2 hover:bg-primary/90 transition-transform active:scale-95 group"
            >
              Enter Dashboard 
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>

        {/* Bento Grid Features */}
        <section className="px-6 lg:px-12 pb-32 max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          
          {/* Feature 1 */}
          <div className="md:col-span-2 bg-white/[0.03] border border-white/10 p-8 rounded-3xl hover:bg-white/[0.05] transition-colors relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10">
                <CalendarDays className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">Conflict-Free Scheduling</h3>
              <p className="text-zinc-400 leading-relaxed max-w-md">
                Our conflict resolution engine guarantees complete elimination of double-bookings. Manage university-wide schedules with complete confidence.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="bg-white/[0.03] border border-white/10 p-8 rounded-3xl hover:bg-white/[0.05] transition-colors relative overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10">
                <ShieldCheck className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold">Role Based Access</h3>
              <p className="text-zinc-400 leading-relaxed">
                Enterprise-grade security ensuring faculty, admins, and students see exactly what they need.
              </p>
            </div>
          </div>

          {/* Feature 3 (Full Width visual element) */}
          <div className="md:col-span-3 bg-gradient-to-r from-zinc-900 to-[#121214] border border-white/10 p-8 md:p-12 rounded-3xl overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 h-64 md:h-auto">
             <div className="space-y-4 max-w-xl z-10">
                <h3 className="text-3xl font-bold text-white">Instant Maintenance Tracking</h3>
                <p className="text-zinc-400">Report broken projectors, AC units, or structural issues in seconds. Track resolution status in real-time through the unified dashboard.</p>
             </div>
             {/* Decorative abstract elements */}
             <div className="relative w-full md:w-1/2 h-full min-h-[150px] z-0 flex items-center justify-end">
                <div className="absolute w-40 h-40 bg-red-500/20 rounded-full blur-3xl right-10 top-0"></div>
                <div className="absolute w-60 h-60 bg-primary/20 rounded-full blur-3xl right-20 bottom-0"></div>
                <div className="hidden md:flex gap-4 opacity-50">
                    <div className="w-32 h-12 bg-white/5 rounded-xl border border-white/10"></div>
                    <div className="w-48 h-12 bg-white/10 rounded-xl border border-white/20"></div>
                </div>
             </div>
          </div>

        </section>
      </main>

      <footer className="py-8 text-center text-sm font-medium text-zinc-600 border-t border-white/5">
        &copy; {new Date().getFullYear()} Resource Management System. Crafted for excellence.
      </footer>
    </div>
  );
}
