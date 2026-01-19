ALTER TABLE "User"
  ALTER COLUMN "createdAt" TYPE timestamptz USING "createdAt" AT TIME ZONE 'Asia/Ho_Chi_Minh',
  ALTER COLUMN "updatedAt" TYPE timestamptz USING "updatedAt" AT TIME ZONE 'Asia/Ho_Chi_Minh',
  ALTER COLUMN "passwordChangedAt" TYPE timestamptz USING "passwordChangedAt" AT TIME ZONE 'Asia/Ho_Chi_Minh';
ALTER TABLE "RefreshToken"
  ALTER COLUMN "issuedAt" TYPE timestamptz USING "issuedAt" AT TIME ZONE 'Asia/Ho_Chi_Minh',
  ALTER COLUMN "expiresAt" TYPE timestamptz USING "expiresAt" AT TIME ZONE 'Asia/Ho_Chi_Minh',
  ALTER COLUMN "createdAt" TYPE timestamptz USING "createdAt" AT TIME ZONE 'Asia/Ho_Chi_Minh';
