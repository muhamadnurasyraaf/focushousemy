import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      accessoryId,
      startDate,
      endDate,
      quantity,
    } = body;

    if (
      !customerName ||
      !customerEmail ||
      !customerPhone ||
      !accessoryId ||
      !startDate ||
      !endDate ||
      !quantity
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if enough quantity is available
    const accessory = await prisma.accessory.findUnique({
      where: { id: accessoryId },
    });

    if (!accessory) {
      return NextResponse.json(
        { error: "Accessory not found" },
        { status: 404 }
      );
    }

    if (accessory.quantity < quantity) {
      return NextResponse.json(
        { error: "Not enough quantity available" },
        { status: 400 }
      );
    }

    // Calculate days and total price
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (days <= 0) {
      return NextResponse.json(
        { error: "End date must be after start date" },
        { status: 400 }
      );
    }

    const totalPrice = days * Number(accessory.pricePerDay) * quantity;

    const rental = await prisma.accessoryRental.create({
      data: {
        customerName,
        customerEmail,
        customerPhone,
        accessoryId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        quantity: parseInt(quantity),
        totalPrice,
        status: "PENDING",
      },
      include: {
        accessory: true,
      },
    });

    return NextResponse.json(rental, { status: 201 });
  } catch (error) {
    console.error("Error creating accessory rental:", error);
    return NextResponse.json(
      { error: "Failed to create accessory rental" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const rentals = await prisma.accessoryRental.findMany({
      include: {
        accessory: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(rentals);
  } catch (error) {
    console.error("Error fetching accessory rentals:", error);
    return NextResponse.json(
      { error: "Failed to fetch accessory rentals" },
      { status: 500 }
    );
  }
}
