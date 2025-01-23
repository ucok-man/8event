-- This is an empty migration.

-- trigger constraint on user with role "ORGANIZER" point balance always 0 and should not use referal code
CREATE OR REPLACE FUNCTION enforce_organizer_constraints()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW."role" = 'ORGANIZER' THEN
    IF NEW."referredById" IS NOT NULL OR NEW."pointsBalance" != 0 THEN
      RAISE EXCEPTION 'For ORGANIZER role, referredById must be NULL and pointsBalance must be 0';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_organizer_constraints
BEFORE INSERT OR UPDATE ON "User"
FOR EACH ROW EXECUTE FUNCTION enforce_organizer_constraints();