import React from 'react';
import { motion } from 'framer-motion';

const ClueCard = ({ clue, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2 }}
      className="bg-white rounded-lg shadow-lg p-4 h-full"
    >
      <div className="flex items-start">
        <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
          {index + 1}
        </div>
        <p className="text-gray-800 text-lg">{clue}</p>
      </div>
    </motion.div>
  );
};

export default ClueCard;