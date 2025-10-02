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




