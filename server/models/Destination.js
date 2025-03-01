const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
  name: String,
  city: String,
  country: String,
  continent: String,
  coordinates: {
    latitude: Number,
    longitude: Number
  },
  clues: [String],
  funFacts: [String],
  trivia: [String],
  difficulty: String,
  category: String
});

module.exports = mongoose.model('Destination', destinationSchema);