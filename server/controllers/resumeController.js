// controllers/resumeController.js
const User = require('../models/User');
const path = require('path');
const fs = require('fs');

// Basic resume scoring logic based on filename/size/metadata
const scoreResume = (filename, filesize) => {
  let score = 40; // base score
  if (filesize > 10000) score += 10; // has content
  if (filesize < 2 * 1024 * 1024) score += 10; // not too large (clean PDF)
  score += Math.floor(Math.random() * 20) + 10; // simulate content analysis
  return Math.min(score, 100);
};

const getResumeSuggestions = (score) => {
  const allSuggestions = [
    'Add a professional summary section at the top',
    'Include your GitHub profile link',
    'Add LinkedIn profile URL',
    'List technical skills with proficiency levels',
    'Include internship or project experience with quantified results',
    'Use action verbs to describe your achievements',
    'Add relevant certifications',
    'Ensure consistent font and formatting throughout',
    'Include your CGPA/GPA if above 7.0',
    'Add competitive programming profiles (LeetCode, Codeforces)',
  ];
  if (score < 60) return allSuggestions.slice(0, 5);
  if (score < 80) return allSuggestions.slice(2, 6);
  return allSuggestions.slice(7, 10);
};

// @desc    Upload resume
// @route   POST /api/resume/upload
exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // Delete old resume if exists
    const user = await User.findById(req.user._id);
    if (user.resume?.filename) {
      const oldPath = path.join(__dirname, '../uploads/resumes', user.resume.filename);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    const score = scoreResume(req.file.filename, req.file.size);
    const suggestions = getResumeSuggestions(score);

    user.resume = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      uploadedAt: new Date(),
      score,
    };
    await user.save();

    res.json({
      success: true,
      message: 'Resume uploaded successfully',
      resume: user.resume,
      suggestions,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get resume info + suggestions
// @route   GET /api/resume
exports.getResume = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.resume?.filename) {
      return res.json({ success: true, resume: null });
    }
    const suggestions = getResumeSuggestions(user.resume.score);
    res.json({ success: true, resume: user.resume, suggestions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete resume
// @route   DELETE /api/resume
exports.deleteResume = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.resume?.filename) {
      const filePath = path.join(__dirname, '../uploads/resumes', user.resume.filename);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    user.resume = { filename: null, originalName: null, uploadedAt: null, score: 0 };
    await user.save();
    res.json({ success: true, message: 'Resume deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
