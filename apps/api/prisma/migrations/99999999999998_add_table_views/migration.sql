-- This is an empty migration.

-- create organizer rating view
CREATE VIEW "RecordOrganizerAverageRating" AS
SELECT 
    u.id AS "organizerId",
    COALESCE(ROUND(AVG(r."rating")::numeric, 2), 0.00) AS "averageRating"
FROM 
    "User" u
LEFT JOIN 
    "Event" e ON u.id = e."organizerId"
LEFT JOIN 
    "Review" r ON e.id = r."eventId"
WHERE 
    u.role = 'ORGANIZER'
GROUP BY 
    u.id;


-- create event info view
CREATE OR REPLACE VIEW "RecordEventInfo" AS
SELECT
    e."id" AS "eventId",
    e."views" AS "totalView",
    COALESCE(SUM(ti."initialAmount"), 0)::int AS "totalTicketAmount",
    COALESCE(SUM(ti."amount"), 0)::int AS "totalTicketRemaining",
    COALESCE(SUM(CASE WHEN tr."status" = 'COMPLETED' THEN tr."ticketQuantity" ELSE 0 END), 0) AS "totalTicketSold",
    COALESCE(SUM(tr."priceAfterDiscount"), 0) AS "totalIncome",
    COALESCE(COUNT(tr."id"), 0)::int AS "totalTransaction"
FROM
    "Event" e
LEFT JOIN
    "Ticket" ti ON e."id" = ti."eventId"
LEFT JOIN
    "Transaction" tr ON e."id" = tr."eventId"
GROUP BY
    e.id;

-- create view on active point balance user
CREATE OR REPLACE VIEW "RecordUserPointBalance" AS
SELECT
    pb."userId" AS "userId",
    COALESCE(SUM(pb."pointBalance"), 0)::int AS "pointBalance"
FROM
    "PointBalance" pb
WHERE 
    "endDate" >= CURRENT_TIMESTAMP + INTERVAL '1 DAY' OR
    "endDate" IS NULL
GROUP BY
    pb."userId"

