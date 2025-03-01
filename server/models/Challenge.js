// In models/Challenge.js
const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  creatorId: mongoose.Schema.Types.ObjectId,
  creatorName: String,
  inviteCode: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default: function() {
      // Challenges expire after 7 days
      return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    }
  },
  creatorScore: {
    type: Number,
    default: 0
  },
  correctAnswers: {
    type: Number,
    default: 0
  },
  incorrectAnswers: {
    type: Number,
    default: 0
  },
  destinationsGuessed: {
    type: Number,
    default: 0
  },
  acceptedBy: [{
    userId: mongoose.Schema.Types.ObjectId,
    username: String,
    score: Number,
    correctAnswers: Number,
    incorrectAnswers: Number,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
});

module.exports = mongoose.model('Challenge', challengeSchema);