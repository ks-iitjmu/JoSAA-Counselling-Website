const Allocation = require('../models/Allocation');

// Get all allocations (Admin only)
exports.getAllAllocations = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'Administrator') {
      return res.status(403).json({
        success: false,
        message: 'Only administrators can view all allocations'
      });
    }

    const allocations = await Allocation.getAll();
    res.json({ success: true, data: allocations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get allocations by candidate
exports.getAllocationsByCandidate = async (req, res) => {
  try {
    const candidateId = parseInt(req.params.candidateId);

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

// Get allocations by round
exports.getAllocationsByRound = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'Administrator') {
      return res.status(403).json({
        success: false,
        message: 'Only administrators can view allocations by round'
      });
    }

    const roundId = parseInt(req.params.roundId);
    const allocations = await Allocation.getByRoundId(roundId);
    res.json({ success: true, data: allocations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create new allocation (Admin only)
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

// Update allocation (Admin only)
exports.updateAllocation = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'Administrator') {
      return res.status(403).json({
        success: false,
        message: 'Only administrators can update allocations'
      });
    }

    const allocationId = parseInt(req.params.allocationId);
    const result = await Allocation.update(allocationId, req.body);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Allocation not found'
      });
    }

    res.json({
      success: true,
      message: 'Allocation updated successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update fee payment status
exports.updateFeeStatus = async (req, res) => {
  try {
    const allocationId = parseInt(req.params.allocationId);
    const { status } = req.body;

    // Students can update their own fee status
    if (req.user.role === 'Student') {
      // First check if this allocation belongs to the student
      const allocations = await Allocation.getByCandidateId(req.user.candidateID);
      const allocation = allocations.find(a => a.AllocationID === allocationId);
      
      if (!allocation) {
        return res.status(403).json({
          success: false,
          message: 'You can only update your own allocations'
        });
      }
    } else if (req.user.role !== 'Administrator') {
      return res.status(403).json({
        success: false,
        message: 'Permission denied'
      });
    }

    const result = await Allocation.updateFeeStatus(allocationId, status);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Allocation not found'
      });
    }

    res.json({
      success: true,
      message: 'Fee status updated successfully'
    });
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

    const allocationId = parseInt(req.params.allocationId);
    const result = await Allocation.delete(allocationId);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Allocation not found'
      });
    }

    res.json({
      success: true,
      message: 'Allocation deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
