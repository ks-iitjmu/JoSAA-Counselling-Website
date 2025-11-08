const Institute = require('../models/Institute');

// Get all institutes
exports.getAllInstitutes = async (req, res) => {
  try {
    const institutes = await Institute.getAll();
    res.json({ success: true, data: institutes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get institute by code
exports.getInstituteByCode = async (req, res) => {
  try {
    const institute = await Institute.getByCode(req.params.code);
    if (!institute) {
      return res.status(404).json({ success: false, message: 'Institute not found' });
    }
    res.json({ success: true, data: institute });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get institutes with programs
exports.getInstitutesWithPrograms = async (req, res) => {
  try {
    const data = await Institute.getWithPrograms();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get programs by institute
exports.getProgramsByInstitute = async (req, res) => {
  try {
    const programs = await Institute.getProgramsByInstitute(req.params.code);
    res.json({ success: true, data: programs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create institute
exports.createInstitute = async (req, res) => {
  try {
    await Institute.create(req.body);
    res.status(201).json({ 
      success: true, 
      message: 'Institute created successfully' 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update institute
exports.updateInstitute = async (req, res) => {
  try {
    const result = await Institute.update(req.params.code, req.body);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Institute not found' });
    }
    res.json({ success: true, message: 'Institute updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete institute
exports.deleteInstitute = async (req, res) => {
  try {
    const result = await Institute.delete(req.params.code);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Institute not found' });
    }
    res.json({ success: true, message: 'Institute deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
