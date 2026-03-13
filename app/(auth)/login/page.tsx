'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { Loader2, ArrowRight } from 'lucide-react';
import { login } from '@/app/actions/auth';

const initialState = {
    error: '',
}; 
// c
export default function LoginPage() {
    const [state, action, isPending] = useActionState(login, initialState);

    return (
        <div className="space-y-6">
            <div className="space-y-2 text-center lg:text-left">
                <h1 className="text-3xl font-heading font-bold">Welcome Back</h1>
                <p className="text-muted-foreground">
                    Enter your credentials to access your account.
                </p>
            </div>

            <form action={action} className="space-y-4">
                {state?.error && (
                    <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
                        {state.error}
                    </div>
                )}
                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none" htmlFor="email">
                        Email Address
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="name@example.com"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none" htmlFor="password">
                        Password
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground h-10 px-4 py-2 rounded-md font-medium transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none"
                >
                    {isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <>
                            Sign In <ArrowRight className="w-4 h-4" />
                        </>
                    )}
                </button>
            </form>

            <div className="text-center text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link href="/register" className="underline hover:text-primary underline-offset-4">
                    Register
                </Link>
            </div>
        </div>
    );
}
