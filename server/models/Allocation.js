const pool = require('../config/database');

class Allocation {
  // Get all allocations
  static async getAll() {
    const [rows] = await pool.execute(
      `SELECT a.*, c.Name as CandidateName, i.InstituteName, p.ProgramName, cr.StartDate, cr.EndDate
       FROM Allocation a
       JOIN Candidate c ON a.CandidateID = c.CandidateID
       LEFT JOIN Institute i ON a.AllocatedInstituteCode = i.InstituteCode
       LEFT JOIN Program p ON a.AllocatedProgramCode = p.ProgramCode
       JOIN Counselling_Round cr ON a.RoundID = cr.RoundID
       ORDER BY a.Allocation_Timestamp DESC`
    );
    return rows;
  }

  // Get allocations by candidate ID
  static async getByCandidateId(candidateId) {
    const [rows] = await pool.execute(
      `SELECT a.*, i.InstituteName, p.ProgramName, cr.StartDate, cr.EndDate
       FROM Allocation a
       LEFT JOIN Institute i ON a.AllocatedInstituteCode = i.InstituteCode
       LEFT JOIN Program p ON a.AllocatedProgramCode = p.ProgramCode
       JOIN Counselling_Round cr ON a.RoundID = cr.RoundID
       WHERE a.CandidateID = ?
       ORDER BY a.Allocation_Timestamp DESC`,
      [candidateId]
    );
    return rows;
  }

  // Get allocations by round ID
  static async getByRoundId(roundId) {
    const [rows] = await pool.execute(
      `SELECT a.*, c.Name as CandidateName, c.JEE_Mains_AIR, 
              i.InstituteName, p.ProgramName
       FROM Allocation a
       JOIN Candidate c ON a.CandidateID = c.CandidateID
       LEFT JOIN Institute i ON a.AllocatedInstituteCode = i.InstituteCode
       LEFT JOIN Program p ON a.AllocatedProgramCode = p.ProgramCode
       WHERE a.RoundID = ?
       ORDER BY a.Allocation_Timestamp DESC`,
      [roundId]
    );
    return rows;
  }

  // Create new allocation
  static async create(allocationData) {
    const {
      CandidateID, RoundID, AllocatedInstituteCode, AllocatedProgramCode,
      Action, Fee_Payment_Status
    } = allocationData;
    
    const [result] = await pool.execute(
      `INSERT INTO Allocation (CandidateID, RoundID, AllocatedInstituteCode, 
                              AllocatedProgramCode, Action, Fee_Payment_Status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [CandidateID, RoundID, AllocatedInstituteCode, AllocatedProgramCode,
       Action, Fee_Payment_Status || 'Pending']
    );
    return result;
  }

  // Update allocation
  static async update(allocationId, allocationData) {
    const fields = Object.keys(allocationData).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(allocationData), allocationId];
    
    const [result] = await pool.execute(
      `UPDATE Allocation SET ${fields} WHERE AllocationID = ?`,
      values
    );
    return result;
  }

  // Update fee payment status
  static async updateFeeStatus(allocationId, status) {
    const [result] = await pool.execute(
      `UPDATE Allocation SET Fee_Payment_Status = ? WHERE AllocationID = ?`,
      [status, allocationId]
    );
    return result;
  }

  // Delete allocation
  static async delete(allocationId) {
    const [result] = await pool.execute(
      'DELETE FROM Allocation WHERE AllocationID = ?',
      [allocationId]
    );
    return result;
  }
}

module.exports = Allocation;
