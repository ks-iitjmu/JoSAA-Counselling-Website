const pool = require('../config/database');

class ChoiceList {
  // Get all choices for a candidate
  static async getByCandidateId(candidateId) {
    const [rows] = await pool.execute(
      `SELECT cl.*, i.InstituteName, p.ProgramName, p.Degree_Type
       FROM Choice_List cl
       JOIN Institute i ON cl.InstituteCode = i.InstituteCode
       JOIN Program p ON cl.ProgramCode = p.ProgramCode
       WHERE cl.CandidateID = ?
       ORDER BY cl.ChoiceNumber`,
      [candidateId]
    );
    return rows;
  }

  // Add a choice
  static async addChoice(choiceData) {
    const { CandidateID, ChoiceNumber, InstituteCode, ProgramCode, Lock_Status } = choiceData;
    const [result] = await pool.execute(
      `INSERT INTO Choice_List (CandidateID, ChoiceNumber, InstituteCode, ProgramCode, Lock_Status)
       VALUES (?, ?, ?, ?, ?)`,
      [CandidateID, ChoiceNumber, InstituteCode, ProgramCode, Lock_Status || 0]
    );
    return result;
  }

  // Update choice order
  static async updateChoiceOrder(choiceId, newChoiceNumber) {
    const [result] = await pool.execute(
      `UPDATE Choice_List SET ChoiceNumber = ? WHERE ChoiceID = ?`,
      [newChoiceNumber, choiceId]
    );
    return result;
  }

  // Delete a choice
  static async deleteChoice(choiceId) {
    const [result] = await pool.execute(
      'DELETE FROM Choice_List WHERE ChoiceID = ?',
      [choiceId]
    );
    return result;
  }

  // Lock/Unlock choices
  static async lockChoices(candidateId, lockStatus) {
    const [result] = await pool.execute(
      `UPDATE Choice_List SET Lock_Status = ? WHERE CandidateID = ?`,
      [lockStatus, candidateId]
    );
    return result;
  }

  // Delete all choices for a candidate
  static async deleteAllForCandidate(candidateId) {
    const [result] = await pool.execute(
      'DELETE FROM Choice_List WHERE CandidateID = ?',
      [candidateId]
    );
    return result;
  }

  // Reorder all choices for a candidate
  static async reorderChoices(candidateId, choicesArray) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      
      for (let i = 0; i < choicesArray.length; i++) {
        await connection.execute(
          `UPDATE Choice_List SET ChoiceNumber = ? WHERE ChoiceID = ? AND CandidateID = ?`,
          [i + 1, choicesArray[i].ChoiceID, candidateId]
        );
      }
      
      await connection.commit();
      return { success: true };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

module.exports = ChoiceList;
