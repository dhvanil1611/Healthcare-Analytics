-- Add fastingGlucose column to predictions table if it doesn't exist
ALTER TABLE predictions 
ADD COLUMN IF NOT EXISTS fastingGlucose DECIMAL(10,2) NULL;
