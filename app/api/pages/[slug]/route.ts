import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    let page = await prisma.page.findUnique({
      where: { slug },
    });

    if (!page) {
      page = await prisma.page.create({
        data: {
          slug,
          blocks: [],
          isDraft: true,
        },
      });
    }

    return NextResponse.json(page);
  } catch (error) {
    console.error("Error fetching page:", error);
    return NextResponse.json(
      { error: "Failed to fetch page" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { blocks, isDraft } = body;

    if (!Array.isArray(blocks)) {
      return NextResponse.json(
        { error: "blocks must be an array" },
        { status: 400 },
      );
    }

    let page = await prisma.page.findUnique({
      where: { slug },
    });

    if (!page) {
      page = await prisma.page.create({
        data: {
          slug,
          blocks,
          isDraft: isDraft ?? false,
        },
      });
    } else {
      page = await prisma.page.update({
        where: { slug },
        data: {
          blocks,
          isDraft: isDraft ?? page.isDraft,
        },
      });
    }

    return NextResponse.json(page);
  } catch (error) {
    console.error("Error saving page:", error);
    return NextResponse.json(
      { error: "Failed to save page" },
      { status: 500 },
    );
  }
}
