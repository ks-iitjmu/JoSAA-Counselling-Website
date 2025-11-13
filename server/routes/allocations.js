const express = require('express');
const router = express.Router();
const allocationController = require('../controllers/allocationController');
const { isAuthenticated } = require('../middleware/auth');

// All allocation routes require authentication
router.use(isAuthenticated);

// Allocation routes
router.get('/', allocationController.getAllAllocations);
router.get('/candidate/:candidateId', allocationController.getAllocationsByCandidate);
router.get('/round/:roundId', allocationController.getAllocationsByRound);
router.post('/', allocationController.createAllocation);
router.put('/:allocationId', allocationController.updateAllocation);
router.put('/:allocationId/fee-status', allocationController.updateFeeStatus);
router.delete('/:allocationId', allocationController.deleteAllocation);

module.exports = router;
