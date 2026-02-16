import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const combo = await prisma.accessoryCombo.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            accessory: true,
          },
        },
      },
    });

    if (!combo) {
      return NextResponse.json({ error: "Combo not found" }, { status: 404 });
    }

    return NextResponse.json(combo);
  } catch (error) {
    console.error("Error fetching combo:", error);
    return NextResponse.json(
      { error: "Failed to fetch combo" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, price, images, isActive, order, items } = body;

    const combo = await prisma.accessoryCombo.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price }),
        ...(images && { images }),
        ...(isActive !== undefined && { isActive }),
        ...(order !== undefined && { order }),
        ...(items && {
          items: {
            deleteMany: {},
            create: items.map(
              (item: { accessoryId: string; quantity?: number }) => ({
                accessoryId: item.accessoryId,
                quantity: item.quantity || 1,
              }),
            ),
          },
        }),
      },
      include: {
        items: {
          include: {
            accessory: true,
          },
        },
      },
    });

    return NextResponse.json(combo);
  } catch (error) {
    console.error("Error updating combo:", error);
    return NextResponse.json(
      { error: "Failed to update combo" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await prisma.accessoryCombo.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Combo deleted successfully" });
  } catch (error) {
    console.error("Error deleting combo:", error);
    return NextResponse.json(
      { error: "Failed to delete combo" },
      { status: 500 },
    );
  }
}
