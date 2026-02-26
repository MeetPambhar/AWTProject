import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function resetAdminPassword() {
    const email = 'admin@college.edu';
    const newPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    console.log(`Resetting password for ${email}...`);

    try {
        const user = await prisma.user.update({
            where: { email },
            data: { password: hashedPassword },
        });
        console.log(`Success! Password for ${user.email} (Role: ${user.role}) has been reset to: ${newPassword}`);
    } catch (error) {
        console.error('Error updating admin password:', error);
        // If user doesn't exist, try creating (optional, but seed should have handled it)
        console.log('User might not exist. Please run "npx prisma db seed" first.');
    } finally {
        await prisma.$disconnect();
    }
}

resetAdminPassword();
