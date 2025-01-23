-- CreateTable
CREATE TABLE "RecordUserPointBalance" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lastStatePointBalance" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecordUserPointBalance_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RecordUserPointBalance" ADD CONSTRAINT "RecordUserPointBalance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- add trigger to track updated point balance
CREATE OR REPLACE FUNCTION record_point_balance_fn()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO "RecordUserPointBalance" ("userId", "lastStatePointBalance")
    VALUES (NEW."id", OLD."pointsBalance");
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER record_point_balance
BEFORE UPDATE ON "User"
FOR EACH ROW EXECUTE FUNCTION record_point_balance_fn();