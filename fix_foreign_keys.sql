-- Fix Foreign Key Constraints Script
-- This script adds proper CASCADE behavior to foreign key constraints
-- to prevent anomalies during delete and update operations

USE jossaDATABASE;

-- Disable foreign key checks temporarily
SET FOREIGN_KEY_CHECKS = 0;

-- Fix Allocation table foreign key constraints
ALTER TABLE `Allocation` DROP FOREIGN KEY `Allocation_ibfk_1`;
ALTER TABLE `Allocation` DROP FOREIGN KEY `Allocation_ibfk_2`;
ALTER TABLE `Allocation` DROP FOREIGN KEY `Allocation_ibfk_3`;

ALTER TABLE `Allocation` 
ADD CONSTRAINT `Allocation_ibfk_1` FOREIGN KEY (`CandidateID`) REFERENCES `Candidate` (`CandidateID`) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT `Allocation_ibfk_2` FOREIGN KEY (`RoundID`) REFERENCES `Counselling_Round` (`RoundID`) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT `Allocation_ibfk_3` FOREIGN KEY (`AllocatedInstituteCode`, `AllocatedProgramCode`) REFERENCES `Institute_Program` (`InstituteCode`, `ProgramCode`) ON DELETE SET NULL ON UPDATE CASCADE;

-- Fix Choice_List table foreign key constraints
ALTER TABLE `Choice_List` DROP FOREIGN KEY `Choice_List_ibfk_1`;
ALTER TABLE `Choice_List` DROP FOREIGN KEY `Choice_List_ibfk_2`;

ALTER TABLE `Choice_List`
ADD CONSTRAINT `Choice_List_ibfk_1` FOREIGN KEY (`CandidateID`) REFERENCES `Candidate` (`CandidateID`) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT `Choice_List_ibfk_2` FOREIGN KEY (`InstituteCode`, `ProgramCode`) REFERENCES `Institute_Program` (`InstituteCode`, `ProgramCode`) ON DELETE CASCADE ON UPDATE CASCADE;

-- Fix Institute_Program table foreign key constraints
ALTER TABLE `Institute_Program` DROP FOREIGN KEY `Institute_Program_ibfk_1`;
ALTER TABLE `Institute_Program` DROP FOREIGN KEY `Institute_Program_ibfk_2`;

ALTER TABLE `Institute_Program`
ADD CONSTRAINT `Institute_Program_ibfk_1` FOREIGN KEY (`InstituteCode`) REFERENCES `Institute` (`InstituteCode`) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT `Institute_Program_ibfk_2` FOREIGN KEY (`ProgramCode`) REFERENCES `Program` (`ProgramCode`) ON DELETE CASCADE ON UPDATE CASCADE;

-- Fix Opening_Closing_Ranks table foreign key constraints
ALTER TABLE `Opening_Closing_Ranks` DROP FOREIGN KEY `Opening_Closing_Ranks_ibfk_1`;
ALTER TABLE `Opening_Closing_Ranks` DROP FOREIGN KEY `Opening_Closing_Ranks_ibfk_2`;

ALTER TABLE `Opening_Closing_Ranks`
ADD CONSTRAINT `Opening_Closing_Ranks_ibfk_1` FOREIGN KEY (`RoundID`) REFERENCES `Counselling_Round` (`RoundID`) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT `Opening_Closing_Ranks_ibfk_2` FOREIGN KEY (`InstituteCode`, `ProgramCode`) REFERENCES `Institute_Program` (`InstituteCode`, `ProgramCode`) ON DELETE CASCADE ON UPDATE CASCADE;

-- Fix Seat_Matrix table foreign key constraints
ALTER TABLE `Seat_Matrix` DROP FOREIGN KEY `Seat_Matrix_ibfk_1`;

ALTER TABLE `Seat_Matrix`
ADD CONSTRAINT `Seat_Matrix_ibfk_1` FOREIGN KEY (`InstituteCode`, `ProgramCode`) REFERENCES `Institute_Program` (`InstituteCode`, `ProgramCode`) ON DELETE CASCADE ON UPDATE CASCADE;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Verify the changes
SHOW CREATE TABLE Allocation;
SHOW CREATE TABLE Choice_List;
SHOW CREATE TABLE Institute_Program;
SHOW CREATE TABLE Opening_Closing_Ranks;
SHOW CREATE TABLE Seat_Matrix;

SELECT 'Foreign key constraints updated successfully!' as Status;