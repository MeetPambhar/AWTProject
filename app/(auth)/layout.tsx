import { Building2 } from 'lucide-react';
import Link from 'next/link';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex text-foreground">
            {/* Left: Branding & Decorative Area (Hidden on Mobile) */}
            <div className="hidden lg:flex w-1/2 flex-col justify-between bg-[#0a0a0b] text-white p-12 relative overflow-hidden">
                {/* Abstract Glowing Orbs Background */}
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/30 blur-[120px] rounded-full pointer-events-none"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/20 blur-[150px] rounded-full pointer-events-none"></div>
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5 mix-blend-overlay"></div>

                <div className="relative z-10">
                    <Link href="/" className="inline-flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <div className="bg-white p-2 rounded-xl">
                            <Building2 className="w-6 h-6 text-black" />
                        </div>
                        <span className="font-heading font-bold text-2xl tracking-tight">RMS Enterprise</span>
                    </Link>
                </div>

                <div className="relative z-10 space-y-6 max-w-xl">
                    <h2 className="text-4xl font-heading font-bold leading-tight">
                        Powering modern <br/><span className="text-primary font-extrabold italic">infrastructure.</span>
                    </h2>
                    <p className="text-lg text-zinc-400 font-light leading-relaxed">
                        Securely manage university facilities, track equipment maintenance, and optimize organizational resources all from one unified dashboard.
                    </p>
                    
                    {/* Testimonial / Trust Badge substitute */}
                    <div className="pt-8 border-t border-white/10 mt-8 flex items-center gap-4">
                        <div className="flex -space-x-3">
                            <div className="w-10 h-10 rounded-full border-2 border-[#0a0a0b] bg-zinc-800"></div>
                            <div className="w-10 h-10 rounded-full border-2 border-[#0a0a0b] bg-zinc-700"></div>
                            <div className="w-10 h-10 rounded-full border-2 border-[#0a0a0b] bg-zinc-600"></div>
                        </div>
                        <p className="text-sm font-medium text-zinc-300">Trusted by over <strong className="text-white">100+</strong> campuses.</p>
                    </div>
                </div>
            </div>

            {/* Right: Auth Form Area */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-background relative selection:bg-primary/20">
                <div className="w-full max-w-[420px]">
                    {/* Mobile Logo Fallback */}
                    <div className="flex lg:hidden items-center gap-2 mb-8 justify-center">
                        <div className="bg-primary p-2 rounded-xl">
                            <Building2 className="w-6 h-6 text-white" />
                        </div>
                        <span className="font-heading font-bold text-2xl tracking-tight">RMS</span>
                    </div>

                    {children}
                </div>
            </div>
        </div>
    );
}
