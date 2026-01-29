'use server';

import { z } from 'zod'; // We'll need zod ideally, but I'll implement basic validation manually for now to save tool calls, or just do it inside.
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';
import { createSession, deleteSession } from '@/lib/session';

export async function login(prevState: any, formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
        return { error: 'Email and password are required' };
    }

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        return { error: 'Invalid email or password' };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return { error: 'Invalid email or password' };
    }

    await createSession(user.id, user.role);
    redirect('/dashboard');
}

export async function register(prevState: any, formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!name || !email || !password) {
        return { error: 'All fields are required' };
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        return { error: 'User already exists' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
    });

    await createSession(user.id, user.role);
    redirect('/dashboard');
}

export async function logout() {
    await deleteSession();
    redirect('/login');
}
