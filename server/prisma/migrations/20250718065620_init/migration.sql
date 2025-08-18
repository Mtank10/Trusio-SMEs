-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SME_ADMIN', 'SUPPLIER');

-- CreateEnum
CREATE TYPE "SupplierStatus" AS ENUM ('PENDING', 'RESPONDED', 'VERIFIED');

-- CreateEnum
CREATE TYPE "SurveyResponseStatus" AS ENUM ('PENDING', 'SUBMITTED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'SME_ADMIN',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "gstin" VARCHAR(15),
    "udyam_number" VARCHAR(20),
    "business_state" VARCHAR(50),
    "preferred_language" VARCHAR(5) NOT NULL DEFAULT 'hi',
    "industry_type" VARCHAR(20),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "sme_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "suppliers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "tier" INTEGER NOT NULL,
    "parent_supplier_id" TEXT,
    "product_id" TEXT NOT NULL,
    "status" "SupplierStatus" NOT NULL DEFAULT 'PENDING',
    "response_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "gstin" VARCHAR(15),
    "udyam_number" VARCHAR(20),
    "business_state" VARCHAR(50),
    "compliance_score" INTEGER NOT NULL DEFAULT 0,
    "whatsapp_number" VARCHAR(15),

    CONSTRAINT "suppliers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "surveys" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "supplier_tier" INTEGER NOT NULL,
    "questions" JSONB NOT NULL,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "surveys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "survey_responses" (
    "id" TEXT NOT NULL,
    "survey_id" TEXT NOT NULL,
    "supplier_email" TEXT NOT NULL,
    "supplier_id" TEXT,
    "answers" JSONB NOT NULL,
    "status" "SurveyResponseStatus" NOT NULL DEFAULT 'PENDING',
    "token" TEXT NOT NULL,
    "submitted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "survey_responses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" TEXT NOT NULL,
    "survey_response_id" TEXT NOT NULL,
    "original_filename" TEXT NOT NULL,
    "storage_path" TEXT NOT NULL,
    "hash_sha256" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "blockchain_anchor_tx_id" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "file_size" BIGINT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "document_category" VARCHAR(20),
    "compliance_type" VARCHAR(20),
    "certificate_number" VARCHAR(100),
    "expiry_date" TIMESTAMP(3),

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "generated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pdf_url" TEXT NOT NULL,
    "verification_url" TEXT NOT NULL,
    "transparency_score" INTEGER NOT NULL,
    "supplier_completion_rate" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_india_profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "gstin" VARCHAR(15),
    "gstin_verified" BOOLEAN NOT NULL DEFAULT false,
    "gstin_verified_at" TIMESTAMP(3),
    "udyam_number" VARCHAR(20),
    "udyam_verified" BOOLEAN NOT NULL DEFAULT false,
    "udyam_verified_at" TIMESTAMP(3),
    "business_state" VARCHAR(50),
    "business_district" VARCHAR(100),
    "business_pincode" VARCHAR(10),
    "industry_type" VARCHAR(20),
    "enterprise_category" VARCHAR(10),
    "preferred_language" VARCHAR(5) NOT NULL DEFAULT 'hi',
    "whatsapp_number" VARCHAR(15),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_india_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gst_validations" (
    "id" TEXT NOT NULL,
    "gstin" VARCHAR(15) NOT NULL,
    "legal_name" TEXT,
    "trade_name" TEXT,
    "registration_date" TIMESTAMP(3),
    "status" VARCHAR(20),
    "state_code" VARCHAR(2),
    "state_name" VARCHAR(50),
    "validation_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_valid" BOOLEAN NOT NULL DEFAULT false,
    "validation_response" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gst_validations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "msme_registrations" (
    "id" TEXT NOT NULL,
    "udyam_number" VARCHAR(20) NOT NULL,
    "enterprise_name" TEXT NOT NULL,
    "major_activity" TEXT,
    "enterprise_type" VARCHAR(10),
    "investment_amount" BIGINT,
    "turnover_amount" BIGINT,
    "employment_male" INTEGER NOT NULL DEFAULT 0,
    "employment_female" INTEGER NOT NULL DEFAULT 0,
    "date_of_incorporation" TIMESTAMP(3),
    "verification_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "verification_response" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "msme_registrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "compliance_records" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "supplierId" TEXT,
    "compliance_type" VARCHAR(20) NOT NULL,
    "document_type" VARCHAR(50),
    "certificate_number" VARCHAR(100),
    "issue_date" TIMESTAMP(3),
    "expiry_date" TIMESTAMP(3),
    "issuing_authority" TEXT,
    "status" VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    "verification_date" TIMESTAMP(3),
    "document_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "compliance_records_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "suppliers_gstin_idx" ON "suppliers"("gstin");

-- CreateIndex
CREATE INDEX "suppliers_udyam_number_idx" ON "suppliers"("udyam_number");

-- CreateIndex
CREATE INDEX "suppliers_business_state_idx" ON "suppliers"("business_state");

-- CreateIndex
CREATE UNIQUE INDEX "survey_responses_token_key" ON "survey_responses"("token");

-- CreateIndex
CREATE UNIQUE INDEX "user_india_profile_userId_key" ON "user_india_profile"("userId");

-- CreateIndex
CREATE INDEX "user_india_profile_userId_idx" ON "user_india_profile"("userId");

-- CreateIndex
CREATE INDEX "user_india_profile_gstin_idx" ON "user_india_profile"("gstin");

-- CreateIndex
CREATE INDEX "user_india_profile_udyam_number_idx" ON "user_india_profile"("udyam_number");

-- CreateIndex
CREATE INDEX "gst_validations_gstin_idx" ON "gst_validations"("gstin");

-- CreateIndex
CREATE INDEX "gst_validations_validation_date_idx" ON "gst_validations"("validation_date");

-- CreateIndex
CREATE UNIQUE INDEX "msme_registrations_udyam_number_key" ON "msme_registrations"("udyam_number");

-- CreateIndex
CREATE INDEX "msme_registrations_udyam_number_idx" ON "msme_registrations"("udyam_number");

-- CreateIndex
CREATE INDEX "msme_registrations_enterprise_type_idx" ON "msme_registrations"("enterprise_type");

-- CreateIndex
CREATE INDEX "compliance_records_userId_idx" ON "compliance_records"("userId");

-- CreateIndex
CREATE INDEX "compliance_records_supplierId_idx" ON "compliance_records"("supplierId");

-- CreateIndex
CREATE INDEX "compliance_records_compliance_type_idx" ON "compliance_records"("compliance_type");

-- CreateIndex
CREATE INDEX "compliance_records_status_idx" ON "compliance_records"("status");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_sme_id_fkey" FOREIGN KEY ("sme_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suppliers" ADD CONSTRAINT "suppliers_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suppliers" ADD CONSTRAINT "suppliers_parent_supplier_id_fkey" FOREIGN KEY ("parent_supplier_id") REFERENCES "suppliers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "surveys" ADD CONSTRAINT "surveys_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "surveys" ADD CONSTRAINT "surveys_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "survey_responses" ADD CONSTRAINT "survey_responses_survey_id_fkey" FOREIGN KEY ("survey_id") REFERENCES "surveys"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "survey_responses" ADD CONSTRAINT "survey_responses_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_survey_response_id_fkey" FOREIGN KEY ("survey_response_id") REFERENCES "survey_responses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_india_profile" ADD CONSTRAINT "user_india_profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compliance_records" ADD CONSTRAINT "compliance_records_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compliance_records" ADD CONSTRAINT "compliance_records_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "suppliers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
