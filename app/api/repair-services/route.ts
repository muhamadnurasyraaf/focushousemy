import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all repair services
export async function GET() {
  try {
    const services = await prisma.repairService.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(services);
  } catch (error) {
    console.error('Error fetching repair services:', error);
    return NextResponse.json(
      { error: 'Failed to fetch repair services' },
      { status: 500 }
    );
  }
}

// POST create new repair service
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, basePrice } = body;

    if (!name || !basePrice) {
      return NextResponse.json(
        { error: 'Name and base price are required' },
        { status: 400 }
      );
    }

    const service = await prisma.repairService.create({
      data: {
        name,
        description,
        basePrice,
      },
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error('Error creating repair service:', error);
    return NextResponse.json(
      { error: 'Failed to create repair service' },
      { status: 500 }
    );
  }
}
