import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET single photography service
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const service = await prisma.photographyService.findUnique({
      where: { id },
    });

    if (!service) {
      return NextResponse.json(
        { error: "Photography service not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(service);
  } catch (error) {
    console.error("Error fetching photography service:", error);
    return NextResponse.json(
      { error: "Failed to fetch photography service" },
      { status: 500 },
    );
  }
}

// PUT update photography service
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
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
      isActive,
      order,
    } = body;

    const service = await prisma.photographyService.update({
      where: { id },
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
        category,
        isActive,
        order: order !== undefined ? parseInt(order) : undefined,
      },
    });

    return NextResponse.json(service);
  } catch (error) {
    console.error("Error updating photography service:", error);
    return NextResponse.json(
      { error: "Failed to update photography service" },
      { status: 500 },
    );
  }
}

// DELETE photography service
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await prisma.photographyService.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting photography service:", error);
    return NextResponse.json(
      { error: "Failed to delete photography service" },
      { status: 500 },
    );
  }
}
