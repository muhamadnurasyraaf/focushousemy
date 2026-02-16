import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const combos = await prisma.accessoryCombo.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      include: {
        items: {
          include: {
            accessory: true,
          },
        },
      },
    });

    return NextResponse.json(combos);
  } catch (error) {
    console.error("Error fetching combos:", error);
    return NextResponse.json(
      { error: "Failed to fetch combos" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, price, images, items } = body;

    if (!name || price === undefined) {
      return NextResponse.json(
        { error: "Name and price are required" },
        { status: 400 },
      );
    }

    const combo = await prisma.accessoryCombo.create({
      data: {
        name,
        description,
        price,
        images: images || [],
        items: {
          create: (items || []).map(
            (item: { accessoryId: string; quantity?: number }) => ({
              accessoryId: item.accessoryId,
              quantity: item.quantity || 1,
            }),
          ),
        },
      },
      include: {
        items: {
          include: {
            accessory: true,
          },
        },
      },
    });

    return NextResponse.json(combo, { status: 201 });
  } catch (error) {
    console.error("Error creating combo:", error);
    return NextResponse.json(
      { error: "Failed to create combo" },
      { status: 500 },
    );
  }
}
