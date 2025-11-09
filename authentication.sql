-- Authentication System for JOSAA DBMS Project
-- This file creates the Users table and related authentication structures

USE jossaDATABASE;

-- Drop existing Users table if it exists
DROP TABLE IF EXISTS `Users`;

-- Create Users table with role-based authentication
CREATE TABLE `Users` (
  `UserID` int NOT NULL AUTO_INCREMENT,
  `Username` varchar(255) NOT NULL,
  `Password` varchar(255) NOT NULL,  -- Store hashed passwords
  `Role` ENUM('Student', 'Institute', 'Administrator') NOT NULL,
  `Email` varchar(255) NOT NULL,
  `IsActive` tinyint(1) DEFAULT '1',
  `CreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `LastLogin` timestamp NULL DEFAULT NULL,
  
  -- Reference IDs based on role
  `CandidateID` int DEFAULT NULL,  -- For students
  `InstituteCode` varchar(20) DEFAULT NULL,  -- For institutes
  
  PRIMARY KEY (`UserID`),
  UNIQUE KEY `Username` (`Username`),
  UNIQUE KEY `Email` (`Email`),
  UNIQUE KEY `CandidateID` (`CandidateID`),
  UNIQUE KEY `InstituteCode` (`InstituteCode`),
  
  -- Foreign key constraints
  CONSTRAINT `Users_ibfk_1` FOREIGN KEY (`CandidateID`) REFERENCES `Candidate` (`CandidateID`) ON DELETE CASCADE,
  CONSTRAINT `Users_ibfk_2` FOREIGN KEY (`InstituteCode`) REFERENCES `Institute` (`InstituteCode`) ON DELETE CASCADE,
  
  -- Check constraints to ensure proper role-entity mapping
  CONSTRAINT `Users_chk_1` CHECK (
    (Role = 'Student' AND CandidateID IS NOT NULL AND InstituteCode IS NULL) OR
    (Role = 'Institute' AND InstituteCode IS NOT NULL AND CandidateID IS NULL) OR
    (Role = 'Administrator' AND CandidateID IS NULL AND InstituteCode IS NULL)
  )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create index for faster login queries
CREATE INDEX idx_username_password ON Users(Username, Password);
CREATE INDEX idx_email ON Users(Email);
CREATE INDEX idx_role ON Users(Role);

-- Insert a default administrator account (password: admin123 - should be hashed in production)
-- Note: In production, use bcrypt to hash passwords. This is just for initial setup.
INSERT INTO `Users` (`Username`, `Password`, `Role`, `Email`, `CandidateID`, `InstituteCode`) 
VALUES ('admin', 'admin123', 'Administrator', 'admin@josaa.nic.in', NULL, NULL);

-- Add password field to Candidate table for additional security (optional)
ALTER TABLE `Candidate` 
ADD COLUMN `Password_Hash` varchar(255) DEFAULT NULL AFTER `Document_Upload_Status`;

-- Add password field to Institute table for additional security (optional)
ALTER TABLE `Institute` 
ADD COLUMN `Password_Hash` varchar(255) DEFAULT NULL AFTER `Website`;

-- Create a view for active users with their associated details
CREATE OR REPLACE VIEW `Active_Users_View` AS
SELECT 
    u.UserID,
    u.Username,
    u.Role,
    u.Email,
    u.IsActive,
    u.LastLogin,
    c.Name AS StudentName,
    c.EmailAddress AS StudentEmail,
    c.MobileNumber AS StudentMobile,
    i.InstituteName,
    i.Phone AS InstitutePhone,
    i.Website AS InstituteWebsite
FROM Users u
LEFT JOIN Candidate c ON u.CandidateID = c.CandidateID
LEFT JOIN Institute i ON u.InstituteCode = i.InstituteCode
WHERE u.IsActive = 1;

-- Create audit table for login attempts
DROP TABLE IF EXISTS `Login_Attempts`;
CREATE TABLE `Login_Attempts` (
  `AttemptID` int NOT NULL AUTO_INCREMENT,
  `Username` varchar(255) NOT NULL,
  `IPAddress` varchar(50) DEFAULT NULL,
  `AttemptTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `Success` tinyint(1) DEFAULT '0',
  `FailureReason` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`AttemptID`),
  KEY `idx_username_time` (`Username`, `AttemptTime`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create stored procedure for user login
DELIMITER $$

DROP PROCEDURE IF EXISTS `AuthenticateUser`$$
CREATE PROCEDURE `AuthenticateUser`(
    IN p_username VARCHAR(255),
    IN p_password VARCHAR(255)
)
BEGIN
    DECLARE v_user_id INT;
    DECLARE v_role VARCHAR(50);
    
    -- Check if user exists and password matches
    SELECT UserID, Role INTO v_user_id, v_role
    FROM Users
    WHERE (Username = p_username OR Email = p_username) 
      AND Password = p_password 
      AND IsActive = 1;
    
    IF v_user_id IS NOT NULL THEN
        -- Update last login time
        UPDATE Users SET LastLogin = CURRENT_TIMESTAMP WHERE UserID = v_user_id;
        
        -- Return user details
        SELECT 
            u.UserID,
            u.Username,
            u.Role,
            u.Email,
            u.CandidateID,
            u.InstituteCode,
            c.Name AS StudentName,
            i.InstituteName
        FROM Users u
        LEFT JOIN Candidate c ON u.CandidateID = c.CandidateID
        LEFT JOIN Institute i ON u.InstituteCode = i.InstituteCode
        WHERE u.UserID = v_user_id;
    ELSE
        -- Return empty result if authentication fails
        SELECT NULL AS UserID;
    END IF;
END$$

DELIMITER ;

-- Grant necessary privileges (adjust as needed for your setup)
-- GRANT SELECT, INSERT, UPDATE ON DBMS_TermProject.* TO 'your_app_user'@'localhost';
