-- This is an empty migration.

-- constraint on review.rating of max 5
ALTER TABLE "Review"
ADD CONSTRAINT check_rating_max_value
CHECK ("rating" >= 0 AND "rating" <= 5);