import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all photography services
export async function GET() {
  try {
    const services = await prisma.photographyService.findMany({
      where: { isActive: true },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json(services);
  } catch (error) {
    console.error("Error fetching photography services:", error);
    return NextResponse.json(
      { error: "Failed to fetch photography services" },
      { status: 500 },
    );
  }
}

// POST create new photography service
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      details,
      price,
      duration,
      mainImage,
      galleryImages,
      videos,
      features,
      category,
      order,
    } = body;

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const service = await prisma.photographyService.create({
      data: {
        title,
        description,
        details,
        price: price ? parseFloat(price) : null,
        duration,
        mainImage,
        galleryImages: galleryImages || [],
        videos: videos || [],
        features: features || [],
        category: category || "PHOTOGRAPHY",
        order: order ? parseInt(order) : 0,
      },
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error("Error creating photography service:", error);
    return NextResponse.json(
      { error: "Failed to create photography service" },
      { status: 500 },
    );
  }
}
