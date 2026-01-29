'use server';

import { prisma } from '@/lib/db';
import { BookingStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function getBookings() {
    try {
        const bookings = await prisma.booking.findMany({
            include: {
                user: { select: { name: true, email: true } },
                resource: { select: { name: true, type: true } },
            },
            orderBy: { bookingDate: 'desc' },
        });
        return { success: true, data: bookings };
    } catch (error) {
        return { success: false, error: 'Failed to fetch bookings' };
    }
}

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
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to delete booking' };
    }
}
