// routes/admin.js
const express = require('express');
const router = express.Router();
const {
  getAnalytics,
  getStudents,
  getStudentProgress,
  deleteStudent,
  createAdmin,
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/create', createAdmin); // Create first admin (use adminSecret)

router.use(protect, adminOnly);
router.get('/analytics', getAnalytics);
router.get('/students', getStudents);
router.get('/students/:id/progress', getStudentProgress);
router.delete('/students/:id', deleteStudent);

module.exports = router;
