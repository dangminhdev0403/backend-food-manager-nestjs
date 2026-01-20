-- 1. Tạo function bảo vệ role Admin
CREATE OR REPLACE FUNCTION prevent_admin_role_id_change()
RETURNS trigger AS $$
BEGIN
  -- Chặn UPDATE id của Admin
  IF TG_OP = 'UPDATE' THEN
    IF OLD.id = 1 AND NEW.id <> OLD.id THEN
      RAISE EXCEPTION 'Không được phép thay đổi id của role Admin';
    END IF;
  END IF;

  -- Chặn DELETE role Admin
  IF TG_OP = 'DELETE' THEN
    IF OLD.id = 1 THEN
      RAISE EXCEPTION 'Không được phép xóa role Admin';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Gắn trigger vào bảng Role
CREATE TRIGGER trg_prevent_admin_role_id_change
BEFORE UPDATE OR DELETE ON "Role"
FOR EACH ROW
EXECUTE FUNCTION prevent_admin_role_id_change();
