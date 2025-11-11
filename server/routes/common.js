const express = require('express');
const router = express.Router();
const commonController = require('../controllers/commonController');
const { isAuthenticated, optionalAuth } = require('../middleware/auth');

// Allocation routes - Require authentication
router.get('/allocations', isAuthenticated, commonController.getAllocations);
router.get('/allocations/candidate/:candidateId', isAuthenticated, commonController.getAllocationsByCandidate);
router.get('/allocations/round/:roundId', isAuthenticated, commonController.getAllocationsByRound);
router.post('/allocations', isAuthenticated, commonController.createAllocation);
router.put('/allocations/:allocationId/fee-status', isAuthenticated, commonController.updateFeeStatus);
router.delete('/allocations/:allocationId', isAuthenticated, commonController.deleteAllocation);

// Program routes - Public (no authentication required)
router.get('/programs', commonController.getAllPrograms);
router.get('/programs/:code', commonController.getProgramByCode);
router.post('/programs', isAuthenticated, commonController.createProgram);
router.delete('/programs/:code', isAuthenticated, commonController.deleteProgram);

// Seat Matrix routes - PUBLIC (no authentication required)
router.get('/seat-matrix', commonController.getSeatMatrix);
router.get('/seat-matrix/institute/:instituteCode', commonController.getSeatMatrixByInstitute);
router.post('/seat-matrix', isAuthenticated, commonController.createSeatMatrix);
router.put('/seat-matrix/:instituteCode/:programCode', isAuthenticated, commonController.updateSeatMatrix);
router.delete('/seat-matrix/:instituteCode/:programCode', isAuthenticated, commonController.deleteSeatMatrix);

// Opening Closing Ranks routes - PUBLIC (no authentication required)
router.get('/opening-closing-ranks', commonController.getOpeningClosingRanks);
router.get('/opening-closing-ranks/round/:roundId', commonController.getRanksByRound);
router.get('/opening-closing-ranks/search', commonController.searchByRank);
router.post('/opening-closing-ranks', isAuthenticated, commonController.createOpeningClosingRank);
router.delete('/opening-closing-ranks/:ocrId', isAuthenticated, commonController.deleteOpeningClosingRank);

// Counselling Round routes - PUBLIC viewing, authenticated creation
router.get('/counselling-rounds', commonController.getCounsellingRounds);
router.get('/counselling-rounds/current', commonController.getCurrentRound);
router.post('/counselling-rounds', isAuthenticated, commonController.createCounsellingRound);

module.exports = router;
