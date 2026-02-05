-- CreateTable
CREATE TABLE "PhotographyService" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "details" TEXT,
    "price" DECIMAL(10,2),
    "duration" TEXT,
    "image" TEXT,
    "features" TEXT[],
    "category" TEXT NOT NULL DEFAULT 'PHOTOGRAPHY',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PhotographyService_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PhotographyService_category_idx" ON "PhotographyService"("category");

-- CreateIndex
CREATE INDEX "PhotographyService_isActive_idx" ON "PhotographyService"("isActive");

-- CreateIndex
CREATE INDEX "PhotographyService_order_idx" ON "PhotographyService"("order");
