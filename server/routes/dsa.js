// routes/dsa.js
const express = require('express');
const router = express.Router();
const { getUserProgress, updateProgress, getDSAStats, bulkUpdateProgress } = require('../controllers/dsaController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/progress', getUserProgress);
router.post('/progress', updateProgress);
router.post('/progress/bulk', bulkUpdateProgress);
router.get('/stats', getDSAStats);

module.exports = router;
