// controllers/questionController.js
const InterviewQuestion = require('../models/InterviewQuestion');
const UserQuestion = require('../models/UserQuestion');

// @desc    Get all interview questions with filters
// @route   GET /api/questions
exports.getQuestions = async (req, res) => {
  try {
    const { category, difficulty, company, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (company) query.company = { $regex: company, $options: 'i' };
    if (search) query.question = { $regex: search, $options: 'i' };

    const skip = (page - 1) * limit;
    const [questions, total] = await Promise.all([
      InterviewQuestion.find(query).skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
      InterviewQuestion.countDocuments(query),
    ]);

    // Attach user-specific data (saved/practiced)
    const userQs = await UserQuestion.find({
      user: req.user._id,
      question: { $in: questions.map((q) => q._id) },
    });

    const userQMap = {};
    userQs.forEach((uq) => {
      userQMap[uq.question.toString()] = uq;
    });

    const enriched = questions.map((q) => ({
      ...q.toObject(),
      saved: userQMap[q._id.toString()]?.saved || false,
      practiced: userQMap[q._id.toString()]?.practiced || false,
    }));

    res.json({ success: true, questions: enriched, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle saved/practiced status
// @route   POST /api/questions/:id/toggle
exports.toggleQuestion = async (req, res) => {
  try {
    const { field } = req.body; // 'saved' or 'practiced'
    if (!['saved', 'practiced'].includes(field)) {
      return res.status(400).json({ success: false, message: 'Invalid field' });
    }

    const userQ = await UserQuestion.findOne({ user: req.user._id, question: req.params.id });
    if (!userQ) {
      const newUQ = await UserQuestion.create({
        user: req.user._id,
        question: req.params.id,
        [field]: true,
      });
      return res.json({ success: true, userQuestion: newUQ });
    }

    userQ[field] = !userQ[field];
    await userQ.save();
    res.json({ success: true, userQuestion: userQ });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get saved questions for user
// @route   GET /api/questions/saved
exports.getSavedQuestions = async (req, res) => {
  try {
    const saved = await UserQuestion.find({ user: req.user._id, saved: true }).populate('question');
    res.json({ success: true, questions: saved.map((uq) => ({ ...uq.question.toObject(), saved: true, practiced: uq.practiced })) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin CRUD
exports.createQuestion = async (req, res) => {
  try {
    const q = await InterviewQuestion.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ success: true, question: q });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateQuestion = async (req, res) => {
  try {
    const q = await InterviewQuestion.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!q) return res.status(404).json({ success: false, message: 'Question not found' });
    res.json({ success: true, question: q });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    await InterviewQuestion.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Question deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
