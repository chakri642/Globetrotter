import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-purple-600 flex flex-col items-center justify-center p-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-7xl font-bold text-white mb-6">🧭</h1>
        <h2 className="text-4xl font-bold text-white mb-4">Destination Not Found</h2>
        <p className="text-xl text-white opacity-90 mb-8">
          Looks like you've wandered off the map!
        </p>
        
        <Link 
          to="/"
          className="inline-block bg-white text-blue-600 font-bold py-3 px-8 rounded-full hover:bg-blue-50 transition shadow-md"
        >
          Return to Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;