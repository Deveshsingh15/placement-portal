// routes/questions.js
const express = require('express');
const router = express.Router();
const {
  getQuestions,
  toggleQuestion,
  getSavedQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} = require('../controllers/questionController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect);
router.get('/', getQuestions);
router.get('/saved', getSavedQuestions);
router.post('/:id/toggle', toggleQuestion);

// Admin routes
router.post('/', adminOnly, createQuestion);
router.put('/:id', adminOnly, updateQuestion);
router.delete('/:id', adminOnly, deleteQuestion);

module.exports = router;
