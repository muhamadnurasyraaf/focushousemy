-- CreateEnum
CREATE TYPE "RepairRequestStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Accessory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "pricePerDay" DECIMAL(10,2) NOT NULL,
    "images" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Accessory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccessoryRental" (
    "id" TEXT NOT NULL,
    "accessoryId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerPhone" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "totalPrice" DECIMAL(10,2) NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "cancelReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccessoryRental_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RepairService" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "basePrice" DECIMAL(10,2) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RepairService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RepairRequest" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerPhone" TEXT,
    "deviceDetails" TEXT NOT NULL,
    "issueDescription" TEXT NOT NULL,
    "estimatedPrice" DECIMAL(10,2),
    "finalPrice" DECIMAL(10,2),
    "status" "RepairRequestStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "cancelReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RepairRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AccessoryRental_accessoryId_idx" ON "AccessoryRental"("accessoryId");

-- CreateIndex
CREATE INDEX "AccessoryRental_userId_idx" ON "AccessoryRental"("userId");

-- CreateIndex
CREATE INDEX "AccessoryRental_status_idx" ON "AccessoryRental"("status");

-- CreateIndex
CREATE INDEX "RepairRequest_serviceId_idx" ON "RepairRequest"("serviceId");

-- CreateIndex
CREATE INDEX "RepairRequest_userId_idx" ON "RepairRequest"("userId");

-- CreateIndex
CREATE INDEX "RepairRequest_status_idx" ON "RepairRequest"("status");

-- AddForeignKey
ALTER TABLE "AccessoryRental" ADD CONSTRAINT "AccessoryRental_accessoryId_fkey" FOREIGN KEY ("accessoryId") REFERENCES "Accessory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessoryRental" ADD CONSTRAINT "AccessoryRental_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RepairRequest" ADD CONSTRAINT "RepairRequest_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "RepairService"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RepairRequest" ADD CONSTRAINT "RepairRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
