const express = require('express');
const router = express.Router();
const instituteController = require('../controllers/instituteController');
const { isAuthenticated, hasRole } = require('../middleware/auth');

// Public routes - no authentication needed
router.get('/', instituteController.getAllInstitutes);
router.get('/:code', instituteController.getInstituteByCode);
router.get('/:code/programs', instituteController.getProgramsByInstitute);
router.get('/with-programs/all', instituteController.getInstitutesWithPrograms);

// Protected routes - require authentication
router.get('/:code/allocated-students', isAuthenticated, hasRole('Institute', 'Administrator'), instituteController.getAllocatedStudents);
router.get('/:code/applicants', isAuthenticated, hasRole('Institute', 'Administrator'), instituteController.getApplicants);

// Admin or Institute can update
router.put('/:code', isAuthenticated, hasRole('Institute', 'Administrator'), instituteController.updateInstitute);

// Admin only routes
router.post('/', isAuthenticated, hasRole('Administrator'), instituteController.createInstitute);
router.delete('/:code', isAuthenticated, hasRole('Administrator'), instituteController.deleteInstitute);

module.exports = router;

