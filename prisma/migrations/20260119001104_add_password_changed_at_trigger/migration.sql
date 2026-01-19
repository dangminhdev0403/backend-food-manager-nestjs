-- Add trigger for passwordChangedAt
CREATE OR REPLACE FUNCTION update_password_changed_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.password IS DISTINCT FROM OLD.password THEN
    NEW."passwordChangedAt" = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_password_changed_at
BEFORE UPDATE ON "User"
FOR EACH ROW
EXECUTE FUNCTION update_password_changed_at();
