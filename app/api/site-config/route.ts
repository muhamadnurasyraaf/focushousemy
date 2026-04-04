import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET site config (or create default if doesn't exist)
export async function GET() {
  try {
    let config = await prisma.siteConfig.findFirst();

    // If no config exists, create a default one
    if (!config) {
      config = await prisma.siteConfig.create({
        data: {
          heroBackgroundImage: null,
        },
      });
    }

    return NextResponse.json(config);
  } catch (error) {
    console.error("Error fetching site config:", error);
    return NextResponse.json(
      { error: "Failed to fetch site config" },
      { status: 500 },
    );
  }
}

// PUT update site config
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { heroBackgroundImage, contactNumber, instagram, instagramCatalogue, facebook, address } =
      body;

    // Get existing config or create one
    let config = await prisma.siteConfig.findFirst();

    const updateData: Record<string, unknown> = {};
    if ("heroBackgroundImage" in body)
      updateData.heroBackgroundImage = heroBackgroundImage;
    if ("contactNumber" in body) updateData.contactNumber = contactNumber;
    if ("instagram" in body) updateData.instagram = instagram;
    if ("instagramCatalogue" in body) updateData.instagramCatalogue = instagramCatalogue;
    if ("facebook" in body) updateData.facebook = facebook;
    if ("address" in body) updateData.address = address;

    if (!config) {
      config = await prisma.siteConfig.create({
        data: {
          heroBackgroundImage: heroBackgroundImage ?? null,
          contactNumber: contactNumber ?? null,
          instagram: instagram ?? null,
          instagramCatalogue: instagramCatalogue ?? null,
          facebook: facebook ?? null,
          address: address ?? null,
        },
      });
    } else {
      config = await prisma.siteConfig.update({
        where: { id: config.id },
        data: updateData,
      });
    }

    return NextResponse.json(config);
  } catch (error) {
    console.error("Error updating site config:", error);
    return NextResponse.json(
      { error: "Failed to update site config" },
      { status: 500 },
    );
  }
}
