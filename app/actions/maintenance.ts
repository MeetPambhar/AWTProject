'use server';

import { prisma } from '@/lib/db';
import { MaintenanceStatus, Priority } from '@prisma/client';
import { revalidatePath, updateTag } from 'next/cache';

import { unstable_cache } from 'next/cache';

export async function getMaintenanceRecords(params?: { q?: string; status?: string; priority?: string; page?: string; limit?: string }) {
    return unstable_cache(
        async () => {
            try {
                const where: any = {};
                const page = parseInt(params?.page || '1');
                const limit = parseInt(params?.limit || '5');
                const skip = (page - 1) * limit;

                if (params?.q) {
                    where.OR = [
                        { issueTitle: { contains: params.q } },
                        { issueDescription: { contains: params.q } },
                        { resource: { name: { contains: params.q } } },
                    ];
                }

                if (params?.status) {
                    where.status = params.status as MaintenanceStatus;
                }

                if (params?.priority) {
                    where.priority = params.priority as Priority;
                }

                const [maintenance, total] = await Promise.all([
                    prisma.maintenance.findMany({
                        where,
                        include: {
                            resource: { select: { id: true, name: true } },
                            reporter: { select: { id: true, name: true } },
                        },
                        orderBy: { reportedAt: 'desc' },
                        skip,
                        take: limit,
                    }),
                    prisma.maintenance.count({ where })
                ]);

                return { success: true, data: maintenance, total, page, limit };
            } catch (error) {
                console.error('Error fetching maintenance records:', error);
                return { success: false, error: 'Failed to fetch maintenance records' };
            }
        },
        ['maintenance-list', JSON.stringify(params)],
        { revalidate: 60, tags: ['maintenance'] }
    )();
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
        updateTag('maintenance');
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
        updateTag('maintenance');
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
        updateTag('maintenance');
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
        updateTag('maintenance');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to delete maintenance report' };
    }
}
