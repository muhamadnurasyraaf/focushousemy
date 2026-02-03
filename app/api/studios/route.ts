import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all studios
export async function GET() {
  try {
    const studios = await prisma.studio.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(studios);
  } catch (error) {
    console.error("Error fetching studios:", error);
    return NextResponse.json(
      { error: "Failed to fetch studios" },
      { status: 500 },
    );
  }
}

// POST create new studio
export async function POST(request: NextRequest) {
  try {
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
    } = body;

    if (!name || !pricePerHour) {
      return NextResponse.json(
        { error: "Name and price are required" },
        { status: 400 },
      );
    }

    const studio = await prisma.studio.create({
      data: {
        name,
        description,
        location,
        capacity: capacity ? parseInt(capacity) : null,
        pricePerHour,
        pricingType: pricingType || "PER_HOUR",
        images: images || [],
        amenities: amenities || [],
      },
    });

    return NextResponse.json(studio, { status: 201 });
  } catch (error) {
    console.error("Error creating studio:", error);
    return NextResponse.json(
      { error: "Failed to create studio" },
      { status: 500 },
    );
  }
}
