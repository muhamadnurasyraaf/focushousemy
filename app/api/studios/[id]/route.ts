import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET single studio
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const studio = await prisma.studio.findUnique({
      where: { id },
      include: {
        bookings: {
          where: {
            status: "APPROVED",
          },
          select: {
            startTime: true,
            endTime: true,
          },
        },
      },
    });

    if (!studio) {
      return NextResponse.json({ error: "Studio not found" }, { status: 404 });
    }

    return NextResponse.json(studio);
  } catch (error) {
    console.error("Error fetching studio:", error);
    return NextResponse.json(
      { error: "Failed to fetch studio" },
      { status: 500 },
    );
  }
}

// PUT update studio
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      name,
      description,
      location,
      capacity,
      pricePerHour,
      pricingType,
      images,
      amenities,
      isActive,
    } = body;

    const studio = await prisma.studio.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(location !== undefined && { location }),
        ...(capacity !== undefined && {
          capacity: capacity ? parseInt(capacity) : null,
        }),
        ...(pricePerHour && { pricePerHour }),
        ...(pricingType && { pricingType }),
        ...(images && { images }),
        ...(amenities && { amenities }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json(studio);
  } catch (error) {
    console.error("Error updating studio:", error);
    return NextResponse.json(
      { error: "Failed to update studio" },
      { status: 500 },
    );
  }
}

// DELETE studio
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await prisma.studio.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Studio deleted successfully" });
  } catch (error) {
    console.error("Error deleting studio:", error);
    return NextResponse.json(
      { error: "Failed to delete studio" },
      { status: 500 },
    );
  }
}
