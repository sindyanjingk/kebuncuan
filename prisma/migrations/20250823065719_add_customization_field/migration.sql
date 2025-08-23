-- CreateEnum
CREATE TYPE "TemplateCategory" AS ENUM ('MARKETPLACE', 'ECOMMERCE', 'FASHION', 'FOOD', 'ELECTRONICS', 'SERVICES', 'GENERAL');

-- AlterTable
ALTER TABLE "Store" ADD COLUMN     "templateId" TEXT;

-- CreateTable
CREATE TABLE "Template" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "TemplateCategory" NOT NULL,
    "description" TEXT NOT NULL,
    "previewImage" TEXT NOT NULL,
    "thumbnailImage" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "features" JSONB NOT NULL,
    "config" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HeroConfig" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "headline" TEXT NOT NULL,
    "subheadline" TEXT NOT NULL,
    "ctaText" TEXT NOT NULL,
    "ctaUrl" TEXT NOT NULL,
    "backgroundImage" TEXT,
    "backgroundVideo" TEXT,
    "overlayOpacity" DOUBLE PRECISION NOT NULL DEFAULT 0.3,
    "textAlignment" TEXT NOT NULL DEFAULT 'center',
    "showStats" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HeroConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeaturesConfig" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FeaturesConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialProofConfig" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "showTestimonials" BOOLEAN NOT NULL DEFAULT true,
    "showPartnerLogos" BOOLEAN NOT NULL DEFAULT true,
    "showUserCount" BOOLEAN NOT NULL DEFAULT true,
    "showRatings" BOOLEAN NOT NULL DEFAULT true,
    "userCountText" TEXT NOT NULL DEFAULT 'Dipercaya 1000+ pengguna',
    "averageRating" DOUBLE PRECISION NOT NULL DEFAULT 4.8,
    "totalReviews" INTEGER NOT NULL DEFAULT 1200,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SocialProofConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Testimonial" (
    "id" TEXT NOT NULL,
    "socialProofId" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerAvatar" TEXT,
    "customerTitle" TEXT,
    "content" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoreSetting" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "primaryColor" TEXT NOT NULL DEFAULT '#2563eb',
    "secondaryColor" TEXT NOT NULL DEFAULT '#64748b',
    "accentColor" TEXT NOT NULL DEFAULT '#10b981',
    "fontFamily" TEXT NOT NULL DEFAULT 'Inter',
    "logoUrl" TEXT,
    "faviconUrl" TEXT,
    "customCss" TEXT,
    "customJs" TEXT,
    "socialLinks" JSONB,
    "seoConfig" JSONB,
    "contactInfo" JSONB,
    "paymentMethods" JSONB,
    "shippingConfig" JSONB,
    "customization" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StoreSetting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HeroConfig_templateId_key" ON "HeroConfig"("templateId");

-- CreateIndex
CREATE INDEX "FeaturesConfig_templateId_idx" ON "FeaturesConfig"("templateId");

-- CreateIndex
CREATE UNIQUE INDEX "SocialProofConfig_templateId_key" ON "SocialProofConfig"("templateId");

-- CreateIndex
CREATE INDEX "Testimonial_socialProofId_idx" ON "Testimonial"("socialProofId");

-- CreateIndex
CREATE UNIQUE INDEX "StoreSetting_storeId_key" ON "StoreSetting"("storeId");

-- AddForeignKey
ALTER TABLE "Store" ADD CONSTRAINT "Store_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HeroConfig" ADD CONSTRAINT "HeroConfig_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeaturesConfig" ADD CONSTRAINT "FeaturesConfig_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialProofConfig" ADD CONSTRAINT "SocialProofConfig_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Testimonial" ADD CONSTRAINT "Testimonial_socialProofId_fkey" FOREIGN KEY ("socialProofId") REFERENCES "SocialProofConfig"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoreSetting" ADD CONSTRAINT "StoreSetting_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;
