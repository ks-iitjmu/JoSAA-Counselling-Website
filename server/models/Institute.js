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
}

module.exports = Institute;
