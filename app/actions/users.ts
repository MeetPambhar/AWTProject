'use server';

import { prisma } from '@/lib/db';
import { User, Role } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function getUsers() {
    try {
        const users = await prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return { success: true, data: users };
    } catch (error) {
        return { success: false, error: 'Failed to fetch users' };
    }
}

export async function getUserById(id: number) {
    try {
        const user = await prisma.user.findUnique({
            where: { id },
        });
        return { success: true, data: user };
    } catch (error) {
        return { success: false, error: 'Failed to fetch user' };
    }
}

import bcrypt from 'bcryptjs';

export async function createUser(prevState: any, formData: FormData) {
    try {
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const role = formData.get('role') as Role || Role.user;
        const department = formData.get('department') as string;
        const phone = formData.get('phone') as string;

        if (!name || !email || !password) {
            return { success: false, error: 'Name, Email, and Password are required' };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
                department,
                phone,
            },
        });
        revalidatePath('/dashboard/users');
        return { success: true, message: 'User created successfully!' };
    } catch (error) {
        console.error('Error creating user:', error);
        return { success: false, error: 'Failed to create user' };
    }
}

export async function updateUser(id: number, data: Partial<User>) {
    try {
        const user = await prisma.user.update({
            where: { id },
            data,
        });
        revalidatePath('/dashboard/users');
        return { success: true, data: user };
    } catch (error) {
        return { success: false, error: 'Failed to update user' };
    }
}

export async function deleteUser(id: number) {
    try {
        await prisma.user.delete({
            where: { id },
        });
        revalidatePath('/dashboard/users');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to delete user' };
    }
}
