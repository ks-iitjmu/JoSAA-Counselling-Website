const pool = require('../config/database');

class Institute {
  // Get all institutes
  static async getAll() {
    const [rows] = await pool.execute('SELECT * FROM Institute ORDER BY InstituteName');
    return rows;
  }

  // Get institute by code
  static async getByCode(instituteCode) {
    const [rows] = await pool.execute(
      'SELECT * FROM Institute WHERE InstituteCode = ?',
      [instituteCode]
    );
    return rows[0];
  }

  // Get institutes with programs
  static async getWithPrograms() {
    const [rows] = await pool.execute(
      `SELECT i.*, p.ProgramCode, p.ProgramName, p.Duration_years, p.Degree_Type
       FROM Institute i
       LEFT JOIN Institute_Program ip ON i.InstituteCode = ip.InstituteCode
       LEFT JOIN Program p ON ip.ProgramCode = p.ProgramCode
       ORDER BY i.InstituteName, p.ProgramName`
    );
    return rows;
  }

  // Get programs for a specific institute
  static async getProgramsByInstitute(instituteCode) {
    const [rows] = await pool.execute(
      `SELECT p.*, sm.TotalSeats, sm.SeatPool, sm.Quota, sm.Category
       FROM Institute_Program ip
       JOIN Program p ON ip.ProgramCode = p.ProgramCode
       LEFT JOIN Seat_Matrix sm ON ip.InstituteCode = sm.InstituteCode 
         AND ip.ProgramCode = sm.ProgramCode
       WHERE ip.InstituteCode = ?
       ORDER BY p.ProgramName`,
      [instituteCode]
    );
    return rows;
  }

  // Create new institute
  static async create(instituteData) {
    const { InstituteCode, InstituteName, InstituteType, MailingAddress, Phone, Website } = instituteData;
    const [result] = await pool.execute(
      `INSERT INTO Institute (InstituteCode, InstituteName, InstituteType, MailingAddress, Phone, Website)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [InstituteCode, InstituteName, InstituteType, MailingAddress, Phone, Website]
    );
    return result;
  }

  // Update institute
  static async update(instituteCode, instituteData) {
    const fields = Object.keys(instituteData).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(instituteData), instituteCode];
    
    const [result] = await pool.execute(
      `UPDATE Institute SET ${fields} WHERE InstituteCode = ?`,
      values
    );
    return result;
  }

  // Delete institute
  static async delete(instituteCode) {
    const [result] = await pool.execute(
      'DELETE FROM Institute WHERE InstituteCode = ?',
      [instituteCode]
    );
    return result;
  }

  // Get allocated students for an institute
  static async getAllocatedStudents(instituteCode) {
    const [rows] = await pool.execute(
      `SELECT 
        a.AllocationID,
        a.CandidateID,
        c.Name AS StudentName,
        c.EmailAddress,
        c.MobileNumber,
        c.Category,
        c.JEE_Mains_AIR,
        a.RoundID,
        a.AllocatedInstituteCode AS InstituteCode,
        i.InstituteName,
        a.AllocatedProgramCode AS ProgramCode,
        p.ProgramName,
        a.Action AS AllocatedCategory,
        a.Allocation_Timestamp AS AllocationDate,
        a.Fee_Payment_Status AS FeePayment_status,
        c.Document_Upload_Status AS Document_Verification_Status
      FROM Allocation a
      JOIN Candidate c ON a.CandidateID = c.CandidateID
      JOIN Institute i ON a.AllocatedInstituteCode = i.InstituteCode
      JOIN Program p ON a.AllocatedProgramCode = p.ProgramCode
      WHERE a.AllocatedInstituteCode = ?
      ORDER BY a.RoundID DESC, p.ProgramName, c.JEE_Mains_AIR`,
      [instituteCode]
    );
    return rows;
  }

  // Get candidates who applied to an institute
  static async getApplicants(instituteCode) {
    const [rows] = await pool.execute(
      `SELECT DISTINCT
        c.CandidateID,
        c.Name AS StudentName,
        c.EmailAddress,
        c.MobileNumber,
        c.Category,
        c.JEE_Mains_AIR,
        cl.ChoiceNumber,
        cl.ProgramCode,
        p.ProgramName,
        cl.Lock_Status
      FROM Choice_List cl
      JOIN Candidate c ON cl.CandidateID = c.CandidateID
      JOIN Program p ON cl.ProgramCode = p.ProgramCode
      WHERE cl.InstituteCode = ?
      ORDER BY cl.ChoiceNumber, c.JEE_Mains_AIR`,
      [instituteCode]
    );
    return rows;
  }
}

module.exports = Institute;
