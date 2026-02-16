/*
  Warnings:

  - You are about to drop the `AccessoryRental` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AccessoryRental" DROP CONSTRAINT "AccessoryRental_accessoryId_fkey";

-- DropForeignKey
ALTER TABLE "AccessoryRental" DROP CONSTRAINT "AccessoryRental_userId_fkey";

-- DropTable
DROP TABLE "AccessoryRental";

-- DropEnum
DROP TYPE "BookingStatus";

-- CreateTable
CREATE TABLE "AccessoryCombo" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "images" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccessoryCombo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccessoryComboItem" (
    "id" TEXT NOT NULL,
    "comboId" TEXT NOT NULL,
    "accessoryId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AccessoryComboItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AccessoryCombo_isActive_idx" ON "AccessoryCombo"("isActive");

-- CreateIndex
CREATE INDEX "AccessoryCombo_order_idx" ON "AccessoryCombo"("order");

-- CreateIndex
CREATE INDEX "AccessoryComboItem_comboId_idx" ON "AccessoryComboItem"("comboId");

-- CreateIndex
CREATE INDEX "AccessoryComboItem_accessoryId_idx" ON "AccessoryComboItem"("accessoryId");

-- AddForeignKey
ALTER TABLE "AccessoryComboItem" ADD CONSTRAINT "AccessoryComboItem_comboId_fkey" FOREIGN KEY ("comboId") REFERENCES "AccessoryCombo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessoryComboItem" ADD CONSTRAINT "AccessoryComboItem_accessoryId_fkey" FOREIGN KEY ("accessoryId") REFERENCES "Accessory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
