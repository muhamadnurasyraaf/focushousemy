import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET single repair service
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const service = await prisma.repairService.findUnique({
      where: { id },
    });

    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    return NextResponse.json(service);
  } catch (error) {
    console.error('Error fetching repair service:', error);
    return NextResponse.json(
      { error: 'Failed to fetch repair service' },
      { status: 500 }
    );
  }
}

// PUT update repair service
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, basePrice, isActive } = body;

    const service = await prisma.repairService.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(basePrice && { basePrice }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json(service);
  } catch (error) {
    console.error('Error updating repair service:', error);
    return NextResponse.json(
      { error: 'Failed to update repair service' },
      { status: 500 }
    );
  }
}

// DELETE repair service
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.repairService.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting repair service:', error);
    return NextResponse.json(
      { error: 'Failed to delete repair service' },
      { status: 500 }
    );
  }
}
