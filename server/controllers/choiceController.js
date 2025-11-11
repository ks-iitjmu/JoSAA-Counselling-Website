const ChoiceList = require('../models/ChoiceList');

// Get choices for a candidate
// Students can only see their own choices
// Admins can see all
exports.getChoicesByCandidate = async (req, res) => {
  try {
    const candidateId = parseInt(req.params.candidateId);
    
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    // Students can only see their own choices
    if (req.user.role === 'Student' && req.user.candidateID !== candidateId) {
      return res.status(403).json({
        success: false,
        message: 'You can only view your own choice list'
      });
    }
    
    const choices = await ChoiceList.getByCandidateId(candidateId);
    res.json({ success: true, data: choices });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add a new choice
// Only students can add choices to their own list
exports.addChoice = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    const candidateId = parseInt(req.body.CandidateID);
    
    // Only students can add choices
    if (req.user.role !== 'Student') {
      return res.status(403).json({
        success: false,
        message: 'Only students can add choices'
      });
    }
    
    // Students can only add to their own choice list
    if (req.user.candidateID !== candidateId) {
      return res.status(403).json({
        success: false,
        message: 'You can only add choices to your own list'
      });
    }
    
    const result = await ChoiceList.addChoice(req.body);
    res.status(201).json({ 
      success: true, 
      message: 'Choice added successfully',
      data: { choiceId: result.insertId }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update choice order
// Only students can update their own choices
exports.updateChoiceOrder = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'Student') {
      return res.status(403).json({
        success: false,
        message: 'Only students can update their choices'
      });
    }
    
    const { newChoiceNumber } = req.body;
    await ChoiceList.updateChoiceOrder(req.params.choiceId, newChoiceNumber);
    res.json({ success: true, message: 'Choice order updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Reorder all choices
// Only students can reorder their own choices
exports.reorderChoices = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'Student') {
      return res.status(403).json({
        success: false,
        message: 'Only students can reorder their choices'
      });
    }
    
    const { candidateId, choices } = req.body;
    
    // Verify student is modifying their own choices
    if (req.user.candidateID !== parseInt(candidateId)) {
      return res.status(403).json({
        success: false,
        message: 'You can only reorder your own choices'
      });
    }
    
    await ChoiceList.reorderChoices(candidateId, choices);
    res.json({ success: true, message: 'Choices reordered successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lock/Unlock choices
// Only students can lock their own choices
exports.lockChoices = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'Student') {
      return res.status(403).json({
        success: false,
        message: 'Only students can lock/unlock their choices'
      });
    }
    
    const { candidateId, lockStatus } = req.body;
    
    // Verify student is modifying their own choices
    if (req.user.candidateID !== parseInt(candidateId)) {
      return res.status(403).json({
        success: false,
        message: 'You can only lock/unlock your own choices'
      });
    }
    
    await ChoiceList.lockChoices(candidateId, lockStatus);
    res.json({ 
      success: true, 
      message: lockStatus ? 'Choices locked successfully' : 'Choices unlocked successfully' 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a choice
// Only students can delete their own choices
exports.deleteChoice = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'Student') {
      return res.status(403).json({
        success: false,
        message: 'Only students can delete their choices'
      });
    }
    
    const result = await ChoiceList.deleteChoice(req.params.choiceId);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Choice not found' });
    }
    res.json({ success: true, message: 'Choice deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete all choices for a candidate
// Only students can delete their own choices
exports.deleteAllChoices = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'Student') {
      return res.status(403).json({
        success: false,
        message: 'Only students can delete their choices'
      });
    }
    
    const candidateId = parseInt(req.params.candidateId);
    
    // Verify student is deleting their own choices
    if (req.user.candidateID !== candidateId) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own choices'
      });
    }
    
    await ChoiceList.deleteAllForCandidate(candidateId);
    res.json({ success: true, message: 'All choices deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
