const pool = require('../config/database');

class SeatMatrix {
  // Get all seat matrix entries
  static async getAll() {
    const [rows] = await pool.execute(
      `SELECT sm.*, i.InstituteName, p.ProgramName
       FROM Seat_Matrix sm
       JOIN Institute i ON sm.InstituteCode = i.InstituteCode
       JOIN Program p ON sm.ProgramCode = p.ProgramCode
       ORDER BY i.InstituteName, p.ProgramName`
    );
    return rows;
  }

  // Get seat matrix by institute
  static async getByInstitute(instituteCode) {
    const [rows] = await pool.execute(
      `SELECT sm.*, p.ProgramName, p.Degree_Type
       FROM Seat_Matrix sm
       JOIN Program p ON sm.ProgramCode = p.ProgramCode
       WHERE sm.InstituteCode = ?
       ORDER BY p.ProgramName`,
      [instituteCode]
    );
    return rows;
  }

  // Get seat matrix by program
  static async getByProgram(programCode) {
    const [rows] = await pool.execute(
      `SELECT sm.*, i.InstituteName
       FROM Seat_Matrix sm
       JOIN Institute i ON sm.InstituteCode = i.InstituteCode
       WHERE sm.ProgramCode = ?
       ORDER BY i.InstituteName`,
      [programCode]
    );
    return rows;
  }

  // Get seat matrix for specific institute-program combination
  static async getByInstituteAndProgram(instituteCode, programCode) {
    const [rows] = await pool.execute(
      `SELECT sm.*, i.InstituteName, p.ProgramName
       FROM Seat_Matrix sm
       JOIN Institute i ON sm.InstituteCode = i.InstituteCode
       JOIN Program p ON sm.ProgramCode = p.ProgramCode
       WHERE sm.InstituteCode = ? AND sm.ProgramCode = ?`,
      [instituteCode, programCode]
    );
    return rows;
  }

  // Create new seat matrix entry
  static async create(seatMatrixData) {
    const { InstituteCode, ProgramCode, SeatPool, Quota, Category, TotalSeats } = seatMatrixData;
    const [result] = await pool.execute(
      `INSERT INTO Seat_Matrix (InstituteCode, ProgramCode, SeatPool, Quota, Category, TotalSeats)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [InstituteCode, ProgramCode, SeatPool, Quota, Category, TotalSeats]
    );
    return result;
  }

  // Update seat matrix entry (for institute-program-specific updates)
  static async update(instituteCode, programCode, updates) {
    const { SeatPool, Quota, Category, TotalSeats, oldSeatPool, oldQuota, oldCategory } = updates;
    const [result] = await pool.execute(
      `UPDATE Seat_Matrix 
       SET SeatPool = COALESCE(?, SeatPool),
           Quota = COALESCE(?, Quota),
           Category = COALESCE(?, Category),
           TotalSeats = COALESCE(?, TotalSeats)
       WHERE InstituteCode = ? AND ProgramCode = ?
         AND SeatPool = ?
         AND Quota = ?
         AND Category = ?`,
      [SeatPool, Quota, Category, TotalSeats, instituteCode, programCode, 
       oldSeatPool, oldQuota, oldCategory]
    );
    return result;
  }

  // Delete seat matrix
  static async delete(instituteCode, programCode, seatPool, quota, category) {
    const [result] = await pool.execute(
      'DELETE FROM Seat_Matrix WHERE InstituteCode = ? AND ProgramCode = ? AND SeatPool = ? AND Quota = ? AND Category = ?',
      [instituteCode, programCode, seatPool, quota, category]
    );
    return result;
  }
}

module.exports = SeatMatrix;
