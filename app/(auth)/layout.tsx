export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left: Branding Area */}
            <div className="hidden lg:flex flex-col justify-center bg-zinc-900 text-white p-12 relative overflow-hidden">
                {/* Abstract pattern background */}
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-purple-900/50"></div>

                <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-2 font-bold text-2xl">
                        <span className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">RMS</span>
                        <span>Resource Management System</span>
                    </div>
                    <p className="text-xl text-zinc-300 max-w-lg">
                        "Streamline your entire organization's facility usage with our intelligent booking and maintenance platform."
                    </p>
                </div>
            </div>

            {/* Right: Auth Form Area */}
            <div className="flex items-center justify-center p-8 bg-background">
                <div className="w-full max-w-md space-y-8">
                    {children}
                </div>
            </div>
        </div>
    );
}
