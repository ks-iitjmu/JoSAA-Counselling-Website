const pool = require('../config/database');

class OpeningClosingRanks {
  // Get all opening-closing ranks
  static async getAll() {
    const [rows] = await pool.execute(
      `SELECT ocr.*, i.InstituteName, p.ProgramName, cr.StartDate, cr.EndDate
       FROM Opening_Closing_Ranks ocr
       JOIN Institute i ON ocr.InstituteCode = i.InstituteCode
       JOIN Program p ON ocr.ProgramCode = p.ProgramCode
       JOIN Counselling_Round cr ON ocr.RoundID = cr.RoundID
       ORDER BY i.InstituteName, p.ProgramName`
    );
    return rows;
  }

  // Get ranks by round
  static async getByRound(roundId) {
    const [rows] = await pool.execute(
      `SELECT ocr.*, i.InstituteName, p.ProgramName
       FROM Opening_Closing_Ranks ocr
       JOIN Institute i ON ocr.InstituteCode = i.InstituteCode
       JOIN Program p ON ocr.ProgramCode = p.ProgramCode
       WHERE ocr.RoundID = ?
       ORDER BY i.InstituteName, p.ProgramName`,
      [roundId]
    );
    return rows;
  }

  // Get ranks by institute
  static async getByInstitute(instituteCode) {
    const [rows] = await pool.execute(
      `SELECT ocr.*, p.ProgramName, cr.StartDate, cr.EndDate
       FROM Opening_Closing_Ranks ocr
       JOIN Program p ON ocr.ProgramCode = p.ProgramCode
       JOIN Counselling_Round cr ON ocr.RoundID = cr.RoundID
       WHERE ocr.InstituteCode = ?
       ORDER BY p.ProgramName`,
      [instituteCode]
    );
    return rows;
  }

  // Search ranks by candidate rank
  static async searchByRank(rank, category) {
    const [rows] = await pool.execute(
      `SELECT ocr.*, i.InstituteName, p.ProgramName
       FROM Opening_Closing_Ranks ocr
       JOIN Institute i ON ocr.InstituteCode = i.InstituteCode
       JOIN Program p ON ocr.ProgramCode = p.ProgramCode
       WHERE ocr.OpeningRank <= ? AND ocr.ClosingRank >= ? AND ocr.Category = ?
       ORDER BY ocr.OpeningRank`,
      [rank, rank, category]
    );
    return rows;
  }

  // Create opening-closing ranks entry
  static async create(ocrData) {
    const {
      RoundID, InstituteCode, ProgramCode, SeatPool, Quota, Category,
      OpeningRank, ClosingRank
    } = ocrData;
    
    const [result] = await pool.execute(
      `INSERT INTO Opening_Closing_Ranks 
       (RoundID, InstituteCode, ProgramCode, SeatPool, Quota, Category, OpeningRank, ClosingRank)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [RoundID, InstituteCode, ProgramCode, SeatPool, Quota, Category, OpeningRank, ClosingRank]
    );
    return result;
  }

  // Update opening-closing ranks
  static async update(ocrId, ocrData) {
    const fields = Object.keys(ocrData).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(ocrData), ocrId];
    
    const [result] = await pool.execute(
      `UPDATE Opening_Closing_Ranks SET ${fields} WHERE OCR_ID = ?`,
      values
    );
    return result;
  }

  // Delete opening-closing ranks
  static async delete(ocrId) {
    const [result] = await pool.execute(
      'DELETE FROM Opening_Closing_Ranks WHERE OCR_ID = ?',
      [ocrId]
    );
    return result;
  }
}

module.exports = OpeningClosingRanks;
