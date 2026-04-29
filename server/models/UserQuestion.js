// models/UserQuestion.js - Tracks which questions a user saved/practiced
const mongoose = require('mongoose');

const userQuestionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'InterviewQuestion',
      required: true,
    },
    saved: {
      type: Boolean,
      default: false,
    },
    practiced: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userQuestionSchema.index({ user: 1, question: 1 }, { unique: true });

module.exports = mongoose.model('UserQuestion', userQuestionSchema);
