import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET single accessory
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const accessory = await prisma.accessory.findUnique({
      where: { id },
    });

    if (!accessory) {
      return NextResponse.json({ error: 'Accessory not found' }, { status: 404 });
    }

    return NextResponse.json(accessory);
  } catch (error) {
    console.error('Error fetching accessory:', error);
    return NextResponse.json(
      { error: 'Failed to fetch accessory' },
      { status: 500 }
    );
  }
}

// PUT update accessory
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, category, quantity, pricePerDay, images, isActive } = body;

    const accessory = await prisma.accessory.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(category !== undefined && { category }),
        ...(quantity !== undefined && { quantity: parseInt(quantity) }),
        ...(pricePerDay && { pricePerDay }),
        ...(images && { images }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json(accessory);
  } catch (error) {
    console.error('Error updating accessory:', error);
    return NextResponse.json(
      { error: 'Failed to update accessory' },
      { status: 500 }
    );
  }
}

// DELETE accessory
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.accessory.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Accessory deleted successfully' });
  } catch (error) {
    console.error('Error deleting accessory:', error);
    return NextResponse.json(
      { error: 'Failed to delete accessory' },
      { status: 500 }
    );
  }
}
