const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');
const Challenge = require('../models/Challenge');

// Create a new challenge
// In routes/challenges.js
router.post('/create', async (req, res) => {
    try {
      let { username, score } = req.body;

     // Validate username
     if (!username || username.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Username is required'
        });
      }

      // Convert username to lowercase before saving
      username = username.trim().toLowerCase();

      // Find user
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: 'User not found' 
        });
      }
      
      // Use passed score if available, otherwise calculate from user stats
      let scoreData = {};
      
      if (score) {
        // Use the current session score data
        scoreData = {
          correctAnswers: score.correct,
          incorrectAnswers: score.incorrect,
          totalAnswers: score.total,
          successRate: score.successRate
        };
      } else {
        // Calculate from user database stats
        const totalAnswers = user.stats.correctAnswers + user.stats.incorrectAnswers;
        const successRate = totalAnswers > 0 
          ? Math.round((user.stats.correctAnswers / totalAnswers) * 100) 
          : 0;
          
        scoreData = {
          correctAnswers: user.stats.correctAnswers,
          incorrectAnswers: user.stats.incorrectAnswers,
          totalAnswers,
          successRate
        };
      }
      
      // Create new challenge with score data
      const newChallenge = new Challenge({
        creatorId: user._id,
        creatorName: user.username,
        inviteCode: uuidv4().substring(0, 8),
        creatorScore: scoreData.successRate,
        correctAnswers: scoreData.correctAnswers,
        incorrectAnswers: scoreData.incorrectAnswers,
        destinationsGuessed: scoreData.totalAnswers
      });
      
      await newChallenge.save();
      
      res.json({
        success: true,
        inviteCode: newChallenge.inviteCode
      });
    } catch (error) {
      console.error('Error creating challenge:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Server error', 
        error: error.message 
      });
    }
  });

// Get challenge details
router.get('/:inviteCode', async (req, res) => {
    try {
      const { inviteCode } = req.params;
      console.log(`Looking for challenge with invite code: ${inviteCode}`);
      
      const challenge = await Challenge.findOne({ inviteCode });
    //   console.log('Challenge found:', challenge); // Debug log
      
      if (!challenge) {
        return res.status(404).json({ 
          success: false, 
          message: 'Challenge not found' 
        });
      }
      
      res.json({
        success: true,
        challenge: {
          creatorName: challenge.creatorName,
          creatorScore: challenge.creatorScore,
          correctAnswers: challenge.correctAnswers,
          incorrectAnswers: challenge.incorrectAnswers,
          destinationsGuessed: challenge.destinationsGuessed,
          createdAt: challenge.createdAt,
          acceptedBy: challenge.acceptedBy
        }
      });
    } catch (error) {
      console.error('Error fetching challenge:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Server error',
        error: error.message 
      });
    }
  });

// Accept a challenge
router.post('/:inviteCode/accept', async (req, res) => {
  try {
    const { inviteCode } = req.params;
    let { username } = req.body;

    if (!username || username.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Username is required'
        });
    }

    // Convert username to lowercase before saving
    username = username.trim().toLowerCase();

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    // Calculate score percentage
    const totalAnswers = user.stats.correctAnswers + user.stats.incorrectAnswers;
    const scorePercentage = totalAnswers > 0 
      ? Math.round((user.stats.correctAnswers / totalAnswers) * 100) 
      : 0;
    
    // Add user to challenge acceptedBy list
    const challenge = await Challenge.findOneAndUpdate(
      { inviteCode },
      { 
        $push: {
          acceptedBy: {
            userId: user._id,
            username: user.username,
            score: scorePercentage
          }
        }
      },
      { new: true }
    );
    
    if (!challenge) {
      return res.status(404).json({ 
        success: false, 
        message: 'Challenge not found' 
      });
    }
    
    res.json({
      success: true,
      challenge: {
        creatorName: challenge.creatorName,
        creatorScore: challenge.creatorScore,
        acceptedBy: challenge.acceptedBy
      }
    });
  } catch (error) {
    console.error('Error accepting challenge:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;