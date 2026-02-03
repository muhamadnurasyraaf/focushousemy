import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendBookingApprovedEmail, sendBookingCancelledEmail } from '@/lib/email';

// PUT update booking status
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, cancelReason } = body;

    if (!status || !['APPROVED', 'CANCELLED', 'COMPLETED'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Get the booking first
    const existingBooking = await prisma.booking.findUnique({
      where: { id },
      include: { studio: true },
    });

    if (!existingBooking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Update the booking
    const booking = await prisma.booking.update({
      where: { id },
      data: {
        status,
        ...(cancelReason && { cancelReason }),
      },
      include: {
        studio: true,
        user: true,
      },
    });

    // Send email notification
    if (status === 'APPROVED') {
      await sendBookingApprovedEmail(
        booking.customerEmail,
        booking.customerName,
        booking.studio.name,
        booking.startTime,
        booking.endTime
      );
    } else if (status === 'CANCELLED') {
      await sendBookingCancelledEmail(
        booking.customerEmail,
        booking.customerName,
        booking.studio.name,
        booking.startTime,
        booking.endTime,
        cancelReason
      );
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error('Error updating booking status:', error);
    return NextResponse.json(
      { error: 'Failed to update booking status' },
      { status: 500 }
    );
  }
}
