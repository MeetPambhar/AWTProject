'use server';

import { prisma } from '@/lib/db';
import { BookingStatus } from '@prisma/client';
import { revalidatePath, updateTag } from 'next/cache';

import { unstable_cache } from 'next/cache';

export async function getBookings(params?: { q?: string; status?: string; resourceId?: string; page?: string; limit?: string }) {
    return unstable_cache(
        async () => {
            try {
                const where: any = {};
                const page = parseInt(params?.page || '1');
                const limit = parseInt(params?.limit || '5');
                const skip = (page - 1) * limit;

                if (params?.q) {
                    where.OR = [
                        { purpose: { contains: params.q } },
                        { user: { name: { contains: params.q } } },
                        { resource: { name: { contains: params.q } } },
                    ];
                }

                if (params?.status) {
                    where.status = params.status as BookingStatus;
                }

                if (params?.resourceId) {
                    where.resourceId = parseInt(params.resourceId);
                }

                const [bookings, total] = await Promise.all([
                    prisma.booking.findMany({
                        where,
                        include: {
                            user: true,
                            resource: {
                                include: {
                                    type: true,
                                    building: true,
                                }
                            },
                        },
                        orderBy: { bookingDate: 'desc' },
                        skip,
                        take: limit,
                    }),
                    prisma.booking.count({ where })
                ]);

                return { success: true, data: bookings, total, page, limit };
            } catch (error) {
                console.error('Error fetching bookings:', error);
                return { success: false, error: 'Failed to fetch bookings' };
            }
        },
        ['bookings-list', JSON.stringify(params)],
        { revalidate: 30, tags: ['bookings'] }
    )();
}

// hello

export async function createBooking(prevState: any, formData: FormData) {
    try {
        const resourceId = parseInt(formData.get('resourceId') as string);
        const userId = parseInt(formData.get('userId') as string); // In real app, get from session
        const bookingDate = new Date(formData.get('bookingDate') as string);
        const startTime = new Date(`${formData.get('bookingDate')}T${formData.get('startTime')}`);
        const endTime = new Date(`${formData.get('bookingDate')}T${formData.get('endTime')}`);
        const purpose = formData.get('purpose') as string;

        if (!resourceId || !userId || !bookingDate || !startTime || !endTime || !purpose) {
            return { success: false, error: 'All fields are required' };
        }

        // Basic validation: Check availability
        const conflict = await prisma.booking.findFirst({
            where: {
                resourceId,
                bookingDate,
                status: { not: BookingStatus.rejected },
                OR: [
                    {
                        startTime: { lte: startTime },
                        endTime: { gte: startTime }
                    },
                    {
                        startTime: { lte: endTime },
                        endTime: { gte: endTime }
                    }
                ]
            }
        });

        if (conflict) {
            return { success: false, error: 'Resource unavailable for the selected slot' };
        }

        const booking = await prisma.booking.create({
            data: {
                resourceId,
                userId,
                bookingDate,
                startTime,
                endTime,
                purpose,
                status: BookingStatus.pending,
            },
        });
        revalidatePath('/dashboard/bookings');
        updateTag('bookings');
        revalidatePath('/dashboard/resources');
        return { success: true, message: 'Booking request created successfully!' };
    } catch (error) {
        console.error('Booking error:', error);
        return { success: false, error: 'Failed to create booking' };
    }
}

export async function updateBookingStatus(id: number, status: BookingStatus, approverId?: number, reason?: string) {
    try {
        const data: any = { status };
        if (status === BookingStatus.approved && approverId) {
            data.approverId = approverId;
            data.approvedAt = new Date();
        }
        if (status === BookingStatus.rejected && reason) {
            data.rejectionReason = reason;
            data.approverId = approverId; // Approver who rejected
        }

        const booking = await prisma.booking.update({
            where: { id },
            data,
        });
        revalidatePath('/dashboard/bookings');
        updateTag('bookings');
        return { success: true, data: booking };
    } catch (error) {
        return { success: false, error: 'Failed to update booking status' };
    }
}

export async function updateBooking(id: number, data: any) {
    try {
        const booking = await prisma.booking.update({
            where: { id },
            data,
        });
        revalidatePath('/dashboard/bookings');
        updateTag('bookings');
        return { success: true, data: booking };
    } catch (error) {
        return { success: false, error: 'Failed to update booking' };
    }
}

export async function deleteBooking(id: number) {
    try {
        await prisma.booking.delete({
            where: { id },
        });
        revalidatePath('/dashboard/bookings');
        updateTag('bookings');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to delete booking' };
    }
}
