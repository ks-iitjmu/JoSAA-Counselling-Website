const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidateController');

// Candidate routes
router.get('/', candidateController.getAllCandidates);
router.get('/:id', candidateController.getCandidateById);
router.get('/:id/allocation', candidateController.getCandidateWithAllocation);
router.post('/', candidateController.createCandidate);
router.put('/:id', candidateController.updateCandidate);
router.delete('/:id', candidateController.deleteCandidate);

module.exports = router;
