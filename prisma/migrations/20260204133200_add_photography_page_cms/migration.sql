-- CreateTable
CREATE TABLE "PhotographyPage" (
    "id" TEXT NOT NULL,
    "heroTitle" TEXT NOT NULL DEFAULT 'Photography & Videography',
    "heroSubtitle" TEXT,
    "heroImage" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PhotographyPage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhotographyPageSection" (
    "id" TEXT NOT NULL,
    "pageId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "images" TEXT[],
    "layout" TEXT NOT NULL DEFAULT 'IMAGE_LEFT',
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PhotographyPageSection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PhotographyPageSection_pageId_idx" ON "PhotographyPageSection"("pageId");

-- CreateIndex
CREATE INDEX "PhotographyPageSection_order_idx" ON "PhotographyPageSection"("order");

-- AddForeignKey
ALTER TABLE "PhotographyPageSection" ADD CONSTRAINT "PhotographyPageSection_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "PhotographyPage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
