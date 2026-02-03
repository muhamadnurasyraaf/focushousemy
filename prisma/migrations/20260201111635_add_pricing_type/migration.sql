-- CreateEnum
CREATE TYPE "PricingType" AS ENUM ('PER_HOUR', 'PER_DAY');

-- AlterTable
ALTER TABLE "Studio" ADD COLUMN     "pricingType" "PricingType" NOT NULL DEFAULT 'PER_HOUR';
