import React from 'react';
import { motion } from 'framer-motion';

const FeedbackModal = ({ isCorrect, funFact, destination, onNext }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
    >
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onNext}></div>
      
      <motion.div 
        className="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-6 mx-auto"
        initial={{ y: 50 }}
        animate={{ y: 0 }}
      >
        {/* Result Icon */}
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
          <div className={`w-32 h-32 rounded-full flex items-center justify-center ${
            isCorrect ? 'bg-green-500' : 'bg-red-500'
          }`}>
            {isCorrect ? (
              <span className="text-white text-6xl">🎉</span>
            ) : (
              <span className="text-white text-6xl">😢</span>
            )}
          </div>
        </div>
        
        {/* Result Text */}
        <div className="text-center mt-16 mb-4">
          <h2 className={`text-2xl font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
            {isCorrect ? 'Correct!' : 'Not quite...'}
          </h2>
          <p className="text-gray-600 mt-2">
            {isCorrect 
              ? `You correctly identified ${destination}!` 
              : `The correct answer was ${destination}.`}
          </p>
        </div>
        
        {/* Fun Fact */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-6">
          <h3 className="text-blue-800 font-bold mb-1">Did you know?</h3>
          <p className="text-blue-700">{funFact}</p>
        </div>
        
        {/* Next Button */}
        <button 
          onClick={onNext}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-bold text-lg transition"
        >
          Next Challenge
        </button>
      </motion.div>
    </motion.div>
  );
};

export default FeedbackModal;