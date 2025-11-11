const User = require('../models/User');

// Register a new user
exports.register = async (req, res) => {
  try {
    const { role, password, ...userData } = req.body;
    
    // Validate role
    if (!['Student', 'Institute', 'Administrator'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role specified'
      });
    }
    
    // Validate password
    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }
    
    let result;
    
    try {
      if (role === 'Student') {
        // Register student
        const candidateData = {
          candidateID: userData.candidateID,
          name: userData.name,
          dateOfBirth: userData.dateOfBirth,
          gender: userData.gender,
          mobileNumber: userData.mobileNumber,
          email: userData.email,
          jeeMainsAppNumber: userData.jeeMainsAppNumber,
          jeeAdvancedAppNumber: userData.jeeAdvancedAppNumber,
          stateOfEligibility: userData.stateOfEligibility,
          category: userData.category,
          pwdStatus: userData.pwdStatus || 'No'
        };
        
        result = await User.registerStudent(candidateData, password);
        
      } else if (role === 'Institute') {
        // Register institute
        const instituteData = {
          instituteCode: userData.instituteCode,
          instituteName: userData.instituteName,
          instituteType: userData.instituteType,
          mailingAddress: userData.mailingAddress,
          phone: userData.phone,
          website: userData.website,
          email: userData.email
        };
        
        result = await User.registerInstitute(instituteData, password);
        
      } else if (role === 'Administrator') {
        // Only allow admin registration with special authorization
        // In production, this should be protected with additional security
        return res.status(403).json({
          success: false,
          message: 'Administrator accounts cannot be self-registered'
        });
      }
      
      res.status(201).json({
        success: true,
        message: 'Registration successful',
        data: result
      });
      
    } catch (error) {
      // Handle duplicate entry errors
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
          success: false,
          message: 'User already exists with this identifier'
        });
      }
      throw error;
    }
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;
    
    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Identifier and password are required'
      });
    }
    
    // Authenticate user
    const user = await User.authenticate(identifier, password);
    
    if (!user) {
      // Log failed attempt
      await User.logLoginAttempt(identifier, ipAddress, false, 'Invalid credentials');
      
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Log successful attempt
    await User.logLoginAttempt(identifier, ipAddress, true);
    
    // In production, you would generate a JWT token here
    // For now, we'll send back user data
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          userID: user.UserID,
          username: user.Username,
          role: user.Role,
          email: user.Email,
          candidateID: user.CandidateID,
          instituteCode: user.InstituteCode,
          studentName: user.StudentName,
          studentEmail: user.StudentEmail,
          mobileNumber: user.MobileNumber,
          jeeMainsAIR: user.JEE_Mains_AIR,
          instituteName: user.InstituteName,
          institutePhone: user.InstitutePhone,
          website: user.Website
        }
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
};

// Get current user profile
exports.getProfile = async (req, res) => {
  try {
    const { userID } = req.params;
    
    const user = await User.findById(userID);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      data: { user }
    });
    
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: error.message
    });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { userID } = req.params;
    const updates = req.body;
    
    const success = await User.updateProfile(userID, updates);
    
    if (!success) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update'
      });
    }
    
    res.json({
      success: true,
      message: 'Profile updated successfully'
    });
    
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const { userID } = req.params;
    const { currentPassword, newPassword } = req.body;
    
    // Security check: Users can only change their own password
    // Admins can change any password (optional - you can remove this if needed)
    if (req.user.userID !== parseInt(userID) && req.user.role !== 'Administrator') {
      return res.status(403).json({
        success: false,
        message: 'You can only change your own password'
      });
    }
    
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long'
      });
    }
    
    // First verify current password by authenticating
    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const authenticated = await User.authenticate(user.Username, currentPassword);
    if (!authenticated) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }
    
    // Update password
    const success = await User.changePassword(userID, newPassword);
    
    if (!success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to change password'
      });
    }
    
    res.json({
      success: true,
      message: 'Password changed successfully'
    });
    
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password',
      error: error.message
    });
  }
};

// Verify if identifier exists (for registration validation)
exports.checkIdentifier = async (req, res) => {
  try {
    const { type, value } = req.query;
    
    let exists = false;
    
    switch (type) {
      case 'username':
      case 'email':
        exists = await User.checkExists(
          type === 'username' ? value : '',
          type === 'email' ? value : ''
        );
        break;
      case 'candidateID':
        exists = await User.checkCandidateExists(value);
        break;
      case 'instituteCode':
        exists = await User.checkInstituteExists(value);
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid check type'
        });
    }
    
    res.json({
      success: true,
      exists
    });
    
  } catch (error) {
    console.error('Check identifier error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check identifier',
      error: error.message
    });
  }
};

// Logout (optional - mainly for logging purposes)
exports.logout = async (req, res) => {
  try {
    // In a JWT-based system, you would invalidate the token here
    // For now, we'll just send a success response
    
    res.json({
      success: true,
      message: 'Logout successful'
    });
    
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed',
      error: error.message
    });
  }
};

// Get all users (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'Administrator') {
      return res.status(403).json({
        success: false,
        message: 'Only administrators can view all users'
      });
    }
    
    const users = await User.getAll();
    res.json({ success: true, data: users });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve users',
      error: error.message
    });
  }
};

// Delete user (Admin only)
exports.deleteUser = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'Administrator') {
      return res.status(403).json({
        success: false,
        message: 'Only administrators can delete users'
      });
    }
    
    const userId = req.params.userId;
    
    // Prevent admin from deleting themselves
    if (req.user.userID === parseInt(userId)) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account'
      });
    }
    
    const result = await User.delete(userId);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error.message
    });
  }
};
