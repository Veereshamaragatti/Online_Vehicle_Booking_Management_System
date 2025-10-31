-- Create minimal users for the app (development only)
-- Run this as a privileged user (root) in MySQL Workbench or with the mysql client.

CREATE USER IF NOT EXISTS 'client'@'localhost' IDENTIFIED BY 'client';
GRANT SELECT, INSERT, UPDATE, DELETE, EXECUTE ON ovbms.* TO 'client'@'localhost';

CREATE USER IF NOT EXISTS 'admin'@'localhost' IDENTIFIED BY 'admin';
GRANT SELECT, INSERT, UPDATE, DELETE, EXECUTE ON ovbms.* TO 'admin'@'localhost';

-- Extra privileges needed for stored routines / events
GRANT CREATE ROUTINE, ALTER ROUTINE, CREATE, EVENT ON ovbms.* TO 'admin'@'localhost';

FLUSH PRIVILEGES;

-- Enable the event scheduler so scheduled events run (optional)
SET GLOBAL event_scheduler = ON;
