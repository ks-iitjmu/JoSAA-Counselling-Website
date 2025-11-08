-- Clear existing data and insert sample data
-- This script will delete all existing data and insert fresh sample data

USE jossaDATABASE;

-- Disable foreign key checks
SET FOREIGN_KEY_CHECKS = 0;

-- Clear existing data
DELETE FROM Opening_Closing_Ranks;
DELETE FROM Allocation;
DELETE FROM Seat_Matrix;
DELETE FROM Choice_List;
DELETE FROM Candidate;
DELETE FROM Counselling_Round;
DELETE FROM Institute_Program;
DELETE FROM Program;
DELETE FROM Institute;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Now insert the sample data
-- 1. Data for table `Institute`
INSERT INTO `Institute` (`InstituteCode`, `InstituteName`, `InstituteType`, `MailingAddress`, `Phone`, `Website`) VALUES
('I101', 'Indian Institute of Technology Bombay', 'IIT', 'Powai, Mumbai, Maharashtra 400076', '02225722545', 'https://www.iitb.ac.in'),
('I102', 'Indian Institute of Technology Delhi', 'IIT', 'Hauz Khas, New Delhi, Delhi 110016', '01126597135', 'https://home.iitd.ac.in/'),
('N201', 'National Institute of Technology Tiruchirappalli', 'NIT', 'Tanjore Main Road, NITT Campus, Tiruchirappalli, Tamil Nadu 620015', '04312503000', 'https://www.nitt.edu'),
('N202', 'National Institute of Technology Karnataka', 'NIT', 'NH 66, Srinivasnagar, Surathkal, Mangalore, Karnataka 575025', '08242474000', 'https://www.nitk.ac.in'),
('T301', 'Indian Institute of Information Technology Allahabad', 'IIIT', 'Jhalwa, Prayagraj, Uttar Pradesh 211015', '05322922000', 'https://www.iiita.ac.in');

-- 2. Data for table `Program`
INSERT INTO `Program` (`ProgramCode`, `ProgramName`, `Duration_years`, `Degree_Type`) VALUES
('P10', 'Computer Science and Engineering', 4, 'B.Tech'),
('P11', 'Mechanical Engineering', 4, 'B.Tech'),
('P12', 'Electrical Engineering', 4, 'B.Tech'),
('P13', 'Civil Engineering', 4, 'B.Tech'),
('P20', 'Chemical Engineering', 4, 'B.Tech'),
('P21', 'Electronics and Communication Engineering', 4, 'B.Tech'),
('P30', 'Engineering Physics', 4, 'B.Tech'),
('P40', 'Information Technology', 4, 'B.Tech');

-- 3. Data for table `Institute_Program` (Link table)
INSERT INTO `Institute_Program` (`InstituteCode`, `ProgramCode`) VALUES
('I101', 'P10'),
('I101', 'P11'),
('I101', 'P12'),
('I101', 'P20'),
('I102', 'P10'),
('I102', 'P12'),
('I102', 'P13'),
('I102', 'P30'),
('N201', 'P10'),
('N201', 'P11'),
('N201', 'P13'),
('N201', 'P21'),
('N202', 'P10'),
('N202', 'P11'),
('N202', 'P20'),
('N202', 'P21'),
('T301', 'P10'),
('T301', 'P40');

-- 4. Data for table `Counselling_Round`
INSERT INTO `Counselling_Round` (`RoundID`, `StartDate`, `EndDate`) VALUES
(1, '2024-10-10', '2024-10-13'),
(2, '2024-10-16', '2024-10-18'),
(3, '2024-10-21', '2024-10-23'),
(4, '2024-10-26', '2024-10-28'),
(5, '2024-11-01', '2024-11-03');

-- 5. Data for table `Candidate`
INSERT INTO `Candidate` (`CandidateID`, `Name`, `DateOfBirth`, `Gender`, `MobileNumber`, `EmailAddress`, `JEE_Mains_Application_Number`, `JEE_Advanced_Application_Number`, `StateOfEligibility`, `JEE_Mains_AIR`, `JEE_Mains_Category_Rank`, `JEE_Advanced_Qualifying_status`, `Category`, `PwD_status`, `PwD_Category`, `DS_Status`, `Twelfth_Aggregate_Percentage`, `Twelfth_Top_20_Percentile_Status`, `Document_Upload_Status`) VALUES
(10001, 'Rohan Sharma', '2005-01-15', 'Male', '9876543210', 'rohan@email.com', 'JEM123456', 'JEA1001', 'Maharashtra', 500, 500, 'Qualified', 'GEN', 'No', NULL, 'No', 95.50, 'Yes', 'Verified'),
(10002, 'Priya Gupta', '2004-11-20', 'Female', '9876543211', 'priya@email.com', 'JEM123457', 'JEA1002', 'Uttar Pradesh', 2500, 300, 'Qualified', 'OBC-NCL', 'No', NULL, 'No', 92.00, 'Yes', 'Verified'),
(10003, 'Anil Kumar', '2005-03-10', 'Male', '9876543212', 'anil@email.com', 'JEM123458', 'JEA1003', 'Tamil Nadu', 15000, 200, 'Qualified', 'SC', 'Yes', 'Type-1 (Locomotor disability)', 'Yes', 85.00, 'Yes', 'Verified'),
(10004, 'Sunita Reddy', '2005-07-07', 'Female', '9876543213', 'sunita@email.com', 'JEM123459', NULL, 'Andhra Pradesh', 12000, 12000, 'Not Qualified', 'GEN', 'No', NULL, 'No', 90.00, 'Yes', 'Verified'),
(10005, 'David Lee', '2004-09-01', 'Male', '9876543214', 'david@email.com', 'JEM1D23460', 'JEA1004', 'Delhi', 800, 800, 'Qualified', 'GEN', 'No', NULL, 'No', 94.20, 'Yes', 'Pending');

