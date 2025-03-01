import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-purple-600 flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
          🧩 Globetrotter
        </h1>
        <p className="text-xl md:text-2xl text-white opacity-90">
          The Ultimate Travel Guessing Game
        </p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Test your knowledge of famous destinations!
        </h2>
        
        <div className="space-y-4 mb-8">
          <div className="flex items-start">
            <div className="bg-blue-100 p-2 rounded-full mr-4">
              <span className="text-2xl">🌍</span>
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Guess destinations</h3>
              <p className="text-gray-600">Solve cryptic clues about famous places around the world</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-purple-100 p-2 rounded-full mr-4">
              <span className="text-2xl">📚</span>
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Learn fun facts</h3>
              <p className="text-gray-600">Discover interesting trivia about each destination</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-yellow-100 p-2 rounded-full mr-4">
              <span className="text-2xl">🏆</span>
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Challenge friends</h3>
              <p className="text-gray-600">Share your score and challenge others to beat it</p>
            </div>
          </div>
        </div>
        
        <Link 
          to="/play"
          className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-lg text-center text-lg transition transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          Start Playing
        </Link>
        
        {/* <div className="mt-6 text-center">
          <Link to="/leaderboard" className="text-blue-600 hover:underline font-medium">
            View Leaderboard
          </Link>
        </div> */}
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8 text-white text-center opacity-90"
      >
        <p>Try to guess famous destinations from around the world!</p>
        <p className="text-sm mt-4">Created by Globetrotter Team</p>
      </motion.div>
    </div>
  );
};

export default HomePage;