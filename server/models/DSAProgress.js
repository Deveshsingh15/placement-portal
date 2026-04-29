// models/DSAProgress.js - Tracks student DSA question progress
const mongoose = require('mongoose');

const dsaProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    questionId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'revision'],
      default: 'pending',
    },
    notes: {
      type: String,
      default: '',
    },
    solvedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Compound index for fast lookups
dsaProgressSchema.index({ user: 1, questionId: 1 }, { unique: true });

module.exports = mongoose.model('DSAProgress', dsaProgressSchema);
