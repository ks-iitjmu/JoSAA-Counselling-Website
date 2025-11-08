const express = require('express');
const router = express.Router();
const choiceController = require('../controllers/choiceController');

// Choice List routes
router.get('/candidate/:candidateId', choiceController.getChoicesByCandidate);
router.post('/', choiceController.addChoice);
router.put('/:choiceId/order', choiceController.updateChoiceOrder);
router.post('/reorder', choiceController.reorderChoices);
router.post('/lock', choiceController.lockChoices);
router.delete('/:choiceId', choiceController.deleteChoice);
router.delete('/candidate/:candidateId/all', choiceController.deleteAllChoices);

module.exports = router;
