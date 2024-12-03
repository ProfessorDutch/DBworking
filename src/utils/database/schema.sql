-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing table if it exists
DROP TABLE IF EXISTS enrollments;

-- Enrollments table
CREATE TABLE enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    type VARCHAR(50) NOT NULL CHECK (type IN ('ambassador', 'business', 'subscriber')),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    church VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    commitments_accepted BOOLEAN DEFAULT false,
    commitments TEXT[] DEFAULT '{}',
    business_name VARCHAR(255),
    website VARCHAR(255),
    address TEXT,
    description TEXT,
    support_type TEXT[] DEFAULT '{}',
    subscription_tier VARCHAR(50) CHECK (subscription_tier IN ('seed', 'growth', 'harvest')),
    payment_method VARCHAR(100),
    billing_address JSONB
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_enrollments_type ON enrollments(type);
CREATE INDEX IF NOT EXISTS idx_enrollments_email ON enrollments(email);
CREATE INDEX IF NOT EXISTS idx_enrollments_status ON enrollments(status);
CREATE INDEX IF NOT EXISTS idx_enrollments_commitments ON enrollments(commitments_accepted);

-- Enable row level security
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts
CREATE POLICY "Allow anonymous insert"
ON enrollments FOR INSERT
TO anon
WITH CHECK (true);

-- Allow anonymous reads
CREATE POLICY "Allow anonymous read access"
ON enrollments FOR SELECT
TO anon
USING (true);