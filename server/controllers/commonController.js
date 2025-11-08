const Allocation = require('../models/Allocation');
const Program = require('../models/Program');
const SeatMatrix = require('../models/SeatMatrix');
const OpeningClosingRanks = require('../models/OpeningClosingRanks');
const CounsellingRound = require('../models/CounsellingRound');

// Allocation Controller
exports.getAllocations = async (req, res) => {
  try {
    const allocations = await Allocation.getAll();
    res.json({ success: true, data: allocations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllocationsByCandidate = async (req, res) => {
  try {
    const allocations = await Allocation.getByCandidateId(req.params.candidateId);
    res.json({ success: true, data: allocations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllocationsByRound = async (req, res) => {
  try {
    const allocations = await Allocation.getByRoundId(req.params.roundId);
    res.json({ success: true, data: allocations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createAllocation = async (req, res) => {
  try {
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
    const { status } = req.body;
    await Allocation.updateFeeStatus(req.params.allocationId, status);
    res.json({ success: true, message: 'Fee payment status updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Program Controller
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
    await Program.create(req.body);
    res.status(201).json({ success: true, message: 'Program created successfully' });
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
    const result = await SeatMatrix.create(req.body);
    res.status(201).json({ 
      success: true, 
      message: 'Seat matrix entry created successfully',
      data: { seatMatrixId: result.insertId }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Opening Closing Ranks Controller
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

// Counselling Round Controller
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
    await CounsellingRound.create(req.body);
    res.status(201).json({ success: true, message: 'Counselling round created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
