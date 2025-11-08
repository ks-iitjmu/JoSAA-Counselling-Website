const ChoiceList = require('../models/ChoiceList');

// Get choices for a candidate
exports.getChoicesByCandidate = async (req, res) => {
  try {
    const choices = await ChoiceList.getByCandidateId(req.params.candidateId);
    res.json({ success: true, data: choices });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add a new choice
exports.addChoice = async (req, res) => {
  try {
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
exports.updateChoiceOrder = async (req, res) => {
  try {
    const { newChoiceNumber } = req.body;
    await ChoiceList.updateChoiceOrder(req.params.choiceId, newChoiceNumber);
    res.json({ success: true, message: 'Choice order updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Reorder all choices
exports.reorderChoices = async (req, res) => {
  try {
    const { candidateId, choices } = req.body;
    await ChoiceList.reorderChoices(candidateId, choices);
    res.json({ success: true, message: 'Choices reordered successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lock/Unlock choices
exports.lockChoices = async (req, res) => {
  try {
    const { candidateId, lockStatus } = req.body;
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
exports.deleteChoice = async (req, res) => {
  try {
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
exports.deleteAllChoices = async (req, res) => {
  try {
    await ChoiceList.deleteAllForCandidate(req.params.candidateId);
    res.json({ success: true, message: 'All choices deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
