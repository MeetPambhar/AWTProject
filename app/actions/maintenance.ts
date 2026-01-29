'use server';

import { prisma } from '@/lib/db';
import { MaintenanceStatus, Priority } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function getMaintenanceRecords() {
    try {
        const maintenance = await prisma.maintenance.findMany({
            include: {
                resource: { select: { name: true } },
                reporter: { select: { name: true } },
            },
            orderBy: { reportedAt: 'desc' },
        });
        return { success: true, data: maintenance };
    } catch (error) {
        return { success: false, error: 'Failed to fetch maintenance records' };
    }
}

export async function createMaintenanceReport(prevState: any, formData: FormData) {
    try {
        const resourceId = parseInt(formData.get('resourceId') as string);
        const userId = parseInt(formData.get('userId') as string);
        const issueTitle = formData.get('issueTitle') as string;
        const issueDescription = formData.get('issueDescription') as string;
        const priority = formData.get('priority') as Priority || Priority.medium;

        if (!resourceId || !userId || !issueTitle) {
            return { success: false, error: 'Resource, Reporter, and Title are required' };
        }

        const report = await prisma.maintenance.create({
            data: {
                resourceId,
                reportedBy: userId,
                issueTitle,
                issueDescription,
                priority,
                status: MaintenanceStatus.reported,
            },
        });
        // Optional: trigger notification here
        revalidatePath('/dashboard/maintenance');
        return { success: true, message: 'Maintenance request submitted successfully!' };
    } catch (error) {
        console.error('Maintenance error:', error);
        return { success: false, error: 'Failed to submit maintenance report' };
    }
}

export async function updateMaintenanceStatus(id: number, status: MaintenanceStatus, resolutionNotes?: string) {
    try {
        const data: any = { status };
        if (status === MaintenanceStatus.resolved) {
            data.resolvedAt = new Date();
        }
        if (resolutionNotes) {
            data.resolutionNotes = resolutionNotes;
        }

        const report = await prisma.maintenance.update({
            where: { id },
            data,
        });
        revalidatePath('/dashboard/maintenance');
        return { success: true, data: report };
    } catch (error) {
        return { success: false, error: 'Failed to update maintenance status' };
    }
}

export async function updateMaintenanceReport(id: number, data: any) {
    try {
        const report = await prisma.maintenance.update({
            where: { id },
            data,
        });
        revalidatePath('/dashboard/maintenance');
        return { success: true, data: report };
    } catch (error) {
        return { success: false, error: 'Failed to update maintenance report' };
    }
}

export async function deleteMaintenance(id: number) {
    try {
        await prisma.maintenance.delete({
            where: { id },
        });
        revalidatePath('/dashboard/maintenance');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to delete maintenance report' };
    }
}
