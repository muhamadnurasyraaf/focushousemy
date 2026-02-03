import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all bookings (admin view)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const studioId = searchParams.get('studioId');

    const where: any = {};
    if (status) where.status = status;
    if (studioId) where.studioId = studioId;

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        studio: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

// POST create new booking
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      studioId,
      userId,
      customerName,
      customerEmail,
      customerPhone,
      startTime,
      endTime,
      totalPrice,
      notes,
    } = body;

    if (!studioId || !customerName || !customerEmail || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check for overlapping bookings
    const start = new Date(startTime);
    const end = new Date(endTime);

    const overlapping = await prisma.booking.findFirst({
      where: {
        studioId,
        status: {
          in: ['PENDING', 'APPROVED'],
        },
        OR: [
          {
            AND: [
              { startTime: { lte: start } },
              { endTime: { gt: start } },
            ],
          },
          {
            AND: [
              { startTime: { lt: end } },
              { endTime: { gte: end } },
            ],
          },
          {
            AND: [
              { startTime: { gte: start } },
              { endTime: { lte: end } },
            ],
          },
        ],
      },
    });

    if (overlapping) {
      return NextResponse.json(
        { error: 'Studio is already booked for this time slot' },
        { status: 409 }
      );
    }

    // Create user if not exists
    let user;
    if (userId) {
      user = await prisma.user.findUnique({ where: { id: userId } });
    } else {
      user = await prisma.user.upsert({
        where: { email: customerEmail },
        update: {},
        create: {
          email: customerEmail,
          name: customerName,
          password: '', // Guest users don't need passwords
          role: 'USER',
        },
      });
    }

    const booking = await prisma.booking.create({
      data: {
        studioId,
        userId: user.id,
        customerName,
        customerEmail,
        customerPhone,
        startTime: start,
        endTime: end,
        totalPrice,
        notes,
        status: 'PENDING',
      },
      include: {
        studio: true,
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}
