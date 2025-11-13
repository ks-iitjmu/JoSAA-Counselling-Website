const Allocation = require('../models/Allocation');
const Program = require('../models/Program');
const SeatMatrix = require('../models/SeatMatrix');
const OpeningClosingRanks = require('../models/OpeningClosingRanks');
const CounsellingRound = require('../models/CounsellingRound');

// Allocation Controller
// Admin can see all allocations
// Students can see their own allocations
// Institutes can see allocations for their institute
exports.getAllocations = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    if (req.user.role === 'Administrator') {
      const allocations = await Allocation.getAll();
      return res.json({ success: true, data: allocations });
    }
    
    // Students and Institutes should use specific endpoints
    return res.status(403).json({
      success: false,
      message: 'Please use specific endpoints to view your allocations'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllocationsByCandidate = async (req, res) => {
  try {
    const candidateId = parseInt(req.params.candidateId);
    
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    // Students can only see their own allocations
    if (req.user.role === 'Student' && req.user.candidateID !== candidateId) {
      return res.status(403).json({
        success: false,
        message: 'You can only view your own allocations'
      });
    }
    
    const allocations = await Allocation.getByCandidateId(candidateId);
    res.json({ success: true, data: allocations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllocationsByRound = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    // Only admins can view all allocations by round
    if (req.user.role !== 'Administrator') {
      return res.status(403).json({
        success: false,
        message: 'Only administrators can view all allocations by round'
      });
    }
    
    const allocations = await Allocation.getByRoundId(req.params.roundId);
    res.json({ success: true, data: allocations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createAllocation = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'Administrator') {
      return res.status(403).json({
        success: false,
        message: 'Only administrators can create allocations'
      });
    }
    
    const result = await Allocation.create(req.body);
    res.status(201).json({ 
      success: true, 
      message: 'Allocation created successfully',
      data: { allocationId: result.insertId }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateFeeStatus = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    // Only admins and institutes can update fee status
    if (req.user.role === 'Student') {
      return res.status(403).json({
        success: false,
        message: 'Students cannot update fee status directly'
      });
    }
    
    const { status } = req.body;
    await Allocation.updateFeeStatus(req.params.allocationId, status);
    res.json({ success: true, message: 'Fee payment status updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete allocation (Admin only)
exports.deleteAllocation = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'Administrator') {
      return res.status(403).json({
        success: false,
        message: 'Only administrators can delete allocations'
      });
    }
    
    const result = await Allocation.delete(req.params.allocationId);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Allocation not found' });
    }
    res.json({ success: true, message: 'Allocation deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Program Controller
// Public information - no authentication required
exports.getAllPrograms = async (req, res) => {
  try {
    const programs = await Program.getAll();
    res.json({ success: true, data: programs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProgramByCode = async (req, res) => {
  try {
    const program = await Program.getByCode(req.params.code);
    if (!program) {
      return res.status(404).json({ success: false, message: 'Program not found' });
    }
    res.json({ success: true, data: program });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createProgram = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'Administrator') {
      return res.status(403).json({
        success: false,
        message: 'Only administrators can create programs'
      });
    }
    
    await Program.create(req.body);
    res.status(201).json({ success: true, message: 'Program created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete program (Admin only)
exports.deleteProgram = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'Administrator') {
      return res.status(403).json({
        success: false,
        message: 'Only administrators can delete programs'
      });
    }
    
    const result = await Program.delete(req.params.code);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Program not found' });
    }
    res.json({ success: true, message: 'Program deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Seat Matrix Controller
exports.getSeatMatrix = async (req, res) => {
  try {
    const seatMatrix = await SeatMatrix.getAll();
    res.json({ success: true, data: seatMatrix });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSeatMatrixByInstitute = async (req, res) => {
  try {
    const seatMatrix = await SeatMatrix.getByInstitute(req.params.instituteCode);
    res.json({ success: true, data: seatMatrix });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createSeatMatrix = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Institutes can create seat matrix for their own institute
    if (req.user.role === 'Institute') {
      if (req.body.InstituteCode !== req.user.instituteCode) {
        return res.status(403).json({
          success: false,
          message: 'You can only create seat matrix for your own institute'
        });
      }
    } else if (req.user.role !== 'Administrator') {
      return res.status(403).json({
        success: false,
        message: 'Only administrators and institutes can create seat matrix entries'
      });
    }
    
    const result = await SeatMatrix.create(req.body);
    res.status(201).json({ 
      success: true, 
      message: 'Seat matrix entry created successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateSeatMatrix = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const { instituteCode, programCode } = req.params;

    // Institutes can only update their own seat matrix
    if (req.user.role === 'Institute' && req.user.instituteCode !== instituteCode) {
      return res.status(403).json({
        success: false,
        message: 'You can only update seat matrix for your own institute'
      });
    }

    if (req.user.role !== 'Administrator' && req.user.role !== 'Institute') {
      return res.status(403).json({
        success: false,
        message: 'Only administrators and institutes can update seat matrix'
      });
    }

    const result = await SeatMatrix.update(instituteCode, programCode, req.body);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Seat matrix entry not found'
      });
    }

    res.json({ 
      success: true, 
      message: 'Seat matrix updated successfully' 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete seat matrix (Admin only)
exports.deleteSeatMatrix = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'Administrator') {
      return res.status(403).json({
        success: false,
        message: 'Only administrators can delete seat matrix entries'
      });
    }
    
    const { instituteCode, programCode } = req.params;
    const { seatPool, quota, category } = req.body;
    
    if (!seatPool || !quota || !category) {
      return res.status(400).json({
        success: false,
        message: 'SeatPool, Quota, and Category are required to identify the entry'
      });
    }
    
    const result = await SeatMatrix.delete(instituteCode, programCode, seatPool, quota, category);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Seat matrix entry not found' });
    }
    
    res.json({ success: true, message: 'Seat matrix deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Opening Closing Ranks Controller
// PUBLIC - No authentication required
exports.getOpeningClosingRanks = async (req, res) => {
  try {
    const ranks = await OpeningClosingRanks.getAll();
    res.json({ success: true, data: ranks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getRanksByRound = async (req, res) => {
  try {
    const ranks = await OpeningClosingRanks.getByRound(req.params.roundId);
    res.json({ success: true, data: ranks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.searchByRank = async (req, res) => {
  try {
    const { rank, category } = req.query;
    const ranks = await OpeningClosingRanks.searchByRank(rank, category);
    res.json({ success: true, data: ranks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createOpeningClosingRank = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'Administrator') {
      return res.status(403).json({
        success: false,
        message: 'Only administrators can create opening-closing rank entries'
      });
    }
    
    const result = await OpeningClosingRanks.create(req.body);
    res.status(201).json({ 
      success: true, 
      message: 'Opening-Closing rank created successfully',
      data: { ocrId: result.insertId }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update opening-closing rank (Admin only)
exports.updateOpeningClosingRank = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'Administrator') {
      return res.status(403).json({
        success: false,
        message: 'Only administrators can update opening-closing rank entries'
      });
    }
    
    const result = await OpeningClosingRanks.update(req.params.ocrId, req.body);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Opening-Closing rank entry not found' });
    }
    res.json({ success: true, message: 'Opening-Closing rank updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete opening-closing rank (Admin only)
exports.deleteOpeningClosingRank = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'Administrator') {
      return res.status(403).json({
        success: false,
        message: 'Only administrators can delete opening-closing rank entries'
      });
    }
    
    const result = await OpeningClosingRanks.delete(req.params.ocrId);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Opening-Closing rank entry not found' });
    }
    res.json({ success: true, message: 'Opening-Closing rank deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Counselling Round Controller
// PUBLIC - No authentication required for viewing
exports.getCounsellingRounds = async (req, res) => {
  try {
    const rounds = await CounsellingRound.getAll();
    res.json({ success: true, data: rounds });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCurrentRound = async (req, res) => {
  try {
    const round = await CounsellingRound.getCurrentRound();
    if (!round) {
      return res.status(404).json({ success: false, message: 'No active counselling round' });
    }
    res.json({ success: true, data: round });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createCounsellingRound = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'Administrator') {
      return res.status(403).json({
        success: false,
        message: 'Only administrators can create counselling rounds'
      });
    }
    
    await CounsellingRound.create(req.body);
    res.status(201).json({ success: true, message: 'Counselling round created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
