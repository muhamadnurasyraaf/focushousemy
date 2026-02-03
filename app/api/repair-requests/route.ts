import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      serviceId,
      issueDescription,
    } = body;

    if (
      !customerName ||
      !customerEmail ||
      !customerPhone ||
      !serviceId ||
      !issueDescription
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const repairRequest = await prisma.repairRequest.create({
      data: {
        customerName,
        customerEmail,
        customerPhone,
        serviceId,
        issueDescription,
        status: "PENDING",
      },
      include: {
        service: true,
      },
    });

    return NextResponse.json(repairRequest, { status: 201 });
  } catch (error) {
    console.error("Error creating repair request:", error);
    return NextResponse.json(
      { error: "Failed to create repair request" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const repairRequests = await prisma.repairRequest.findMany({
      include: {
        service: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(repairRequests);
  } catch (error) {
    console.error("Error fetching repair requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch repair requests" },
      { status: 500 }
    );
  }
}
