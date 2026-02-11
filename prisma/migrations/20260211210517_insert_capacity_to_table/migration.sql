DO $$
BEGIN
    -- 1. Thêm column nếu chưa tồn tại
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'Table'
          AND column_name = 'capacity'
    ) THEN
        ALTER TABLE "Table"
        ADD COLUMN capacity INTEGER;
    END IF;

    -- 2. Nếu bảng có dữ liệu thì backfill
    IF EXISTS (SELECT 1 FROM "Table" LIMIT 1) THEN
        UPDATE "Table"
        SET capacity = FLOOR(RANDOM() * 6 + 1)
        WHERE capacity IS NULL;
    END IF;

    -- 3. Set NOT NULL nếu chưa set
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'Table'
          AND column_name = 'capacity'
          AND is_nullable = 'YES'
    ) THEN
        ALTER TABLE "Table"
        ALTER COLUMN capacity SET NOT NULL;
    END IF;
END $$;
