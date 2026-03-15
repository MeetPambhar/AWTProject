'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { decrypt } from '@/lib/session';

export async function updateProfile(prevState: any, formData: FormData) {
    try {
        const session = (await cookies()).get('session')?.value;
        const payload = await decrypt(session);
        if (!payload?.userId) return { success: false, error: 'Unauthorized' };

        const name = formData.get('name') as string;
        const phone = formData.get('phone') as string;
        const department = formData.get('department') as string;

        if (!name) return { success: false, error: 'Name is required' };

        await prisma.user.update({
            where: { id: payload.userId as number },
            data: { name, phone, department },
        });

        revalidatePath('/dashboard/settings');
        revalidatePath('/dashboard');
        return { success: true, message: 'Profile updated successfully!' };
    } catch (error) {
        console.error('Failed to update profile:', error);
        return { success: false, error: 'Failed to update profile' };
    }
}

export async function changePassword(prevState: any, formData: FormData) {
    try {
        const session = (await cookies()).get('session')?.value;
        const payload = await decrypt(session);
        if (!payload?.userId) return { success: false, error: 'Unauthorized' };

        const currentPassword = formData.get('currentPassword') as string;
        const newPassword = formData.get('newPassword') as string;
        const confirmPassword = formData.get('confirmPassword') as string;

        if (!currentPassword || !newPassword || !confirmPassword) {
            return { success: false, error: 'All password fields are required' };
        }

        if (newPassword !== confirmPassword) {
            return { success: false, error: 'New passwords do not match' };
        }

        const user = await prisma.user.findUnique({ where: { id: payload.userId as number } });
        if (!user) return { success: false, error: 'User not found' };

        const isValid = await bcrypt.compare(currentPassword, user.password);
        if (!isValid) return { success: false, error: 'Incorrect current password' };

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: payload.userId as number },
            data: { password: hashedPassword },
        });

        return { success: true, message: 'Password changed successfully!' };
    } catch (error) {
        console.error('Failed to change password:', error);
        return { success: false, error: 'Failed to change password' };
    }
}
