const express = require('express');
const router = express.Router();
const choiceController = require('../controllers/choiceController');
const { isAuthenticated } = require('../middleware/auth');

// All choice routes require authentication
router.use(isAuthenticated);

// Admin routes
router.get('/admin/all-candidates', choiceController.getAllCandidatesWithChoices);
router.get('/admin/candidate/:candidateId', choiceController.getCandidateChoicesForAdmin);

// Choice List routes
router.get('/candidate/:candidateId', choiceController.getChoicesByCandidate);
router.post('/', choiceController.addChoice);
router.put('/:choiceId/order', choiceController.updateChoiceOrder);
router.post('/reorder', choiceController.reorderChoices);
router.post('/lock', choiceController.lockChoices);
router.delete('/:choiceId', choiceController.deleteChoice);
router.delete('/candidate/:candidateId/all', choiceController.deleteAllChoices);

module.exports = router;
