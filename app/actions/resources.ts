'use server';

import { prisma } from '@/lib/db';
import { Resource, ResourceStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function getResources() {
    try {
        const resources = await prisma.resource.findMany({
            include: {
                type: true,
                building: true,
            },
            orderBy: { name: 'asc' },
        });
        return { success: true, data: resources };
    } catch (error) {
        console.error('Error fetching resources:', error);
        return { success: false, error: 'Failed to fetch resources' };
    }
}

export async function getResourceById(id: number) {
    try {
        const resource = await prisma.resource.findUnique({
            where: { id },
            include: {
                type: true,
                building: true,
                facilities: true,
            },
        });
        return { success: true, data: resource };
    } catch (error) {
        return { success: false, error: 'Failed to fetch resource' };
    }
}

export async function createResource(prevState: any, formData: FormData) {
    try {
        const name = formData.get('name') as string;
        const typeId = parseInt(formData.get('typeId') as string);
        const buildingId = parseInt(formData.get('buildingId') as string);
        const floorNumber = parseInt(formData.get('floorNumber') as string);
        const capacity = parseInt(formData.get('capacity') as string);
        const description = formData.get('description') as string;

        if (!name || isNaN(typeId) || isNaN(buildingId) || isNaN(floorNumber) || isNaN(capacity)) {
            return { success: false, error: 'Please fill all required fields correctly' };
        }

        const resource = await prisma.resource.create({
            data: {
                name,
                typeId,
                buildingId,
                floorNumber,
                capacity,
                description,
                status: ResourceStatus.available,
            },
        });
        revalidatePath('/dashboard/resources');
        return { success: true, message: 'Resource created successfully!' };
    } catch (error) {
        console.error('Error creating resource:', error);
        return { success: false, error: 'Failed to create resource' };
    }
}

export async function updateResourceStatus(id: number, status: ResourceStatus) {
    try {
        const resource = await prisma.resource.update({
            where: { id },
            data: { status },
        });
        revalidatePath('/dashboard/resources');
        return { success: true, data: resource };
    } catch (error) {
        return { success: false, error: 'Failed to update resource status' };
    }
}

export async function updateResource(id: number, data: any) {
    try {
        const resource = await prisma.resource.update({
            where: { id },
            data,
        });
        revalidatePath('/dashboard/resources');
        return { success: true, data: resource };
    } catch (error) {
        return { success: false, error: 'Failed to update resource' };
    }
}

export async function deleteResource(id: number) {
    try {
        await prisma.resource.delete({
            where: { id },
        });
        revalidatePath('/dashboard/resources');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to delete resource' };
    }
}
