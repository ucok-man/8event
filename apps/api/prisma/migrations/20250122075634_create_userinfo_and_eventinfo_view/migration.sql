-- This is an empty migration.

-- create user info view
CREATE VIEW UserInfo AS
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


-- create event info view
CREATE OR REPLACE VIEW EventInfo AS
SELECT
    e.id AS eventId,
    COALESCE(SUM(t."seatsAvailable"), 0) AS totalSeat
FROM
    "Event" e
LEFT JOIN
    "Ticket" t ON e."id" = t."eventId"
GROUP BY
    e.id;