-- 6. Data for table `Choice_List`
INSERT INTO `Choice_List` (`CandidateID`, `ChoiceNumber`, `InstituteCode`, `ProgramCode`, `Lock_Status`) VALUES
(10001, 1, 'I101', 'P10', 1),
(10001, 2, 'I102', 'P10', 1),
(10001, 3, 'I101', 'P12', 1),
(10001, 4, 'I102', 'P12', 1),
(10002, 1, 'I101', 'P10', 1),
(10002, 2, 'I102', 'P10', 1),
(10002, 3, 'N201', 'P10', 1),
(10002, 4, 'N202', 'P10', 1),
(10002, 5, 'T301', 'P10', 1),
(10003, 1, 'N201', 'P13', 0),
(10003, 2, 'N202', 'P20', 0),
(10003, 3, 'N201', 'P11', 0),
(10004, 1, 'N201', 'P10', 1),
(10004, 2, 'N202', 'P10', 1),
(10004, 3, 'T301', 'P40', 1);

-- 7. Data for table `Seat_Matrix`
INSERT INTO `Seat_Matrix` (`InstituteCode`, `ProgramCode`, `SeatPool`, `Quota`, `Category`, `TotalSeats`) VALUES
('I101', 'P10', 'Gender-Neutral', 'AI', 'GEN', 50),
('I101', 'P10', 'Female-only', 'AI', 'GEN', 12),
('I101', 'P10', 'Gender-Neutral', 'AI', 'OBC-NCL', 30),
('I101', 'P10', 'Female-only', 'AI', 'OBC-NCL', 8),
('I101', 'P10', 'Gender-Neutral', 'AI', 'SC', 15),
('I101', 'P10', 'Gender-Neutral', 'AI', 'ST', 7),
('N201', 'P10', 'Gender-Neutral', 'AI', 'GEN', 25),
('N201', 'P10', 'Gender-Neutral', 'HS', 'GEN', 25),
('N201', 'P10', 'Female-only', 'AI', 'GEN', 6),
('N201', 'P10', 'Female-only', 'HS', 'GEN', 6),
('N201', 'P13', 'Gender-Neutral', 'HS', 'SC', 5),
('N201', 'P13', 'Gender-Neutral', 'HS', 'SC-PwD', 1),
('T301', 'P40', 'Gender-Neutral', 'AI', 'GEN', 40),
('T301', 'P40', 'Gender-Neutral', 'AI', 'EWS', 10);

-- 8. Data for table `Allocation`
INSERT INTO `Allocation` (`CandidateID`, `RoundID`, `AllocatedInstituteCode`, `AllocatedProgramCode`, `Action`, `Fee_Payment_Status`) VALUES
(10001, 1, 'I101', 'P12', 'Allocated', 'Pending'),
(10002, 1, 'N201', 'P10', 'Allocated', 'Pending'),
(10003, 1, 'N201', 'P13', 'Allocated', 'Pending'),
(10004, 1, NULL, NULL, 'Not Allocated', 'N/A'),
(10005, 1, 'I102', 'P10', 'Allocated', 'Paid');

-- 9. Data for table `Opening_Closing_Ranks`
INSERT INTO `Opening_Closing_Ranks` (`RoundID`, `InstituteCode`, `ProgramCode`, `SeatPool`, `Quota`, `Category`, `OpeningRank`, `ClosingRank`) VALUES
(1, 'I101', 'P10', 'Gender-Neutral', 'AI', 'GEN', 1, 60),
(1, 'I101', 'P12', 'Gender-Neutral', 'AI', 'GEN', 150, 480),
(1, 'I102', 'P10', 'Gender-Neutral', 'AI', 'GEN', 25, 105),
(1, 'N201', 'P10', 'Gender-Neutral', 'AI', 'OBC-NCL', 310, 550),
(1, 'N201', 'P10', 'Gender-Neutral', 'HS', 'GEN', 1200, 3500),
(1, 'N201', 'P13', 'Gender-Neutral', 'HS', 'SC-PwD', 15, 15),
(1, 'N201', 'P13', 'Gender-Neutral', 'HS', 'SC', 150, 210),
(1, 'T301', 'P40', 'Gender-Neutral', 'AI', 'GEN', 2800, 4500);

SELECT 'Sample data imported successfully!' AS Status;
