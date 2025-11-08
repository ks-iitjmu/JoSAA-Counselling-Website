const Candidate = require('../models/Candidate');

// Get all candidates
exports.getAllCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.getAll();
    res.json({ success: true, data: candidates });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get candidate by ID
exports.getCandidateById = async (req, res) => {
  try {
    const candidate = await Candidate.getById(req.params.id);
    if (!candidate) {
      return res.status(404).json({ success: false, message: 'Candidate not found' });
    }
    res.json({ success: true, data: candidate });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get candidate with allocation
exports.getCandidateWithAllocation = async (req, res) => {
  try {
    const data = await Candidate.getCandidateWithAllocation(req.params.id);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create new candidate
exports.createCandidate = async (req, res) => {
  try {
    const result = await Candidate.create(req.body);
    res.status(201).json({ 
      success: true, 
      message: 'Candidate created successfully',
      data: { candidateId: req.body.CandidateID }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update candidate
exports.updateCandidate = async (req, res) => {
  try {
    const result = await Candidate.update(req.params.id, req.body);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Candidate not found' });
    }
    res.json({ success: true, message: 'Candidate updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete candidate
exports.deleteCandidate = async (req, res) => {
  try {
    const result = await Candidate.delete(req.params.id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Candidate not found' });
    }
    res.json({ success: true, message: 'Candidate deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
