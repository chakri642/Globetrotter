import React, { useState, useEffect, useCallback } from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

// Components
import ClueCard from './ClueCard';
import AnswerOptions from './AnswerOptions';
import FeedbackModal from './FeedbackModal';

// API base URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const Game = ({ challengeMode = false }) => {
  const navigate = useNavigate();
  const { inviteCode } = useParams();
  const { width, height } = useWindowSize();

  // Load initial score from localStorage
  const loadInitialScore = () => {
    try {
      const savedScore = localStorage.getItem('globetrotter_score');
      if (savedScore) {
        return JSON.parse(savedScore);
      }
    } catch (e) {
      console.error('Error loading score from localStorage:', e);
    }
    return { correct: 0, incorrect: 0, total: 0 };
  };

  // State
  const [currentDestination, setCurrentDestination] = useState(null);
  const [options, setOptions] = useState([]);
  const [clues, setClues] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState({
    show: false,
    isCorrect: false,
    funFact: '',
    actualDestination: ''
  });
  const [score, setScore] = useState(loadInitialScore);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [username, setUsername] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [challengeData, setChallengeData] = useState(null);

  // Save score to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('globetrotter_score', JSON.stringify(score));
  }, [score]);

  // Fetch a new random destination
  const fetchRandomDestination = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/destinations/random`);
      const data = response.data;
      
      if (data.success && data.destination && data.options) {
        // console.log("Current destination:", data.destination);
        setCurrentDestination(data.destination);
        setOptions(data.options);
        
        // Select 2 random clues
        const shuffledClues = [...data.destination.clues].sort(() => 0.5 - Math.random());
        setClues(shuffledClues.slice(0, 2));
      } else {
        console.error("API returned success but missing data:", data);
      }
    } catch (error) {
      console.error('Error fetching destination:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize the game
  useEffect(() => {
    fetchRandomDestination();
    
    // Check if user is already registered
    const storedUsername = localStorage.getItem('globetrotter_username');
    if (storedUsername) {
      setUsername(storedUsername);
      setIsRegistered(true);
    }
    
    // If in challenge mode, fetch challenge details
    if (challengeMode && inviteCode) {
      fetchChallengeDetails(inviteCode);
    }
  }, [fetchRandomDestination, challengeMode, inviteCode]);
  
  // Fetch challenge details if we're in challenge mode
  const fetchChallengeDetails = async (code) => {
    try {
      const response = await axios.get(`${API_URL}/challenges/${code}`);
      const data = response.data;
      
      if (data.success) {
        setChallengeData(data.challenge);
      }
    } catch (error) {
      console.error('Error fetching challenge details:', error);
    }
  };
  
  // Handle registration
  const handleRegister = async (newUsername) => {
    if (!newUsername.trim()){
      alert('Please enter a username');
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: newUsername })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setUsername(newUsername);
        setIsRegistered(true);
        localStorage.setItem('globetrotter_username', newUsername);
      } else {
        alert(data.message || 'Registration failed. Please try another username.');
      }
    } catch (error) {
      console.error('Error registering user:', error);
      alert('An error occurred during registration. Please try again.');
    }
  };

  // Handle user answer selection
  const handleAnswerSelect = async (answer) => {
    setSelectedAnswer(answer);
    
    try {
      // Check if the selected answer matches the current destination
      // Instead of sending to the server, we'll check it client-side for now
      const isCorrect = currentDestination.name === answer.name;
      // console.log("Comparing:", currentDestination.name, "with", answer.name, "Result:", isCorrect);
      
      // Get a random fun fact or trivia
      const funFactsAndTrivia = [...currentDestination.funFacts, ...currentDestination.trivia];
      const randomFact = funFactsAndTrivia[Math.floor(Math.random() * funFactsAndTrivia.length)];
      
      // Update feedback state
      setFeedback({
        show: true,
        isCorrect: isCorrect,
        funFact: randomFact,
        actualDestination: currentDestination.name
      });
      
      // Update score
      setScore(prevScore => {
        const newScore = {
          correct: prevScore.correct + (isCorrect ? 1 : 0),
          incorrect: prevScore.incorrect + (isCorrect ? 0 : 1),
          total: prevScore.total + 1
        };
        return newScore;
      });
      
      // Show confetti if correct
      if (isCorrect) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }
      
      // Update user score in backend if registered
      if (isRegistered) {
        try {
          await axios.post(`${API_URL}/game/check-answer`, {
            destinationId: currentDestination._id,
            answer: answer,
            username: username,
            isCorrect: isCorrect
          });
        } catch (serverError) {
          console.error('Error updating score on server:', serverError);
          // Continue with the game even if server update fails
        }
      }
    } catch (error) {
      console.error('Error checking answer:', error);
    }
  };
  
  // Handle next question
  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setFeedback({ show: false, isCorrect: false, funFact: '', actualDestination: '' });
    fetchRandomDestination();
  };
  
  // Handle creating a challenge
  const handleCreateChallenge = async () => {
    if (!isRegistered) {
      alert('Please register with a username first to create a challenge!');
      return;
    }
    
    try {
      // Add current session score for a more accurate representation
      const currentScore = {
        correct: score.correct,
        incorrect: score.incorrect,
        total: score.total,
        successRate: score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0
      };
      
      const response = await axios.post(`${API_URL}/challenges/create`, {
        username,
        score: currentScore
      });
      
      const data = response.data;
      
      if (data.success && data.inviteCode) {
        navigate(`/share/${data.inviteCode}`);
      } else {
        alert('Failed to create challenge. Please try again.');
      }
    } catch (error) {
      console.error('Error creating challenge:', error);
      alert('An error occurred. Please try again.');
    }
  };  

  // Reset score - add this function to allow users to reset their score
  const handleResetScore = () => {
    if (window.confirm('Are you sure you want to reset your score?')) {
      const newScore = { correct: 0, incorrect: 0, total: 0 };
      setScore(newScore);
      localStorage.setItem('globetrotter_score', JSON.stringify(newScore));
    }
  };

  // Render the game component
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-purple-600 p-4">
      {/* Confetti animation for correct answers */}
      {showConfetti && <Confetti width={width} height={height} recycle={false} />}
      
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🧩 Globetrotter</h1>
          <p className="text-xl text-white opacity-90">Guess the famous destination!</p>
          
          {/* Show challenger info if in challenge mode */}
          {challengeMode && challengeData && (
            <div className="mt-2 bg-white bg-opacity-20 rounded-lg p-2 inline-block">
              <p className="text-white">
                Challenge by: <span className="font-bold">{challengeData.creatorName}</span>
                <span className="ml-3">Score: <span className="font-bold">{challengeData.creatorScore}%</span></span>
                <span className="ml-3">Guessed: <span className="font-bold">{challengeData.destinationsGuessed}</span></span>
                <span className="ml-3">Correct: <span className="font-bold">{challengeData.correctAnswers}</span></span>
                <span className="ml-3">Wrong: <span className="font-bold">{challengeData.incorrectAnswers}</span></span>
              </p>
            </div>
          )}
        </header>
        
        {/* User Registration (if not registered) */}
        {!isRegistered && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Join the Adventure!</h2>
            <p className="text-gray-600 mb-4">Enter a username to track your scores and challenge friends:</p>
            
            <div className="flex">
              <input
                type="text"
                placeholder="Your Explorer Name"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <button
                onClick={() => handleRegister(username)}
                className="bg-blue-600 text-white px-6 py-2 rounded-r-md hover:bg-blue-700 transition"
              >
                Let's Go!
              </button>
            </div>
          </div>
        )}
        
        {/* Game Area */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="game-container">
            {/* Score Display with Reset Button */}
            <div className="bg-white rounded-lg shadow-lg p-4 mb-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {username ? `Explorer: ${username}` : 'Your Score'}
                </h3>
                <div className="flex mt-1">
                  <span className="text-green-600 font-medium mr-4">✓ {score.correct} correct</span>
                  <span className="text-red-600 font-medium">✗ {score.incorrect} wrong</span>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="text-center mr-6">
                  <div className="relative w-16 h-16">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#eee"
                        strokeWidth="3"
                        strokeDasharray="100, 100"
                      />
                      <path
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke={score.total > 0 ? 
                          (score.correct / score.total >= 0.7 ? "#4CAF50" : 
                          score.correct / score.total >= 0.4 ? "#FF9800" : "#F44336") : "#ccc"}
                        strokeWidth="3"
                        strokeDasharray={`${score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0}, 100`}
                      />
                      <text x="18" y="20.5" textAnchor="middle" fontSize="10" fill="#333" fontWeight="bold">
                        {score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0}%
                      </text>
                    </svg>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Success Rate</p>
                </div>
                
                <button 
                  onClick={handleResetScore}
                  className="text-white text-sm bg-red-500 hover:bg-red-600 px-3 py-2 rounded transition"
                >
                  Reset Score
                </button>
              </div>
            </div>
            
            {/* Challenge Creator */}
            {isRegistered && !challengeMode && (
              <div className="text-center mb-6">
                <button
                  onClick={handleCreateChallenge}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-full hover:bg-yellow-600 transition shadow-md font-bold"
                >
                  🏆 Challenge a Friend
                </button>
              </div>
            )}
            
            {/* Clues Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">📝 Your Clues:</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {clues.map((clue, index) => (
                  <ClueCard key={index} clue={clue} index={index} />
                ))}
              </div>
            </div>
            
            {/* Answer Options */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">🌍 Where am I?</h2>
              <AnswerOptions
                options={options}
                selectedAnswer={selectedAnswer}
                onSelect={handleAnswerSelect}
                disabled={feedback.show}
              />
            </div>
            
            {/* Feedback Modal */}
            <AnimatePresence>
              {feedback.show && (
                <FeedbackModal
                  isCorrect={feedback.isCorrect}
                  funFact={feedback.funFact}
                  destination={feedback.actualDestination}
                  onNext={handleNextQuestion}
                />
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;