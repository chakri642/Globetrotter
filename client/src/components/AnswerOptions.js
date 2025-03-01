import React from 'react';
import { motion } from 'framer-motion';

const AnswerOptions = ({ options, selectedAnswer, onSelect, disabled }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      {options.map((option, index) => (
        <motion.div key={option.id} variants={item}>
          <button
            onClick={() => !disabled && onSelect(option)}
            disabled={disabled}
            className={`w-full text-left p-4 rounded-lg transition transform hover:scale-105 ${
              selectedAnswer && selectedAnswer.id === option.id
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-800 hover:bg-gray-100'
            } ${disabled ? 'opacity-80 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div className="flex items-center">
              <span className="text-xl mr-3">{['🗼', '🏰', '🌋', '🏝️', '🏙️', '🗿', '🌄', '🌉'][index % 8]}</span>
              <div>
                <h3 className="font-bold text-lg">{option.name}</h3>
                <p className="text-sm opacity-80">{option.city}, {option.country}</p>
              </div>
            </div>
          </button>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default AnswerOptions;