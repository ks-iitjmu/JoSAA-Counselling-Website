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

  // Create seat matrix entry
  static async create(seatMatrixData) {
    const { InstituteCode, ProgramCode, SeatPool, Quota, Category, TotalSeats } = seatMatrixData;
    const [result] = await pool.execute(
      `INSERT INTO Seat_Matrix (InstituteCode, ProgramCode, SeatPool, Quota, Category, TotalSeats)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [InstituteCode, ProgramCode, SeatPool, Quota, Category, TotalSeats]
    );
    return result;
  }

  // Update seat matrix
  static async update(seatMatrixId, seatMatrixData) {
    const fields = Object.keys(seatMatrixData).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(seatMatrixData), seatMatrixId];
    
    const [result] = await pool.execute(
      `UPDATE Seat_Matrix SET ${fields} WHERE SeatMatrixID = ?`,
      values
    );
    return result;
  }

  // Delete seat matrix
  static async delete(seatMatrixId) {
    const [result] = await pool.execute(
      'DELETE FROM Seat_Matrix WHERE SeatMatrixID = ?',
      [seatMatrixId]
    );
    return result;
  }
}

module.exports = SeatMatrix;
