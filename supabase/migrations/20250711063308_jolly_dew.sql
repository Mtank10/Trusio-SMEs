/*
  # India-specific schema updates

  1. New Tables
    - `user_india_profile` - India-specific user profile data
    - `gst_validations` - GST validation records
    - `msme_registrations` - MSME/Udyam registration data
    - `compliance_records` - Industry compliance tracking

  2. Updates to existing tables
    - Add India-specific fields to users table
    - Add GST and compliance fields to suppliers table
    - Add Indian document types

  3. Security
    - Enable RLS on all new tables
    - Add appropriate policies for data access
*/

-- Add India-specific fields to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS gstin VARCHAR(15);
ALTER TABLE users ADD COLUMN IF NOT EXISTS udyam_number VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS business_state VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS preferred_language VARCHAR(5) DEFAULT 'hi';
ALTER TABLE users ADD COLUMN IF NOT EXISTS industry_type VARCHAR(20);

-- Create user_india_profile table
CREATE TABLE IF NOT EXISTS user_india_profile (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  gstin VARCHAR(15),
  gstin_verified BOOLEAN DEFAULT false,
  gstin_verified_at TIMESTAMP(3),
  udyam_number VARCHAR(20),
  udyam_verified BOOLEAN DEFAULT false,
  udyam_verified_at TIMESTAMP(3),
  business_state VARCHAR(50),
  business_district VARCHAR(100),
  business_pincode VARCHAR(10),
  industry_type VARCHAR(20),
  enterprise_category VARCHAR(10), -- Micro, Small, Medium
  preferred_language VARCHAR(5) DEFAULT 'hi',
  whatsapp_number VARCHAR(15),
  created_at TIMESTAMP(3) DEFAULT now(),
  updated_at TIMESTAMP(3) DEFAULT now()
);

-- Create gst_validations table
CREATE TABLE IF NOT EXISTS gst_validations (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  gstin VARCHAR(15) NOT NULL,
  legal_name TEXT,
  trade_name TEXT,
  registration_date DATE,
  status VARCHAR(20),
  state_code VARCHAR(2),
  state_name VARCHAR(50),
  validation_date TIMESTAMP(3) DEFAULT now(),
  is_valid BOOLEAN DEFAULT false,
  validation_response JSONB,
  created_at TIMESTAMP(3) DEFAULT now()
);

-- Create msme_registrations table
CREATE TABLE IF NOT EXISTS msme_registrations (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  udyam_number VARCHAR(20) NOT NULL UNIQUE,
  enterprise_name TEXT NOT NULL,
  major_activity TEXT,
  enterprise_type VARCHAR(10), -- Micro, Small, Medium
  investment_amount BIGINT,
  turnover_amount BIGINT,
  employment_male INTEGER DEFAULT 0,
  employment_female INTEGER DEFAULT 0,
  date_of_incorporation DATE,
  verification_date TIMESTAMP(3) DEFAULT now(),
  is_verified BOOLEAN DEFAULT false,
  verification_response JSONB,
  created_at TIMESTAMP(3) DEFAULT now()
);

-- Create compliance_records table
CREATE TABLE IF NOT EXISTS compliance_records (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  supplier_id TEXT REFERENCES suppliers(id) ON DELETE CASCADE,
  compliance_type VARCHAR(20) NOT NULL, -- GST, FSSAI, BIS, etc.
  document_type VARCHAR(50),
  certificate_number VARCHAR(100),
  issue_date DATE,
  expiry_date DATE,
  issuing_authority TEXT,
  status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, VERIFIED, EXPIRED
  verification_date TIMESTAMP(3),
  document_url TEXT,
  created_at TIMESTAMP(3) DEFAULT now(),
  updated_at TIMESTAMP(3) DEFAULT now()
);

-- Add India-specific fields to suppliers table
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS gstin VARCHAR(15);
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS udyam_number VARCHAR(20);
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS business_state VARCHAR(50);
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS compliance_score INTEGER DEFAULT 0;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS whatsapp_number VARCHAR(15);

-- Add India-specific document types
ALTER TABLE documents ADD COLUMN IF NOT EXISTS document_category VARCHAR(20);
ALTER TABLE documents ADD COLUMN IF NOT EXISTS compliance_type VARCHAR(20);
ALTER TABLE documents ADD COLUMN IF NOT EXISTS certificate_number VARCHAR(100);
ALTER TABLE documents ADD COLUMN IF NOT EXISTS expiry_date DATE;

-- Enable RLS on new tables
ALTER TABLE user_india_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE gst_validations ENABLE ROW LEVEL SECURITY;
ALTER TABLE msme_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_records ENABLE ROW LEVEL SECURITY;

-- Create policies for user_india_profile
CREATE POLICY "Users can manage own India profile"
  ON user_india_profile
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for gst_validations
CREATE POLICY "Users can view GST validations"
  ON gst_validations
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "System can insert GST validations"
  ON gst_validations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create policies for msme_registrations
CREATE POLICY "Users can view MSME registrations"
  ON msme_registrations
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "System can insert MSME registrations"
  ON msme_registrations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create policies for compliance_records
CREATE POLICY "Users can manage own compliance records"
  ON compliance_records
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_india_profile_user_id ON user_india_profile(user_id);
CREATE INDEX IF NOT EXISTS idx_user_india_profile_gstin ON user_india_profile(gstin);
CREATE INDEX IF NOT EXISTS idx_user_india_profile_udyam ON user_india_profile(udyam_number);

CREATE INDEX IF NOT EXISTS idx_gst_validations_gstin ON gst_validations(gstin);
CREATE INDEX IF NOT EXISTS idx_gst_validations_date ON gst_validations(validation_date);

CREATE INDEX IF NOT EXISTS idx_msme_registrations_udyam ON msme_registrations(udyam_number);
CREATE INDEX IF NOT EXISTS idx_msme_registrations_type ON msme_registrations(enterprise_type);

CREATE INDEX IF NOT EXISTS idx_compliance_records_user_id ON compliance_records(user_id);
CREATE INDEX IF NOT EXISTS idx_compliance_records_supplier_id ON compliance_records(supplier_id);
CREATE INDEX IF NOT EXISTS idx_compliance_records_type ON compliance_records(compliance_type);
CREATE INDEX IF NOT EXISTS idx_compliance_records_status ON compliance_records(status);

CREATE INDEX IF NOT EXISTS idx_suppliers_gstin ON suppliers(gstin);
CREATE INDEX IF NOT EXISTS idx_suppliers_udyam ON suppliers(udyam_number);
CREATE INDEX IF NOT EXISTS idx_suppliers_state ON suppliers(business_state);