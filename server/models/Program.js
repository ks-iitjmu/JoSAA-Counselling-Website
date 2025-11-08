const pool = require('../config/database');

class Program {
  // Get all programs
  static async getAll() {
    const [rows] = await pool.execute('SELECT * FROM Program ORDER BY ProgramName');
    return rows;
  }

  // Get program by code
  static async getByCode(programCode) {
    const [rows] = await pool.execute(
      'SELECT * FROM Program WHERE ProgramCode = ?',
      [programCode]
    );
    return rows[0];
  }

  // Create new program
  static async create(programData) {
    const { ProgramCode, ProgramName, Duration_years, Degree_Type } = programData;
    const [result] = await pool.execute(
      `INSERT INTO Program (ProgramCode, ProgramName, Duration_years, Degree_Type)
       VALUES (?, ?, ?, ?)`,
      [ProgramCode, ProgramName, Duration_years, Degree_Type]
    );
    return result;
  }

  // Update program
  static async update(programCode, programData) {
    const fields = Object.keys(programData).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(programData), programCode];
    
    const [result] = await pool.execute(
      `UPDATE Program SET ${fields} WHERE ProgramCode = ?`,
      values
    );
    return result;
  }

  // Delete program
  static async delete(programCode) {
    const [result] = await pool.execute(
      'DELETE FROM Program WHERE ProgramCode = ?',
      [programCode]
    );
    return result;
  }
}

module.exports = Program;
