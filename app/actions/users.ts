'use server';

import { prisma } from '@/lib/db';
import { User, Role } from '@prisma/client';
import { revalidatePath, updateTag } from 'next/cache';

import { unstable_cache } from 'next/cache';

export async function getUsers(params?: { q?: string; role?: string; department?: string; page?: string; limit?: string }) {
    return unstable_cache(
        async () => {
            try {
                const where: any = {};
                const page = parseInt(params?.page || '1');
                const limit = parseInt(params?.limit || '8');
                const skip = (page - 1) * limit;

                if (params?.q) {
                    where.OR = [
                        { name: { contains: params.q } },
                        { email: { contains: params.q } },
                    ];
                }

                if (params?.role) {
                    where.role = params.role as Role;
                }

                if (params?.department) {
                    where.department = { contains: params.department };
                }

                const [users, total] = await Promise.all([
                    prisma.user.findMany({
                        where,
                        orderBy: { createdAt: 'desc' },
                        skip,
                        take: limit,
                    }),
                    prisma.user.count({ where })
                ]);

                return { success: true, data: users, total, page, limit };
            } catch (error) {
                console.error('Error fetching users:', error);
                return { success: false, error: 'Failed to fetch users' };
            }
        },
        ['users-list', JSON.stringify(params)],
        { revalidate: 300, tags: ['users'] }
    )();
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
        updateTag('users');
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
        updateTag('users');
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
        updateTag('users');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to delete user' };
    }
}
