const db = require('../config/database');
const bcrypt = require('bcrypt');

class User {
  // Create a new user with role-based registration
  static async create(userData) {
    const { username, password, role, email, candidateID, instituteCode } = userData;
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const query = `
      INSERT INTO Users (Username, Password, Role, Email, CandidateID, InstituteCode)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const [result] = await db.query(query, [
      username,
      hashedPassword,
      role,
      email,
      candidateID || null,
      instituteCode || null
    ]);
    
    return result.insertId;
  }
  
  // Register a student
  static async registerStudent(candidateData, password) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      
      // Insert candidate data
      const candidateQuery = `
        INSERT INTO Candidate (
          CandidateID, Name, DateOfBirth, Gender, MobileNumber, EmailAddress,
          JEE_Mains_Application_Number, JEE_Advanced_Application_Number,
          StateOfEligibility, Category, PwD_status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      await connection.query(candidateQuery, [
        candidateData.candidateID,
        candidateData.name,
        candidateData.dateOfBirth,
        candidateData.gender,
        candidateData.mobileNumber,
        candidateData.email,
        candidateData.jeeMainsAppNumber,
        candidateData.jeeAdvancedAppNumber,
        candidateData.stateOfEligibility,
        candidateData.category,
        candidateData.pwdStatus || 'No'
      ]);
      
      // Create user account
      const hashedPassword = await bcrypt.hash(password, 10);
      const userQuery = `
        INSERT INTO Users (Username, Password, Role, Email, CandidateID)
        VALUES (?, ?, 'Student', ?, ?)
      `;
      
      const [userResult] = await connection.query(userQuery, [
        candidateData.email, // Using email as username
        hashedPassword,
        candidateData.email,
        candidateData.candidateID
      ]);
      
      await connection.commit();
      return { userID: userResult.insertId, candidateID: candidateData.candidateID };
      
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
  
  // Register an institute
  static async registerInstitute(instituteData, password) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      
      // Insert institute data
      const instituteQuery = `
        INSERT INTO Institute (
          InstituteCode, InstituteName, InstituteType, 
          MailingAddress, Phone, Website
        ) VALUES (?, ?, ?, ?, ?, ?)
      `;
      
      await connection.query(instituteQuery, [
        instituteData.instituteCode,
        instituteData.instituteName,
        instituteData.instituteType,
        instituteData.mailingAddress,
        instituteData.phone,
        instituteData.website
      ]);
      
      // Create user account
      const hashedPassword = await bcrypt.hash(password, 10);
      const userQuery = `
        INSERT INTO Users (Username, Password, Role, Email, InstituteCode)
        VALUES (?, ?, 'Institute', ?, ?)
      `;
      
      const [userResult] = await connection.query(userQuery, [
        instituteData.instituteCode, // Using institute code as username
        hashedPassword,
        instituteData.email,
        instituteData.instituteCode
      ]);
      
      await connection.commit();
      return { userID: userResult.insertId, instituteCode: instituteData.instituteCode };
      
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
  
  // Authenticate user with multiple identifier options
  static async authenticate(identifier, password) {
    // identifier can be username, email, candidateID, or instituteCode
    const query = `
      SELECT 
        u.UserID, u.Username, u.Password, u.Role, u.Email,
        u.CandidateID, u.InstituteCode, u.IsActive,
        c.Name AS StudentName, c.EmailAddress AS StudentEmail,
        c.MobileNumber, c.JEE_Mains_AIR,
        i.InstituteName, i.Phone AS InstitutePhone, i.Website
      FROM Users u
      LEFT JOIN Candidate c ON u.CandidateID = c.CandidateID
      LEFT JOIN Institute i ON u.InstituteCode = i.InstituteCode
      WHERE (u.Username = ? OR u.Email = ? OR u.CandidateID = ? OR u.InstituteCode = ?)
        AND u.IsActive = 1
    `;
    
    const [users] = await db.query(query, [identifier, identifier, identifier, identifier]);
    
    if (users.length === 0) {
      return null;
    }
    
    const user = users[0];
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.Password);
    
    if (!isValidPassword) {
      return null;
    }
    
    // Update last login
    await db.query('UPDATE Users SET LastLogin = NOW() WHERE UserID = ?', [user.UserID]);
    
    // Remove password from returned object
    delete user.Password;
    
    return user;
  }
  
  // Get user by ID
  static async findById(userID) {
    const query = `
      SELECT 
        u.UserID, u.Username, u.Role, u.Email, u.IsActive,
        u.CandidateID, u.InstituteCode, u.LastLogin,
        c.Name AS StudentName, c.EmailAddress AS StudentEmail,
        c.MobileNumber, c.Gender, c.Category,
        i.InstituteName, i.InstituteType, i.Phone AS InstitutePhone
      FROM Users u
      LEFT JOIN Candidate c ON u.CandidateID = c.CandidateID
      LEFT JOIN Institute i ON u.InstituteCode = i.InstituteCode
      WHERE u.UserID = ? AND u.IsActive = 1
    `;
    
    const [users] = await db.query(query, [userID]);
    return users.length > 0 ? users[0] : null;
  }
  
  // Check if username/email exists
  static async checkExists(username, email) {
    const query = `
      SELECT UserID FROM Users 
      WHERE Username = ? OR Email = ?
    `;
    
    const [users] = await db.query(query, [username, email]);
    return users.length > 0;
  }
  
  // Check if candidate ID exists
  static async checkCandidateExists(candidateID) {
    const query = `SELECT CandidateID FROM Candidate WHERE CandidateID = ?`;
    const [candidates] = await db.query(query, [candidateID]);
    return candidates.length > 0;
  }
  
  // Check if institute code exists
  static async checkInstituteExists(instituteCode) {
    const query = `SELECT InstituteCode FROM Institute WHERE InstituteCode = ?`;
    const [institutes] = await db.query(query, [instituteCode]);
    return institutes.length > 0;
  }
  
  // Update user profile
  static async updateProfile(userID, updates) {
    const allowedUpdates = ['Email'];
    const updateFields = [];
    const values = [];
    
    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updateFields.push(`${key} = ?`);
        values.push(updates[key]);
      }
    });
    
    if (updateFields.length === 0) {
      return false;
    }
    
    values.push(userID);
    const query = `UPDATE Users SET ${updateFields.join(', ')} WHERE UserID = ?`;
    
    const [result] = await db.query(query, values);
    return result.affectedRows > 0;
  }
  
  // Change password
  static async changePassword(userID, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const query = `UPDATE Users SET Password = ? WHERE UserID = ?`;
    
    const [result] = await db.query(query, [hashedPassword, userID]);
    return result.affectedRows > 0;
  }
  
  // Log login attempt
  static async logLoginAttempt(username, ipAddress, success, failureReason = null) {
    const query = `
      INSERT INTO Login_Attempts (Username, IPAddress, Success, FailureReason)
      VALUES (?, ?, ?, ?)
    `;
    
    await db.query(query, [username, ipAddress, success ? 1 : 0, failureReason]);
  }
}

module.exports = User;
