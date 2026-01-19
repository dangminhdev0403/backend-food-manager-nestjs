-- This is an empty migration.-- Ensure passwordChangedAt uses timestamptz
ALTER TABLE "User"
  ALTER COLUMN "passwordChangedAt" TYPE timestamptz USING "passwordChangedAt" AT TIME ZONE 'UTC';

-- Create or replace trigger function
CREATE OR REPLACE FUNCTION update_password_changed_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.password IS DISTINCT FROM OLD.password THEN
    NEW."passwordChangedAt" = CURRENT_TIMESTAMP;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if exists (avoid duplicate errors)
DROP TRIGGER IF EXISTS trg_update_password_changed_at ON "User";

-- Create trigger
CREATE TRIGGER trg_update_password_changed_at
BEFORE UPDATE ON "User"
FOR EACH ROW
EXECUTE FUNCTION update_password_changed_at();
