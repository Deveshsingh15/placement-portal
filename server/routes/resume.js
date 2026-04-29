// routes/resume.js
const express = require('express');
const router = express.Router();
const { uploadResume, getResume, deleteResume } = require('../controllers/resumeController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const path = require('path');
const fs = require('fs');

router.use(protect);
router.get('/', getResume);
router.post('/upload', upload.single('resume'), uploadResume);
router.delete('/', deleteResume);

// Serve resume PDF
router.get('/file/:filename', (req, res) => {
  const filePath = path.join(__dirname, '../uploads/resumes', req.params.filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ success: false, message: 'File not found' });
  }
  res.sendFile(filePath);
});

module.exports = router;
