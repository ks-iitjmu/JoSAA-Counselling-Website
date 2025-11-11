const Institute = require('../models/Institute');

// Get all institutes (Public - no auth required)
// This is public information
exports.getAllInstitutes = async (req, res) => {
  try {
    const institutes = await Institute.getAll();
    res.json({ success: true, data: institutes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get institute by code
// Students and public can view basic info
// Institutes can view their own detailed info
exports.getInstituteByCode = async (req, res) => {
  try {
    const instituteCode = req.params.code;
    
    // If institute user, verify they're accessing their own data for sensitive info
    if (req.user && req.user.role === 'Institute' && req.user.instituteCode !== instituteCode) {
      // Return basic info only for other institutes
      const institute = await Institute.getByCode(instituteCode);
      if (!institute) {
        return res.status(404).json({ success: false, message: 'Institute not found' });
      }
      // Remove sensitive information
      delete institute.Phone;
      delete institute.Email;
      return res.json({ success: true, data: institute });
    }
    
    const institute = await Institute.getByCode(instituteCode);
    if (!institute) {
      return res.status(404).json({ success: false, message: 'Institute not found' });
    }
    res.json({ success: true, data: institute });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get institutes with programs (Public information)
exports.getInstitutesWithPrograms = async (req, res) => {
  try {
    const data = await Institute.getWithPrograms();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get programs by institute (Public information)
exports.getProgramsByInstitute = async (req, res) => {
  try {
    const programs = await Institute.getProgramsByInstitute(req.params.code);
    res.json({ success: true, data: programs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create institute (Admin only)
exports.createInstitute = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'Administrator') {
      return res.status(403).json({
        success: false,
        message: 'Only administrators can create institute records directly'
      });
    }
    
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
// Institutes can update their own info
// Admins can update any
exports.updateInstitute = async (req, res) => {
  try {
    const instituteCode = req.params.code;
    
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    // Institutes can only update their own data
    if (req.user.role === 'Institute') {
      if (req.user.instituteCode !== instituteCode) {
        return res.status(403).json({ 
          success: false, 
          message: 'You can only update your own institute information' 
        });
      }
      
      // Institutes can only update certain fields
      const allowedFields = ['MailingAddress', 'Phone', 'Website', 'Email'];
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
      
      const result = await Institute.update(instituteCode, updates);
      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Institute not found' });
      }
      return res.json({ success: true, message: 'Institute updated successfully' });
    }
    
    // Admins can update all fields
    if (req.user.role === 'Administrator') {
      const result = await Institute.update(instituteCode, req.body);
      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Institute not found' });
      }
      return res.json({ success: true, message: 'Institute updated successfully' });
    }
    
    res.status(403).json({ 
      success: false, 
      message: 'You do not have permission to update institute information' 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete institute (Admin only)
exports.deleteInstitute = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'Administrator') {
      return res.status(403).json({
        success: false,
        message: 'Only administrators can delete institute records'
      });
    }
    
    const result = await Institute.delete(req.params.code);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Institute not found' });
    }
    res.json({ success: true, message: 'Institute deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get allocated students for institute
exports.getAllocatedStudents = async (req, res) => {
  try {
    const instituteCode = req.params.code;
    
    // Verify institute is accessing their own data
    if (req.user.role === 'Institute' && req.user.instituteCode !== instituteCode) {
      return res.status(403).json({
        success: false,
        message: 'You can only view students allocated to your institute'
      });
    }
    
    const students = await Institute.getAllocatedStudents(instituteCode);
    res.json({ success: true, data: students });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get candidates who applied to institute
exports.getApplicants = async (req, res) => {
  try {
    const instituteCode = req.params.code;
    
    // Verify institute is accessing their own data
    if (req.user.role === 'Institute' && req.user.instituteCode !== instituteCode) {
      return res.status(403).json({
        success: false,
        message: 'You can only view candidates who applied to your institute'
      });
    }
    
    const applicants = await Institute.getApplicants(instituteCode);
    res.json({ success: true, data: applicants });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

