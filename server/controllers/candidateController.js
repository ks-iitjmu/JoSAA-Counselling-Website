const Candidate = require('../models/Candidate');

// Get all candidates (Admin or Institute only)
// Institute can see candidates who have applied to their programs
exports.getAllCandidates = async (req, res) => {
  try {
    // If user is an institute, filter candidates who applied to their programs
    if (req.user.role === 'Institute') {
      // This would require a custom query to get candidates who have chosen this institute's programs
      // For now, return empty array - institutes should use their specific endpoints
      return res.status(403).json({ 
        success: false, 
        message: 'Institutes should use specific endpoints to view their applicants' 
      });
    }
    
    // Admin can see all candidates
    if (req.user.role === 'Administrator') {
      const candidates = await Candidate.getAll();
      return res.json({ success: true, data: candidates });
    }
    
    res.status(403).json({ 
      success: false, 
      message: 'You do not have permission to view all candidates' 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get candidate by ID
// Students can only see their own data
// Institutes can see students who applied to them
// Admins can see all
exports.getCandidateById = async (req, res) => {
  try {
    const candidateId = parseInt(req.params.id);
    
    // Students can only access their own data
    if (req.user.role === 'Student' && req.user.candidateID !== candidateId) {
      return res.status(403).json({ 
        success: false, 
        message: 'You can only access your own information' 
      });
    }
    
    const candidate = await Candidate.getById(candidateId);
    if (!candidate) {
      return res.status(404).json({ success: false, message: 'Candidate not found' });
    }
    
    // If institute, check if this candidate applied to their programs
    if (req.user.role === 'Institute') {
      // TODO: Add check to verify candidate applied to this institute
      // For now, allow access
    }
    
    res.json({ success: true, data: candidate });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get candidate with allocation
// Students can only see their own data
// Institutes can see allocations for their institute
// Admins can see all
exports.getCandidateWithAllocation = async (req, res) => {
  try {
    const candidateId = parseInt(req.params.id);
    
    // Students can only access their own data
    if (req.user.role === 'Student' && req.user.candidateID !== candidateId) {
      return res.status(403).json({ 
        success: false, 
        message: 'You can only access your own allocation information' 
      });
    }
    
    const data = await Candidate.getCandidateWithAllocation(candidateId);
    
    // If institute, filter to show only their institute's allocations
    if (req.user.role === 'Institute' && data.allocation) {
      if (data.allocation.InstituteCode !== req.user.instituteCode) {
        return res.status(403).json({
          success: false,
          message: 'You can only view allocations for your institute'
        });
      }
    }
    
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create new candidate (Admin only)
exports.createCandidate = async (req, res) => {
  try {
    if (req.user.role !== 'Administrator') {
      return res.status(403).json({
        success: false,
        message: 'Only administrators can create candidate records directly'
      });
    }
    
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
// Students can update their own data
// Institutes can update students allocated to them
// Admins can update any
exports.updateCandidate = async (req, res) => {
  try {
    const candidateId = parseInt(req.params.id);
    
    // Students can only update their own data
    if (req.user.role === 'Student') {
      if (req.user.candidateID !== candidateId) {
        return res.status(403).json({ 
          success: false, 
          message: 'You can only update your own information' 
        });
      }
      
      // Students cannot update certain critical fields
      const allowedFields = ['MobileNumber', 'Email'];
      const updates = {};
      for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      }
      
      if (Object.keys(updates).length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No valid fields to update. Students can only update mobile number and email.'
        });
      }
      
      const result = await Candidate.update(candidateId, updates);
      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Candidate not found' });
      }
      return res.json({ success: true, message: 'Candidate updated successfully' });
    }
    
    // Institutes can update students allocated to their institute
    if (req.user.role === 'Institute') {
      // Check if this candidate is allocated to this institute
      const allocation = await Candidate.getCandidateWithAllocation(candidateId);
      
      if (!allocation || !allocation.allocation) {
        return res.status(404).json({
          success: false,
          message: 'No allocation found for this candidate'
        });
      }
      
      if (allocation.allocation.AllocatedInstituteCode !== req.user.instituteCode) {
        return res.status(403).json({
          success: false,
          message: 'You can only update students allocated to your institute'
        });
      }
      
      // Institutes can update contact info and some other fields
      const allowedFields = ['MobileNumber', 'EmailAddress', 'Category'];
      const updates = {};
      for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      }
      
      if (Object.keys(updates).length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No valid fields to update'
        });
      }
      
      const result = await Candidate.update(candidateId, updates);
      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Candidate not found' });
      }
      return res.json({ success: true, message: 'Candidate updated successfully' });
    }
    
    // Admins can update all fields
    if (req.user.role === 'Administrator') {
      const result = await Candidate.update(candidateId, req.body);
      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Candidate not found' });
      }
      return res.json({ success: true, message: 'Candidate updated successfully' });
    }
    
    res.status(403).json({ 
      success: false, 
      message: 'You do not have permission to update candidate information' 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete candidate (Admin only)
exports.deleteCandidate = async (req, res) => {
  try {
    if (req.user.role !== 'Administrator') {
      return res.status(403).json({
        success: false,
        message: 'Only administrators can delete candidate records'
      });
    }
    
    const result = await Candidate.delete(req.params.id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Candidate not found' });
    }
    res.json({ success: true, message: 'Candidate deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
