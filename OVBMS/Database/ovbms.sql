CREATE DATABASE  IF NOT EXISTS `ovbms` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `ovbms`;
-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: ovbms
-- ------------------------------------------------------
-- Server version	8.0.37

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `booking_requests`
--

DROP TABLE IF EXISTS `booking_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `booking_requests` (
  `request_id` varchar(255) NOT NULL,
  `request_date` datetime NOT NULL,
  `from_date` date NOT NULL,
  `to_date` date NOT NULL,
  `request_status` varchar(15) NOT NULL DEFAULT 'Pending',
  `customer_id` varchar(45) NOT NULL,
  `vehicle_id` varchar(10) NOT NULL,
  `manager_id` varchar(45) DEFAULT NULL,
  `action_type` varchar(45) DEFAULT NULL,
  `action_date` datetime DEFAULT NULL,
  PRIMARY KEY (`request_id`),
  KEY `fk_manager_id_idx` (`manager_id`),
  KEY `fk_br_manager_id_idx` (`manager_id`),
  KEY `fk_customer_id_idx` (`customer_id`),
  KEY `fk_vehicle_id_idx` (`vehicle_id`),
  CONSTRAINT `fk_br_manager_id` FOREIGN KEY (`manager_id`) REFERENCES `manager` (`email`) ON UPDATE CASCADE,
  CONSTRAINT `fk_customer_id` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`email`) ON UPDATE CASCADE,
  CONSTRAINT `fk_vehicle_id` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`license_no`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking_requests`
--

