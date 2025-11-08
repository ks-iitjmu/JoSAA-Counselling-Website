-- MySQL dump 10.13  Distrib 8.0.43, for Linux (x86_64)
--
-- Host: localhost    Database: DBMS_TermProject
-- ------------------------------------------------------
-- Server version	8.0.43-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Allocation`
--

DROP TABLE IF EXISTS `Allocation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Allocation` (
  `AllocationID` int NOT NULL AUTO_INCREMENT,
  `CandidateID` int NOT NULL,
  `RoundID` int NOT NULL,
  `AllocatedInstituteCode` varchar(20) DEFAULT NULL,
  `AllocatedProgramCode` varchar(20) DEFAULT NULL,
  `Action` varchar(100) DEFAULT NULL,
  `Fee_Payment_Status` varchar(50) DEFAULT 'Pending',
  `Allocation_Timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`AllocationID`),
  KEY `CandidateID` (`CandidateID`),
  KEY `RoundID` (`RoundID`),
  KEY `AllocatedInstituteCode` (`AllocatedInstituteCode`,`AllocatedProgramCode`),
  CONSTRAINT `Allocation_ibfk_1` FOREIGN KEY (`CandidateID`) REFERENCES `Candidate` (`CandidateID`),
  CONSTRAINT `Allocation_ibfk_2` FOREIGN KEY (`RoundID`) REFERENCES `Counselling_Round` (`RoundID`),
  CONSTRAINT `Allocation_ibfk_3` FOREIGN KEY (`AllocatedInstituteCode`, `AllocatedProgramCode`) REFERENCES `Institute_Program` (`InstituteCode`, `ProgramCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Allocation`
--

LOCK TABLES `Allocation` WRITE;
/*!40000 ALTER TABLE `Allocation` DISABLE KEYS */;
/*!40000 ALTER TABLE `Allocation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Candidate`
--

DROP TABLE IF EXISTS `Candidate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Candidate` (
  `CandidateID` int NOT NULL,
  `Name` varchar(255) DEFAULT NULL,
  `DateOfBirth` date DEFAULT NULL,
  `Gender` varchar(50) DEFAULT NULL,
  `MobileNumber` varchar(15) DEFAULT NULL,
  `EmailAddress` varchar(255) DEFAULT NULL,
  `JEE_Mains_Application_Number` varchar(50) DEFAULT NULL,
  `JEE_Advanced_Application_Number` varchar(50) DEFAULT NULL,
  `StateOfEligibility` varchar(100) DEFAULT NULL,
  `JEE_Mains_AIR` int DEFAULT NULL,
  `JEE_Mains_Category_Rank` int DEFAULT NULL,
  `JEE_Advanced_Qualifying_status` varchar(50) DEFAULT NULL,
  `Category` varchar(50) DEFAULT NULL,
  `PwD_status` varchar(50) DEFAULT NULL,
  `PwD_Category` varchar(50) DEFAULT NULL,
  `DS_Status` varchar(50) DEFAULT NULL,
  `Twelfth_Aggregate_Percentage` decimal(5,2) DEFAULT NULL,
  `Twelfth_Top_20_Percentile_Status` varchar(50) DEFAULT NULL,
  `Document_Upload_Status` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`CandidateID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Candidate`
--

LOCK TABLES `Candidate` WRITE;
/*!40000 ALTER TABLE `Candidate` DISABLE KEYS */;
/*!40000 ALTER TABLE `Candidate` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Choice_List`
--

DROP TABLE IF EXISTS `Choice_List`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Choice_List` (
  `ChoiceID` int NOT NULL AUTO_INCREMENT,
  `CandidateID` int NOT NULL,
  `ChoiceNumber` int NOT NULL,
  `InstituteCode` varchar(20) NOT NULL,
  `ProgramCode` varchar(20) NOT NULL,
  `Lock_Status` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`ChoiceID`),
  UNIQUE KEY `CandidateID` (`CandidateID`,`ChoiceNumber`),
  KEY `InstituteCode` (`InstituteCode`,`ProgramCode`),
  CONSTRAINT `Choice_List_ibfk_1` FOREIGN KEY (`CandidateID`) REFERENCES `Candidate` (`CandidateID`),
  CONSTRAINT `Choice_List_ibfk_2` FOREIGN KEY (`InstituteCode`, `ProgramCode`) REFERENCES `Institute_Program` (`InstituteCode`, `ProgramCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Choice_List`
--

LOCK TABLES `Choice_List` WRITE;
/*!40000 ALTER TABLE `Choice_List` DISABLE KEYS */;
/*!40000 ALTER TABLE `Choice_List` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Counselling_Round`
--

DROP TABLE IF EXISTS `Counselling_Round`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Counselling_Round` (
  `RoundID` int NOT NULL,
  `StartDate` date NOT NULL,
  `EndDate` date NOT NULL,
  PRIMARY KEY (`RoundID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Counselling_Round`
--

LOCK TABLES `Counselling_Round` WRITE;
/*!40000 ALTER TABLE `Counselling_Round` DISABLE KEYS */;
/*!40000 ALTER TABLE `Counselling_Round` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Institute`
--

DROP TABLE IF EXISTS `Institute`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Institute` (
  `InstituteCode` varchar(20) NOT NULL,
  `InstituteName` varchar(255) DEFAULT NULL,
  `InstituteType` varchar(100) DEFAULT NULL,
  `MailingAddress` text,
  `Phone` varchar(20) DEFAULT NULL,
  `Website` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`InstituteCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Institute`
--

LOCK TABLES `Institute` WRITE;
/*!40000 ALTER TABLE `Institute` DISABLE KEYS */;
/*!40000 ALTER TABLE `Institute` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Institute_Program`
--

DROP TABLE IF EXISTS `Institute_Program`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Institute_Program` (
  `InstituteCode` varchar(20) NOT NULL,
  `ProgramCode` varchar(20) NOT NULL,
  PRIMARY KEY (`InstituteCode`,`ProgramCode`),
  KEY `ProgramCode` (`ProgramCode`),
  CONSTRAINT `Institute_Program_ibfk_1` FOREIGN KEY (`InstituteCode`) REFERENCES `Institute` (`InstituteCode`),
  CONSTRAINT `Institute_Program_ibfk_2` FOREIGN KEY (`ProgramCode`) REFERENCES `Program` (`ProgramCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Institute_Program`
--

LOCK TABLES `Institute_Program` WRITE;
/*!40000 ALTER TABLE `Institute_Program` DISABLE KEYS */;
/*!40000 ALTER TABLE `Institute_Program` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Opening_Closing_Ranks`
--

DROP TABLE IF EXISTS `Opening_Closing_Ranks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Opening_Closing_Ranks` (
  `OCR_ID` int NOT NULL AUTO_INCREMENT,
  `RoundID` int NOT NULL,
  `InstituteCode` varchar(20) NOT NULL,
  `ProgramCode` varchar(20) NOT NULL,
  `SeatPool` varchar(50) NOT NULL,
  `Quota` varchar(50) NOT NULL,
  `Category` varchar(50) NOT NULL,
  `OpeningRank` int DEFAULT NULL,
  `ClosingRank` int DEFAULT NULL,
  PRIMARY KEY (`OCR_ID`),
  KEY `RoundID` (`RoundID`),
  KEY `InstituteCode` (`InstituteCode`,`ProgramCode`),
  CONSTRAINT `Opening_Closing_Ranks_ibfk_1` FOREIGN KEY (`RoundID`) REFERENCES `Counselling_Round` (`RoundID`),
  CONSTRAINT `Opening_Closing_Ranks_ibfk_2` FOREIGN KEY (`InstituteCode`, `ProgramCode`) REFERENCES `Institute_Program` (`InstituteCode`, `ProgramCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Opening_Closing_Ranks`
--

LOCK TABLES `Opening_Closing_Ranks` WRITE;
/*!40000 ALTER TABLE `Opening_Closing_Ranks` DISABLE KEYS */;
/*!40000 ALTER TABLE `Opening_Closing_Ranks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Program`
--

DROP TABLE IF EXISTS `Program`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Program` (
  `ProgramCode` varchar(20) NOT NULL,
  `ProgramName` varchar(255) DEFAULT NULL,
  `Duration_years` int DEFAULT NULL,
  `Degree_Type` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`ProgramCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Program`
--

LOCK TABLES `Program` WRITE;
/*!40000 ALTER TABLE `Program` DISABLE KEYS */;
/*!40000 ALTER TABLE `Program` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Seat_Matrix`
--

DROP TABLE IF EXISTS `Seat_Matrix`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Seat_Matrix` (
  `SeatMatrixID` int NOT NULL AUTO_INCREMENT,
  `InstituteCode` varchar(20) NOT NULL,
  `ProgramCode` varchar(20) NOT NULL,
  `SeatPool` varchar(50) NOT NULL,
  `Quota` varchar(50) NOT NULL,
  `Category` varchar(50) NOT NULL,
  `TotalSeats` int DEFAULT NULL,
  PRIMARY KEY (`SeatMatrixID`),
  UNIQUE KEY `InstituteCode` (`InstituteCode`,`ProgramCode`,`SeatPool`,`Quota`,`Category`),
  CONSTRAINT `Seat_Matrix_ibfk_1` FOREIGN KEY (`InstituteCode`, `ProgramCode`) REFERENCES `Institute_Program` (`InstituteCode`, `ProgramCode`),
  CONSTRAINT `Seat_Matrix_chk_1` CHECK ((`TotalSeats` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Seat_Matrix`
--

LOCK TABLES `Seat_Matrix` WRITE;
/*!40000 ALTER TABLE `Seat_Matrix` DISABLE KEYS */;
/*!40000 ALTER TABLE `Seat_Matrix` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-03 17:54:02
