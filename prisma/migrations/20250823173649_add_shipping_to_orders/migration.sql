-- AlterTable
ALTER TABLE "public"."Order" ADD COLUMN     "shipping_address" TEXT,
ADD COLUMN     "shipping_city" TEXT,
ADD COLUMN     "shipping_cost" INTEGER,
ADD COLUMN     "shipping_courier" TEXT,
ADD COLUMN     "shipping_name" TEXT,
ADD COLUMN     "shipping_phone" TEXT,
ADD COLUMN     "shipping_postal_code" TEXT,
ADD COLUMN     "shipping_province" TEXT,
ADD COLUMN     "shipping_required" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "shipping_service" TEXT;
