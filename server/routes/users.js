const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Register a new user
router.post('/register', async (req, res) => {
  try {
    let { username } = req.body;

     // Validate username
     if (!username || username.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Username is required'
        });
      }
      
      // Convert username to lowercase before saving
      username = username.trim().toLowerCase();
    
    // Check if username exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username already exists' 
      });
    }
    
    // Create new user
    const newUser = new User({ username });
    await newUser.save();
    
    res.json({
      success: true,
      user: {
        username: newUser.username,
        stats: newUser.stats
      }
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get user profile
router.get('/:username', async (req, res) => {
  try {
    let { username } = req.params;

    // Validate username
    if (!username || username.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Username is required'
        });
      }
      // Convert username to lowercase before saving
      username = username.trim().toLowerCase();

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    res.json({
      success: true,
      user: {
        username: user.username,
        stats: user.stats,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update user score
router.put('/:username/score', async (req, res) => {
  try {
    let { username } = req.params;

    // Validate username
    if (!username || username.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Username is required'
        });
      }

    // Convert username to lowercase before saving
    username = username.trim().toLowerCase();

    const { isCorrect, destinationId } = req.body;
    
    const user = await User.findOneAndUpdate(
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
      },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    res.json({
      success: true,
      user: {
        username: user.username,
        stats: user.stats
      }
    });
  } catch (error) {
    console.error('Error updating user score:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;