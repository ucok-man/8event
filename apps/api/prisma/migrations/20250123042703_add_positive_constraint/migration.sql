-- This is an empty migration.

-- constraint on review.rating of max 5
ALTER TABLE "Review"
ADD CONSTRAINT check_rating_max_value
CHECK ("rating" >= 0 AND "rating" <= 5);

-- constraint on point balance
ALTER TABLE "User"
ADD CONSTRAINT check_positive_point_balance
CHECK ("pointsBalance" >= 0);

-- constraint on point balance
ALTER TABLE "RecordUserPointBalance"
ADD CONSTRAINT check_positive_last_state_point_balance
CHECK ("lastStatePointBalance" >= 0);

-- constraint on ticket
ALTER TABLE "Ticket"
ADD CONSTRAINT check_positive_price CHECK ("price" >= 0);

ALTER TABLE "Ticket"
ADD CONSTRAINT check_positive_seats CHECK ("seatsAvailable" >= 0);
