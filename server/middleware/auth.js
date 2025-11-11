// Authentication and Authorization Middleware

// Check if user is authenticated
exports.isAuthenticated = (req, res, next) => {
  // In a production environment, you would verify JWT token here
  // For now, we'll check for user data in the request
  const userId = req.headers['x-user-id'];
  const userRole = req.headers['x-user-role'];
  
  if (!userId || !userRole) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Please login to access this resource.'
    });
  }
  
  // Attach user info to request
  req.user = {
    userID: parseInt(userId),
    role: userRole,
    candidateID: req.headers['x-candidate-id'] ? parseInt(req.headers['x-candidate-id']) : null,
    instituteCode: req.headers['x-institute-code'] || null
  };
  
  next();
};

// Check if user has specific role
exports.hasRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to access this resource'
      });
    }
    
    next();
  };
};

// Check if user is a student
exports.isStudent = (req, res, next) => {
  if (!req.user || req.user.role !== 'Student') {
    return res.status(403).json({
      success: false,
      message: 'Only students can access this resource'
    });
  }
  next();
};

// Check if user is an institute
exports.isInstitute = (req, res, next) => {
  if (!req.user || req.user.role !== 'Institute') {
    return res.status(403).json({
      success: false,
      message: 'Only institutes can access this resource'
    });
  }
  next();
};

// Check if user is an administrator
exports.isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'Administrator') {
    return res.status(403).json({
      success: false,
      message: 'Only administrators can access this resource'
    });
  }
  next();
};

// Check if student is accessing their own data
exports.isOwnStudentData = (req, res, next) => {
  if (!req.user || req.user.role !== 'Student') {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }
  
  // Check if the candidateId in the route matches the user's candidateID
  const candidateId = parseInt(req.params.id || req.params.candidateId);
  
  if (candidateId !== req.user.candidateID) {
    return res.status(403).json({
      success: false,
      message: 'You can only access your own data'
    });
  }
  
  next();
};

// Check if institute is accessing their own data
exports.isOwnInstituteData = (req, res, next) => {
  if (!req.user || req.user.role !== 'Institute') {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }
  
  // Check if the instituteCode in the route matches the user's instituteCode
  const instituteCode = req.params.code || req.params.instituteCode;
  
  if (instituteCode !== req.user.instituteCode) {
    return res.status(403).json({
      success: false,
      message: 'You can only access your own institute data'
    });
  }
  
  next();
};

// Optional authentication - allows access with or without login
// but provides user context if logged in
exports.optionalAuth = (req, res, next) => {
  const userId = req.headers['x-user-id'];
  const userRole = req.headers['x-user-role'];
  
  if (userId && userRole) {
    req.user = {
      userID: parseInt(userId),
      role: userRole,
      candidateID: req.headers['x-candidate-id'] ? parseInt(req.headers['x-candidate-id']) : null,
      instituteCode: req.headers['x-institute-code'] || null
    };
  }
  
  next();
};
