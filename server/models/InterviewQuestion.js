// models/InterviewQuestion.js
const mongoose = require('mongoose');

const interviewQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, 'Question text is required'],
      trim: true,
    },
    answer: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      enum: ['hr', 'technical', 'dbms', 'os', 'cn', 'oops', 'aptitude', 'company'],
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    company: {
      type: String,
      default: 'General',
    },
    tags: [String],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('InterviewQuestion', interviewQuestionSchema);
