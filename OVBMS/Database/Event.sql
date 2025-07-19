delimiter $$

CREATE DEFINER=`root`@`localhost` EVENT `CheckCompletedBookings`
ON SCHEDULE EVERY 1 DAY
STARTS CURRENT_TIMESTAMP
DO
BEGIN

UPDATE vehicles
SET availability = 'Available'
WHERE license_no IN (
	SELECT vehicle_id
	FROM booking_requests
	WHERE request_status = 'Approved'
	AND to_date < CURDATE()
    );

UPDATE booking_requests
SET request_status = 'Completed'
WHERE request_status = 'Approved'
AND to_date < CURDATE();

END $$

delimiter ;

show events;