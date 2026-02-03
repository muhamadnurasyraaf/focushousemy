/*
  Warnings:

  - You are about to drop the column `deviceDetails` on the `RepairRequest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AccessoryRental" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Booking" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "RepairRequest" DROP COLUMN "deviceDetails",
ALTER COLUMN "userId" DROP NOT NULL;
