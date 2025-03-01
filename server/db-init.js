const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('MongoDB connected for data initialization...'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Define Destination Schema
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

// Create Destination model
const Destination = mongoose.model('Destination', destinationSchema);

// Import starter data
const importData = async () => {
  try {
    // Read the JSON file
    const jsonData = fs.readFileSync(
      path.join(__dirname, 'data', 'starter-dataset.json'),
      'utf-8'
    );
    const destinations = JSON.parse(jsonData);
    
    // Check if collection already has data
    const existingCount = await Destination.countDocuments();
    
    if (existingCount > 0) {
      console.log(`Database already contains ${existingCount} destinations. Skipping import.`);
      console.log('To reimport, clear the collection first.');
      process.exit(0);
    }
    
    // Insert data
    const result = await Destination.insertMany(destinations);
    console.log(`Successfully imported ${result.length} destinations into the database.`);
    
    // Success
    console.log('Data initialization complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
};

// Run the import
importData();