import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST create new section
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pageId, title, content, images, layout, order } = body;

    if (!pageId || !title) {
      return NextResponse.json(
        { error: "Page ID and title are required" },
        { status: 400 },
      );
    }

    const section = await prisma.photographyPageSection.create({
      data: {
        pageId,
        title,
        content,
        images: images || [],
        layout: layout || "IMAGE_LEFT",
        order: order || 0,
      },
    });

    return NextResponse.json(section, { status: 201 });
  } catch (error) {
    console.error("Error creating section:", error);
    return NextResponse.json(
      { error: "Failed to create section" },
      { status: 500 },
    );
  }
}
