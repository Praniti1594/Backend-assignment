-- Migration: Add admin assignment fields to tasks table (idempotent, production-safe)

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name='tasks' AND column_name='assigned_by'
    ) THEN
        ALTER TABLE tasks ADD COLUMN assigned_by UUID NULL REFERENCES users(id);
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name='tasks' AND column_name='created_by_admin'
    ) THEN
        ALTER TABLE tasks ADD COLUMN created_by_admin BOOLEAN DEFAULT false;
    END IF;
END$$;

-- Ensure users.role exists and is correct (already present in schema)
