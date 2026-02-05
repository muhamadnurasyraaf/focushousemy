/*
  Warnings:

  - You are about to drop the column `image` on the `PhotographyService` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PhotographyService" DROP COLUMN "image",
ADD COLUMN     "galleryImages" TEXT[],
ADD COLUMN     "mainImage" TEXT;
