-- This is an empty migration.

-- -- constraint on review.rating of max 5
-- ALTER TABLE "Review"
-- ADD CONSTRAINT check_rating_max_value
-- CHECK ("rating" >= 0 AND "rating" <= 5);

-- -- constraint on ticket
-- ALTER TABLE "Ticket"
-- ADD CONSTRAINT check_positive_price CHECK ("price" >= 0);

-- ALTER TABLE "Ticket"
-- ADD CONSTRAINT check_positive_seats CHECK ("seatsAvailable" >= 0);

-- ALTER TABLE "Ticket"
-- ADD CONSTRAINT check_isFree_price
-- CHECK (NOT "isFree" OR "price" = 0);

-- -- trigger constraint on user with role "ORGANIZER" should not use referal code
-- CREATE OR REPLACE FUNCTION enforce_organizer_constraints()
-- RETURNS TRIGGER AS $$
-- BEGIN
--   IF NEW."role" = 'ORGANIZER' THEN
--     IF NEW."referredById" IS NOT NULL THEN
--       RAISE EXCEPTION 'For ORGANIZER role, referredById must be NULL';
--     END IF;
--   END IF;
--   RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;

-- CREATE TRIGGER check_organizer_constraints
-- BEFORE INSERT OR UPDATE ON "User"
-- FOR EACH ROW EXECUTE FUNCTION enforce_organizer_constraints();

-- constraint on PointBalance with specific type
CREATE OR REPLACE FUNCTION restrict_point_balance()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW."type" = 'ADD' THEN
    IF NEW."pointBalance" < 0 THEN
      RAISE EXCEPTION 'For ADD type point balance must be positive';
    END IF;
  END IF;

  IF NEW."type" = 'SUBSTRACT' THEN
    IF NEW."pointBalance" > 0 THEN
      RAISE EXCEPTION 'For SUBSTRACT type point balance must be negative';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_point_balance_value
BEFORE INSERT OR UPDATE ON "PointBalance"
FOR EACH ROW EXECUTE FUNCTION restrict_point_balance();