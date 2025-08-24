/*
  Warnings:

  - You are about to drop the column `biteship_api_key` on the `ShippingProvider` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."ShippingProvider" DROP COLUMN "biteship_api_key",
ADD COLUMN     "last_reset" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "monthly_usage" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "quota_limit" INTEGER NOT NULL DEFAULT 50;
