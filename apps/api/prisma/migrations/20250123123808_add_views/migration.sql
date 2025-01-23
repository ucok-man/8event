-- This is an empty migration.

-- create organizer rating view
CREATE VIEW RecordOrganizerAverageRating AS
SELECT 
    u.id AS organizerId,
    COALESCE(ROUND(AVG(r."rating")::numeric, 2), 0.00) AS averageRating
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


-- create event total seat view
CREATE OR REPLACE VIEW RecordEventTotalSeat AS
SELECT
    e.id AS eventId,
    COALESCE(SUM(t."seatsAvailable"), 0) AS totalSeat
FROM
    "Event" e
LEFT JOIN
    "Ticket" t ON e."id" = t."eventId"
GROUP BY
    e.id;

-- create view on active point balance user
CREATE OR REPLACE VIEW RecordUserPointBalance AS
SELECT
    pb."userId" AS userId,
    COALESCE(SUM(pb."pointBalance"), 0) AS pointBalance
FROM
    "PointBalance" pb
WHERE 
    "endDate" >= CURRENT_TIMESTAMP + INTERVAL '1 DAY' OR
    "endDate" IS NULL
GROUP BY
    pb."userId"

