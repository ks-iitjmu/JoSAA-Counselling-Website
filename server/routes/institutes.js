const express = require('express');
const router = express.Router();
const instituteController = require('../controllers/instituteController');

// Institute routes
router.get('/', instituteController.getAllInstitutes);
router.get('/with-programs', instituteController.getInstitutesWithPrograms);
router.get('/:code', instituteController.getInstituteByCode);
router.get('/:code/programs', instituteController.getProgramsByInstitute);
router.post('/', instituteController.createInstitute);
router.put('/:code', instituteController.updateInstitute);
router.delete('/:code', instituteController.deleteInstitute);

module.exports = router;
