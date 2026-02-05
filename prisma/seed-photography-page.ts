import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import "dotenv/config";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const blocks = [
    {
      id: "block-hero-001",
      type: "hero",
      order: 0,
      data: {
        backgroundImage: "",
        title: "Photography & Videography",
        subtitle:
          "Professional photography and videography services to capture your most precious moments",
        ctaText: "Explore Our Work",
        ctaLink: "#gallery",
        overlayOpacity: 60,
      },
    },
    {
      id: "block-imgtext-001",
      type: "image-text",
      order: 1,
      data: {
        image: "",
        title: "Wedding Photography",
        description:
          "Every love story is unique. We capture the emotions, details, and candid moments that make your wedding day unforgettable. From ceremony to reception, our team ensures every moment is preserved beautifully.",
        imagePosition: "left",
        backgroundColor: "transparent",
        paddingSize: "large",
      },
    },
    {
      id: "block-imgtext-002",
      type: "image-text",
      order: 2,
      data: {
        image: "",
        title: "Portrait Sessions",
        description:
          "Whether it's graduation, family, or professional headshots, our portrait sessions are designed to bring out the best in you. We work with natural and studio lighting to create stunning results.",
        imagePosition: "right",
        backgroundColor: "dark",
        paddingSize: "large",
      },
    },
    {
      id: "block-gallery-001",
      type: "gallery",
      order: 3,
      data: {
        images: [],
        columns: 3,
        lightbox: true,
      },
    },
    {
      id: "block-banner-001",
      type: "full-width-banner",
      order: 4,
      data: {
        backgroundImage: "",
        title: "Ready to Create Something Beautiful?",
        subtitle: "Let's discuss your vision and make it a reality",
        ctaText: "Book a Session",
        ctaLink: "#contact",
        overlayOpacity: 50,
      },
    },
  ];

  const page = await prisma.page.upsert({
    where: { slug: "photography" },
    update: { blocks },
    create: {
      slug: "photography",
      blocks,
      isDraft: false,
    },
  });

  console.log("Photography page seeded:", page.id);
  console.log("Blocks:", blocks.length);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
