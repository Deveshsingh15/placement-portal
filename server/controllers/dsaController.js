// controllers/dsaController.js
const DSAProgress = require('../models/DSAProgress');
const User = require('../models/User');

// @desc    Get all DSA progress for user
// @route   GET /api/dsa/progress
exports.getUserProgress = async (req, res) => {
  try {
    const progress = await DSAProgress.find({ user: req.user._id });
    res.json({ success: true, progress });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update or create question status
// @route   POST /api/dsa/progress
exports.updateProgress = async (req, res) => {
  try {
    const { questionId, status, notes } = req.body;

    const progress = await DSAProgress.findOneAndUpdate(
      { user: req.user._id, questionId },
      {
        status,
        notes: notes || '',
        solvedAt: status === 'completed' ? new Date() : null,
      },
      { upsert: true, new: true }
    );

    res.json({ success: true, progress });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Bulk update multiple questions
// @route   POST /api/dsa/progress/bulk
exports.bulkUpdateProgress = async (req, res) => {
  try {
    const { updates } = req.body; // Array of { questionId, status }
    const ops = updates.map(({ questionId, status }) => ({
      updateOne: {
        filter: { user: req.user._id, questionId },
        update: { status, solvedAt: status === 'completed' ? new Date() : null },
        upsert: true,
      },
    }));
    await DSAProgress.bulkWrite(ops);
    res.json({ success: true, message: 'Progress updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get DSA stats summary for dashboard
// @route   GET /api/dsa/stats
exports.getDSAStats = async (req, res) => {
  try {
    const progress = await DSAProgress.find({ user: req.user._id });
    const completed = progress.filter((p) => p.status === 'completed').length;
    const revision = progress.filter((p) => p.status === 'revision').length;
    res.json({ success: true, stats: { completed, revision, total: progress.length } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
