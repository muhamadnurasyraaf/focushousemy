import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET photography page content
export async function GET() {
  try {
    let page = await prisma.photographyPage.findFirst({
      include: {
        sections: {
          orderBy: { order: "asc" },
        },
      },
    });

    // If no page exists, create a default one
    if (!page) {
      page = await prisma.photographyPage.create({
        data: {
          heroTitle: "Photography & Videography",
          heroSubtitle:
            "Professional photography and videography services to capture your special moments",
        },
        include: {
          sections: true,
        },
      });
    }

    return NextResponse.json(page);
  } catch (error) {
    console.error("Error fetching photography page:", error);
    return NextResponse.json(
      { error: "Failed to fetch photography page" },
      { status: 500 },
    );
  }
}

// PUT update photography page
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { heroTitle, heroSubtitle, heroImage } = body;

    // Get existing page or create one
    let page = await prisma.photographyPage.findFirst();

    if (!page) {
      page = await prisma.photographyPage.create({
        data: {
          heroTitle,
          heroSubtitle,
          heroImage,
        },
        include: {
          sections: true,
        },
      });
    } else {
      page = await prisma.photographyPage.update({
        where: { id: page.id },
        data: {
          heroTitle,
          heroSubtitle,
          heroImage,
        },
        include: {
          sections: true,
        },
      });
    }

    return NextResponse.json(page);
  } catch (error) {
    console.error("Error updating photography page:", error);
    return NextResponse.json(
      { error: "Failed to update photography page" },
      { status: 500 },
    );
  }
}
