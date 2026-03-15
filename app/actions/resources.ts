'use server';

import { prisma } from '@/lib/db';
import { Resource, ResourceStatus } from '@prisma/client';
import { revalidatePath, updateTag } from 'next/cache';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

import { unstable_cache } from 'next/cache';

export async function getResources(params?: { q?: string; type?: string; building?: string; status?: string; page?: string; limit?: string }) {
    return unstable_cache(
        async () => {
            try {
                const where: any = {};
                const page = parseInt(params?.page || '1');
                const limit = parseInt(params?.limit || '6');
                const skip = (page - 1) * limit;

                if (params?.q) {
                    where.OR = [
                        { name: { contains: params.q } },
                        { description: { contains: params.q } },
                    ];
                }

                if (params?.type) {
                    where.typeId = parseInt(params.type);
                }

                if (params?.building) {
                    where.buildingId = parseInt(params.building);
                }

                if (params?.status) {
                    where.status = params.status as ResourceStatus;
                }

                const [resources, total] = await Promise.all([
                    prisma.resource.findMany({
                        where,
                        include: {
                            type: true,
                            building: true,
                        },
                        orderBy: { name: 'asc' },
                        skip,
                        take: limit,
                    }),
                    prisma.resource.count({ where })
                ]);

                return { success: true, data: resources, total, page, limit };
            } catch (error) {
                console.error('Error fetching resources:', error);
                return { success: false, error: 'Failed to fetch resources' };
            }
        },
        ['resources-list', JSON.stringify(params)],
        { revalidate: 60, tags: ['resources'] }
    )();
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

export async function saveResource(prevState: any, formData: FormData) {
    try {
        const id = formData.get('id') ? parseInt(formData.get('id') as string) : undefined;
        const name = formData.get('name') as string;
        const typeId = parseInt(formData.get('typeId') as string);
        const buildingId = parseInt(formData.get('buildingId') as string);
        const floorNumber = parseInt(formData.get('floorNumber') as string);
        const capacity = parseInt(formData.get('capacity') as string);
        const description = formData.get('description') as string;

        // Handle File Upload
        const file = formData.get('image') as File | null;
        let imageUrl = formData.get('existingImageUrl') as string || null;

        if (file && file.size > 0) {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
            const uploadDir = join(process.cwd(), 'public', 'uploads');

            // Ensure directory exists
            await mkdir(uploadDir, { recursive: true });

            const path = join(uploadDir, filename);
            await writeFile(path, buffer);
            imageUrl = `/uploads/${filename}`;
        }

        if (!name || isNaN(typeId) || isNaN(buildingId) || isNaN(floorNumber) || isNaN(capacity)) {
            return { success: false, error: 'Please fill all required fields correctly' };
        }

        const data: any = {
            name,
            typeId,
            buildingId,
            floorNumber,
            capacity,
            description,
            imageUrl,
        };

        if (id) {
            await prisma.resource.update({
                where: { id },
                data,
            });
            revalidatePath('/dashboard/resources');
            updateTag('resources');
            return { success: true, message: 'Resource updated successfully!' };
        } else {
            await prisma.resource.create({
                data: {
                    ...data,
                    status: ResourceStatus.available,
                },
            });
            revalidatePath('/dashboard/resources');
            updateTag('resources');
            return { success: true, message: 'Resource created successfully!' };
        }
    } catch (error) {
        console.error('Error saving resource:', error);
        return { success: false, error: 'Failed to save resource' };
    }
}

export async function updateResourceStatus(id: number, status: ResourceStatus) {
    try {
        const resource = await prisma.resource.update({
            where: { id },
            data: { status },
        });
        revalidatePath('/dashboard/resources');
        updateTag('resources');
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
        updateTag('resources');
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
        updateTag('resources');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to delete resource' };
    }
}