LOCK TABLES `booking_requests` WRITE;
/*!40000 ALTER TABLE `booking_requests` DISABLE KEYS */;
INSERT INTO `booking_requests` VALUES ('03a7e591-a65b-11ef-a411-b44506948d64','2024-11-19 00:00:00','2024-11-20','2024-11-21','Rejected','user@gmail.com','KA22EF7348','admin@gmail.com','Reject','2024-11-19 00:00:00'),('12013110-acbc-11ef-b89b-b44506948d64','2024-11-27 00:00:00','2024-11-28','2024-11-29','Approved','user3@gmail.com','DL7TC01873','admin@gmail.com','Approve','2024-11-27 00:00:00'),('127b808c-a63c-11ef-a411-b44506948d64','2024-11-19 00:00:00','2024-11-19','2024-11-19','Completed','user@gmail.com','MF412MF412','admin@gmail.com','Approve','2024-11-19 00:00:00'),('27b53886-a63c-11ef-a411-b44506948d64','2024-11-19 00:00:00','2024-11-19','2024-11-19','Rejected','user2@gmail.com','MF412MF412','admin@gmail.com','Reject','2024-11-19 00:00:00'),('377f7cc6-acbc-11ef-b89b-b44506948d64','2024-11-27 00:00:00','2024-11-29','2024-11-30','Rejected','user@gmail.com','DL9TCC1369','admin@gmail.com','Reject','2024-11-27 00:00:00'),('67acae30-a6f4-11ef-a411-b44506948d64','2024-11-20 00:00:00','2024-11-21','2024-11-22','Rejected','user@gmail.com','DL9TCC1396','admin@gmail.com','Reject','2024-11-25 00:00:00'),('6e544a2c-a65e-11ef-a411-b44506948d64','2024-11-19 00:00:00','2024-11-20','2024-11-21','Completed','user@gmail.com','DL9TCC1369','admin@gmail.com','Approve','2024-11-19 00:00:00'),('80ac4895-a63a-11ef-a411-b44506948d64','2024-11-19 00:00:00','2024-11-19','2024-11-19','Rejected','user@gmail.com','MF1223VF34','admin@gmail.com','Reject','2024-11-19 00:00:00'),('85e8f85d-a643-11ef-a411-b44506948d64','2024-11-19 00:00:00','2024-11-19','2024-11-20','Completed','user2@gmail.com','MF1223VF34','admin@gmail.com','Approve','2024-11-19 00:00:00'),('8a5055b5-a63a-11ef-a411-b44506948d64','2024-11-19 00:00:00','2024-11-19','2024-11-19','Rejected','user@gmail.com','MF412MF412','admin@gmail.com','Reject','2024-11-19 00:00:00'),('add803bf-ab30-11ef-a411-b44506948d64','2024-11-25 00:00:00','2024-11-26','2024-11-27','Rejected','user@gmail.com','DL9TCC1369','admin@gmail.com','Reject','2024-11-25 00:00:00'),('ba0871d1-a64b-11ef-a411-b44506948d64','2024-11-19 00:00:00','2024-11-19','2024-11-20','Rejected','user2@gmail.com','DL9TCC1369','admin@gmail.com','Reject','2024-11-19 00:00:00'),('c9da1da0-a534-11ef-a8a4-b44506948d64','2024-11-18 00:00:00','2024-11-18','2024-11-19','Completed','user@gmail.com','MF412MF','admin@gmail.com','Approve','2024-11-18 00:00:00'),('e6568d9d-a309-11ef-a8a4-b44506948d64','2024-11-15 00:00:00','2024-11-17','2024-11-18','Rejected','user@gmail.com','DL9TCC1369','admin@gmail.com','Reject','2024-11-15 00:00:00'),('e728937a-a669-11ef-a411-b44506948d64','2024-11-19 00:00:00','2024-11-21','2024-11-22','Rejected','user@gmail.com','KA22EF7348','admin@gmail.com','Reject','2024-11-19 00:00:00'),('e7f8db69-a534-11ef-a8a4-b44506948d64','2024-11-18 00:00:00','2024-11-19','2024-11-22','Rejected','user@gmail.com','MF1223VF34','admin@gmail.com','Reject','2024-11-18 00:00:00'),('fa54d88c-a363-11ef-a8a4-b44506948d64','2024-11-15 00:00:00','2024-11-18','2024-11-18','Completed','user@gmail.com','DL9TCC1369','admin@gmail.com','Approve','2024-11-15 00:00:00');
/*!40000 ALTER TABLE `booking_requests` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `booking_requests_AFTER_UPDATE` AFTER UPDATE ON `booking_requests` FOR EACH ROW BEGIN
declare other_bookings int;
if new.request_status = 'Rejected' and old.request_status = 'Pending' then
	update vehicles set availability = 'Available' where license_no = new.vehicle_id;
END if;

if new.request_status = 'Approved' and old.request_status = 'Pending' then
	update vehicles set availability = 'Unavailable' where license_no = new.vehicle_id;
END if;

END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `customer`
--

DROP TABLE IF EXISTS `customer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer` (
  `email` varchar(45) NOT NULL,
  `name` varchar(45) NOT NULL,
  `password` varchar(255) NOT NULL,
  `license_id` varchar(16) NOT NULL,
  `mobile_no` varchar(10) NOT NULL,
  `dob` date NOT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer`
--

LOCK TABLES `customer` WRITE;
/*!40000 ALTER TABLE `customer` DISABLE KEYS */;
INSERT INTO `customer` VALUES ('user@gmail.com','User','$2a$10$r1RUIFDnQZ4yFKrkPs5glepf/itAsIfCuirP325S.lgIqcA/Z/j0e','DL-1420110012345','9876543210','2004-04-01'),('user2@gmail.com','User2','$2a$10$p3zZnsiKqKIdLQOk2RXrWOgfx18cq9PLIGk9yJlhGtLwl.p1Gm5zW','DL-2420110012345','9276543210','2004-02-15'),('user3@gmail.com','User3','$2a$10$aDhirlcY3P0DCvEJjpph0.gkqX5/V714NuTqRn21StOpcddSgko8e','DL-1420110012346','9276543211','2000-02-17');
/*!40000 ALTER TABLE `customer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `manager`
--

DROP TABLE IF EXISTS `manager`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `manager` (
  `email` varchar(45) NOT NULL,
  `name` varchar(45) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `manager`
--

LOCK TABLES `manager` WRITE;
/*!40000 ALTER TABLE `manager` DISABLE KEYS */;
INSERT INTO `manager` VALUES ('admin@gmail.com','Admin','$2a$10$JZHSUXa2KJ52oNB.8QaeXucRZ0n5OpGCLFXH0Ort8NkAh5a2BDTxi'),('admin2@gmail.com','Admin 2','$2a$10$8uDDK7B87GcQDlTm1c7U8enTAZf1KlMu7UHOCn8yLU8LLVAbxwZFe'),('manager@gmail.com','Manager','$2a$10$AhkVm6h3LCwiHr936ONwy.HOsV./g.f/3cdrCjfhAWW9Am4nM.bJy');
/*!40000 ALTER TABLE `manager` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vehicles`
--

DROP TABLE IF EXISTS `vehicles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vehicles` (
  `license_no` varchar(10) NOT NULL,
  `vehicle_name` varchar(45) NOT NULL,
  `model_year` year NOT NULL,
  `price_per_day` decimal(10,0) NOT NULL,
  `seating_capacity` int NOT NULL,
  `fuel_type` varchar(10) NOT NULL,
  `vehicle_image` longtext,
  `vehicle_overview` varchar(225) DEFAULT NULL,
  `manager_id` varchar(45) NOT NULL,
  `availability` varchar(45) NOT NULL DEFAULT 'Available',
  PRIMARY KEY (`license_no`),
  KEY `fk_manager_id_idx` (`manager_id`),
  CONSTRAINT `fk_manager_id` FOREIGN KEY (`manager_id`) REFERENCES `manager` (`email`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehicles`
--

LOCK TABLES `vehicles` WRITE;
/*!40000 ALTER TABLE `vehicles` DISABLE KEYS */;
INSERT INTO `vehicles` VALUES ('DL7TC01873','Hyundai Nexon',2020,6000,7,'Petrol','https://www.hyundai.com/content/dam/hyundai/in/en/data/find-a-car/Verna/Highlights/vernapoolside1.jpg','Good','admin@gmail.com','Unavailable'),('DL9TCC1369','Tata Nano',2020,1500,7,'Diesel','https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Tata_-_Nano_-_Kolkata_2011-09-15_5184.JPG/420px-Tata_-_Nano_-_Kolkata_2011-09-15_5184.JPG','Very Good Car','admin@gmail.com','Available'),('DL9TCC1396','Hyundai EXTER Knight',2020,8000,8,'Petrol','https://www.hyundai.com/content/dam/hyundai/in/en/data/find-a-car/Exter/Highlights/smallimageexter2_5.jpg','Good Car','admin@gmail.com','Available'),('KA22EF7348','Hyundai Alcazar',2020,5500,7,'Diesel','https://www.hyundai.com/content/dam/hyundai/in/en/data/find-a-car/Alcazar/Gallery/alcazargallerybig1.jpg','Good Car','manager@gmail.com','Available'),('MF1223VF34','Hyundai IONIQ 5',2024,5000,5,'Electric','https://ioniq5.hyundai.co.in/uploads/attachments/cluqpl0yg4jiktasahp8ats4c-front-image.png','Good Car','manager@gmail.com','Available'),('MF412MF','Hyundai IONIQ 5',2020,4000,5,'Electric','https://ioniq5.hyundai.co.in/uploads/attachments/cluqpl0yg4jiktasahp8ats4c-front-image.png','Good Car','manager@gmail.com','Available'),('MF412MF412','Hyundai IONIQ 5',2022,4500,5,'Electric','https://ioniq5.hyundai.co.in/uploads/attachments/cluqpl0yg4jiktasahp8ats4c-front-image.png','Good Car','admin@gmail.com','Available');
/*!40000 ALTER TABLE `vehicles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'ovbms'
--
/*!50106 SET @save_time_zone= @@TIME_ZONE */ ;
/*!50106 DROP EVENT IF EXISTS `CheckCompletedBookings` */;
DELIMITER ;;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;;
/*!50003 SET character_set_client  = utf8mb4 */ ;;
/*!50003 SET character_set_results = utf8mb4 */ ;;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;;
/*!50003 SET @saved_time_zone      = @@time_zone */ ;;
/*!50003 SET time_zone             = 'SYSTEM' */ ;;
/*!50106 CREATE*/ /*!50117 DEFINER=`root`@`localhost`*/ /*!50106 EVENT `CheckCompletedBookings` ON SCHEDULE EVERY 1 DAY STARTS '2024-11-19 11:42:39' ON COMPLETION NOT PRESERVE ENABLE DO BEGIN

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

END */ ;;
/*!50003 SET time_zone             = @saved_time_zone */ ;;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;;
/*!50003 SET character_set_client  = @saved_cs_client */ ;;
/*!50003 SET character_set_results = @saved_cs_results */ ;;
/*!50003 SET collation_connection  = @saved_col_connection */ ;;
DELIMITER ;
/*!50106 SET TIME_ZONE= @save_time_zone */ ;

--
-- Dumping routines for database 'ovbms'
--
/*!50003 DROP PROCEDURE IF EXISTS `BookVehicle` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `BookVehicle`(in customer_email varchar(45), in vehicle_license_no varchar(10), in from_date date, in to_date date)
BEGIN
insert into booking_requests(request_id, request_date, from_date, to_date, customer_id, vehicle_id) values(UUID(), CURDATE(), from_date, to_date, customer_email, vehicle_license_no);
update vehicles set availability = 'Waiting' where license_no = vehicle_license_no;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `HandleBookingRequest` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `HandleBookingRequest`( in requestId varchar(255), in action varchar(15), in managerId varchar(45))
BEGIN
if action = 'Approve' then 
update booking_requests set request_status = 'Approved', action_type = 'Approve', action_date = curdate(), manager_id = managerId  where request_id = requestId;
elseif action = 'Reject' then 
update booking_requests set request_status = 'Rejected', action_type = 'Reject', action_date = curdate(), manager_id = managerId where request_id = requestId;
END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-28 15:16:12
