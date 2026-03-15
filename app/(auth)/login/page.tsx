'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { Loader2, ArrowRight } from 'lucide-react';
import { login } from '@/app/actions/auth';

const initialState = {
    error: '',
};

export default function LoginPage() {
    const [state, action, isPending] = useActionState(login, initialState);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-in-out">
            <div className="space-y-3">
                <h1 className="text-3xl font-heading font-extrabold tracking-tight">Welcome back</h1>
                <p className="text-muted-foreground text-sm leading-relaxed pr-6">
                    Enter your administrative credentials to securely access your workspace.
                </p>
            </div>

            <form action={action} className="space-y-5">
                {state?.error && (
                    <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-4 rounded-xl flex items-center gap-2 font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-destructive"></div>
                        {state.error}
                    </div>
                )}
                
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground/80" htmlFor="email">
                        Email Address
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="admin@university.edu"
                        className="flex h-12 w-full rounded-xl border border-input/50 bg-muted/30 px-4 py-2 text-sm shadow-sm transition-all placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50"
                        required
                    />
                </div>
                
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-semibold text-foreground/80" htmlFor="password">
                            Password
                        </label>
                        <Link href="/forgot-password" className="text-xs font-medium text-primary hover:text-primary/80 transition-colors">
                            Forgot password?
                        </Link>
                    </div>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        className="flex h-12 w-full rounded-xl border border-input/50 bg-muted/30 px-4 py-2 text-sm shadow-sm transition-all placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50"
                        required
                    />
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground h-12 px-4 py-2 rounded-xl font-semibold shadow-md transition-all hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none group"
                    >
                        {isPending ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                Sign In <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </div>
            </form>

            <div className="text-center text-sm font-medium text-muted-foreground">
                Don't have an administrative account?{' '}
                <Link href="/register" className="text-primary hover:text-primary/80 hover:underline underline-offset-4 transition-colors">
                    Request access
                </Link>
            </div>
        </div>
    );
}
