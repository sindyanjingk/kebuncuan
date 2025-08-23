-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ProductType" ADD VALUE 'PHYSICAL';
ALTER TYPE "ProductType" ADD VALUE 'DIGITAL';

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "modalPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "productType" "ProductType" NOT NULL DEFAULT 'PPOB';
