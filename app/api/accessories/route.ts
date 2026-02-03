import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all accessories
export async function GET() {
  try {
    const accessories = await prisma.accessory.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(accessories);
  } catch (error) {
    console.error('Error fetching accessories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch accessories' },
      { status: 500 }
    );
  }
}

// POST create new accessory
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, category, quantity, pricePerDay, images } = body;

    if (!name || !pricePerDay) {
      return NextResponse.json(
        { error: 'Name and price are required' },
        { status: 400 }
      );
    }

    const accessory = await prisma.accessory.create({
      data: {
        name,
        description,
        category,
        quantity: quantity ? parseInt(quantity) : 1,
        pricePerDay,
        images: images || [],
      },
    });

    return NextResponse.json(accessory, { status: 201 });
  } catch (error) {
    console.error('Error creating accessory:', error);
    return NextResponse.json(
      { error: 'Failed to create accessory' },
      { status: 500 }
    );
  }
}
