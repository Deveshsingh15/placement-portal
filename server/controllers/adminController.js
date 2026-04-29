// controllers/adminController.js
const User = require('../models/User');
const DSAProgress = require('../models/DSAProgress');
const InterviewQuestion = require('../models/InterviewQuestion');
const bcrypt = require('bcryptjs');

// @desc    Get dashboard analytics
// @route   GET /api/admin/analytics
exports.getAnalytics = async (req, res) => {
  try {
    const [totalStudents, totalQuestions, studentsWithResume] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      InterviewQuestion.countDocuments(),
      User.countDocuments({ 'resume.filename': { $ne: null }, role: 'student' }),
    ]);

    const dsaStats = await DSAProgress.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const categoryStats = await InterviewQuestion.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      analytics: {
        totalStudents,
        totalQuestions,
        studentsWithResume,
        dsaStats,
        categoryStats,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all students
// @route   GET /api/admin/students
exports.getStudents = async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const query = { role: 'student' };
    if (search) query.name = { $regex: search, $options: 'i' };

    const students = await User.find(query)
      .select('-password')
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);
    res.json({ success: true, students, total });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single student progress
// @route   GET /api/admin/students/:id/progress
exports.getStudentProgress = async (req, res) => {
  try {
    const [user, dsaProgress] = await Promise.all([
      User.findById(req.params.id).select('-password'),
      DSAProgress.find({ user: req.params.id }),
    ]);

    if (!user) return res.status(404).json({ success: false, message: 'Student not found' });

    res.json({ success: true, user, dsaProgress });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete student
// @route   DELETE /api/admin/students/:id
exports.deleteStudent = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    await DSAProgress.deleteMany({ user: req.params.id });
    res.json({ success: true, message: 'Student deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create admin account
// @route   POST /api/admin/create
exports.createAdmin = async (req, res) => {
  try {
    const { name, email, password, adminSecret } = req.body;
    if (adminSecret !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ success: false, message: 'Invalid admin secret' });
    }
    const admin = await User.create({ name, email, password, role: 'admin' });
    res.status(201).json({ success: true, message: 'Admin created', adminId: admin._id });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
