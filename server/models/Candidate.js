const pool = require('../config/database');

class Candidate {
  // Get all candidates
  static async getAll() {
    const [rows] = await pool.execute('SELECT * FROM Candidate');
    return rows;
  }

  // Get candidate by ID
  static async getById(candidateId) {
    const [rows] = await pool.execute(
      'SELECT * FROM Candidate WHERE CandidateID = ?',
      [candidateId]
    );
    return rows[0];
  }

  // Create new candidate
  static async create(candidateData) {
    const {
      CandidateID, Name, DateOfBirth, Gender, MobileNumber, EmailAddress,
      JEE_Mains_Application_Number, JEE_Advanced_Application_Number,
      StateOfEligibility, JEE_Mains_AIR, JEE_Mains_Category_Rank,
      JEE_Advanced_Qualifying_status, Category, PwD_status, PwD_Category,
      DS_Status, Twelfth_Aggregate_Percentage, Twelfth_Top_20_Percentile_Status,
      Document_Upload_Status
    } = candidateData;

    const [result] = await pool.execute(
      `INSERT INTO Candidate (
        CandidateID, Name, DateOfBirth, Gender, MobileNumber, EmailAddress,
        JEE_Mains_Application_Number, JEE_Advanced_Application_Number,
        StateOfEligibility, JEE_Mains_AIR, JEE_Mains_Category_Rank,
        JEE_Advanced_Qualifying_status, Category, PwD_status, PwD_Category,
        DS_Status, Twelfth_Aggregate_Percentage, Twelfth_Top_20_Percentile_Status,
        Document_Upload_Status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        CandidateID, Name, DateOfBirth, Gender, MobileNumber, EmailAddress,
        JEE_Mains_Application_Number, JEE_Advanced_Application_Number,
        StateOfEligibility, JEE_Mains_AIR, JEE_Mains_Category_Rank,
        JEE_Advanced_Qualifying_status, Category, PwD_status, PwD_Category,
        DS_Status, Twelfth_Aggregate_Percentage, Twelfth_Top_20_Percentile_Status,
        Document_Upload_Status
      ]
    );
    return result;
  }

  // Update candidate
  static async update(candidateId, candidateData) {
    const fields = Object.keys(candidateData).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(candidateData), candidateId];
    
    const [result] = await pool.execute(
      `UPDATE Candidate SET ${fields} WHERE CandidateID = ?`,
      values
    );
    return result;
  }

  // Delete candidate
  static async delete(candidateId) {
    const [result] = await pool.execute(
      'DELETE FROM Candidate WHERE CandidateID = ?',
      [candidateId]
    );
    return result;
  }

  // Get candidate with allocation details
  static async getCandidateWithAllocation(candidateId) {
    const [rows] = await pool.execute(
      `SELECT c.*, a.AllocatedInstituteCode, a.AllocatedProgramCode, 
              a.Action, a.Fee_Payment_Status, a.Allocation_Timestamp,
              i.InstituteName, p.ProgramName
       FROM Candidate c
       LEFT JOIN Allocation a ON c.CandidateID = a.CandidateID
       LEFT JOIN Institute i ON a.AllocatedInstituteCode = i.InstituteCode
       LEFT JOIN Program p ON a.AllocatedProgramCode = p.ProgramCode
       WHERE c.CandidateID = ?
       ORDER BY a.Allocation_Timestamp DESC`,
      [candidateId]
    );
    return rows;
  }
}

module.exports = Candidate;
