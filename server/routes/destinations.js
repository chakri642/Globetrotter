const express = require('express');
const router = express.Router();
const Destination = require('../models/Destination');

// Get a random destination with options
router.get('/random', async (req, res) => {
  try {
    // Get total count
    const count = await Destination.countDocuments();
    
    // Get a random destination
    const random = Math.floor(Math.random() * count);
    const destination = await Destination.findOne().skip(random);
    
    // Get 3 other random destinations for multiple choice
    const otherOptions = await Destination.aggregate([
      { $match: { _id: { $ne: destination._id } } },
      { $sample: { size: 3 } }
    ]);
    
    // Combine and shuffle options
    const options = [destination, ...otherOptions].sort(() => 0.5 - Math.random());
    
    res.json({
      success: true,
      destination,
      options
    });
  } catch (error) {
    console.error('Error fetching destination:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;