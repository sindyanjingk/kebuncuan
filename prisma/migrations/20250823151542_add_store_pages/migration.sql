-- CreateEnum
CREATE TYPE "StorePageType" AS ENUM ('ABOUT_US', 'FAQ', 'BLOG', 'CAREER', 'HELP_CENTER', 'CONTACT_US', 'RETURN_POLICY', 'WARRANTY_CLAIM', 'TRACK_ORDER', 'TERMS_CONDITIONS', 'PRIVACY_POLICY', 'SITEMAP');

-- CreateTable
CREATE TABLE "StorePage" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "type" "StorePageType" NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "metaTitle" TEXT,
    "metaDesc" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StorePage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StorePage_storeId_idx" ON "StorePage"("storeId");

-- CreateIndex
CREATE INDEX "StorePage_storeId_type_idx" ON "StorePage"("storeId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "StorePage_storeId_slug_key" ON "StorePage"("storeId", "slug");

-- AddForeignKey
ALTER TABLE "StorePage" ADD CONSTRAINT "StorePage_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;
