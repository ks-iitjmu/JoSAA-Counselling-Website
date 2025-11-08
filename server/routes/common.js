const express = require('express');
const router = express.Router();
const commonController = require('../controllers/commonController');

// Allocation routes
router.get('/allocations', commonController.getAllocations);
router.get('/allocations/candidate/:candidateId', commonController.getAllocationsByCandidate);
router.get('/allocations/round/:roundId', commonController.getAllocationsByRound);
router.post('/allocations', commonController.createAllocation);
router.put('/allocations/:allocationId/fee-status', commonController.updateFeeStatus);

// Program routes
router.get('/programs', commonController.getAllPrograms);
router.get('/programs/:code', commonController.getProgramByCode);
router.post('/programs', commonController.createProgram);

// Seat Matrix routes
router.get('/seat-matrix', commonController.getSeatMatrix);
router.get('/seat-matrix/institute/:instituteCode', commonController.getSeatMatrixByInstitute);
router.post('/seat-matrix', commonController.createSeatMatrix);

// Opening Closing Ranks routes
router.get('/opening-closing-ranks', commonController.getOpeningClosingRanks);
router.get('/opening-closing-ranks/round/:roundId', commonController.getRanksByRound);
router.get('/opening-closing-ranks/search', commonController.searchByRank);
router.post('/opening-closing-ranks', commonController.createOpeningClosingRank);

// Counselling Round routes
router.get('/counselling-rounds', commonController.getCounsellingRounds);
router.get('/counselling-rounds/current', commonController.getCurrentRound);
router.post('/counselling-rounds', commonController.createCounsellingRound);

module.exports = router;
