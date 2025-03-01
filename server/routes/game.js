const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Check if answer is correct
router.post('/check-answer', async (req, res) => {
  try {
    const { destinationId, answer } = req.body;
    let { username } = req.body;

    // Convert username to lowercase before saving
    username = username.trim().toLowerCase();
    
    // Check if correct
    const isCorrect = destinationId === answer.id;
    
    // Update user stats if username provided
    if (username) {

        username = username.trim().toLowerCase();

      await User.findOneAndUpdate(
        { username },
        { 
          $inc: { 
            'stats.correctAnswers': isCorrect ? 1 : 0,
            'stats.incorrectAnswers': isCorrect ? 0 : 1,
            'stats.totalGames': 1
          },
          $push: {
            gameHistory: {
              destinationId,
              isCorrect
            }
          }
        }
      );
    }
    
    res.json({
      success: true,
      isCorrect
    });
  } catch (error) {
    console.error('Error checking answer:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;