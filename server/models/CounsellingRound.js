const pool = require('../config/database');

class CounsellingRound {
  // Get all counselling rounds
  static async getAll() {
    const [rows] = await pool.execute(
      'SELECT * FROM Counselling_Round ORDER BY StartDate DESC'
    );
    return rows;
  }

  // Get round by ID
  static async getById(roundId) {
    const [rows] = await pool.execute(
      'SELECT * FROM Counselling_Round WHERE RoundID = ?',
      [roundId]
    );
    return rows[0];
  }

  // Get current active round
  static async getCurrentRound() {
    const [rows] = await pool.execute(
      'SELECT * FROM Counselling_Round WHERE CURDATE() BETWEEN StartDate AND EndDate'
    );
    return rows[0];
  }

  // Create counselling round
  static async create(roundData) {
    const { RoundID, StartDate, EndDate } = roundData;
    const [result] = await pool.execute(
      `INSERT INTO Counselling_Round (RoundID, StartDate, EndDate)
       VALUES (?, ?, ?)`,
      [RoundID, StartDate, EndDate]
    );
    return result;
  }

  // Update counselling round
  static async update(roundId, roundData) {
    const fields = Object.keys(roundData).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(roundData), roundId];
    
    const [result] = await pool.execute(
      `UPDATE Counselling_Round SET ${fields} WHERE RoundID = ?`,
      values
    );
    return result;
  }

  // Delete counselling round
  static async delete(roundId) {
    const [result] = await pool.execute(
      'DELETE FROM Counselling_Round WHERE RoundID = ?',
      [roundId]
    );
    return result;
  }
}

module.exports = CounsellingRound;
