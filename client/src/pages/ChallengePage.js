import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Game from '../components/Game';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const ChallengePage = () => {
  const { inviteCode } = useParams();
  const navigate = useNavigate();
  const [challengeData, setChallengeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [showChallenger, setShowChallenger] = useState(true);
  
  // Fetch challenge data
  useEffect(() => {
    const fetchChallengeData = async () => {
      try {
        const response = await fetch(`${API_URL}/challenges/${inviteCode}`);
        const data = await response.json();

        // console.log(data);
        
        if (data.success) {
          setChallengeData(data.challenge);
        } else {
          alert('Challenge not found!');
          navigate('/play');
        }
      } catch (error) {
        console.error('Error fetching challenge:', error);
        alert('An error occurred. Please try again.');
        navigate('/play');
      } finally {
        setLoading(false);
      }
    };
    
    // Check if user is already registered
    const storedUsername = localStorage.getItem('globetrotter_username');
    if (storedUsername) {
      setUsername(storedUsername);
      setIsRegistered(true);
    }
    
    if (inviteCode) {
      fetchChallengeData();
    }
  }, [inviteCode, navigate]);
  
  // Handle registration
  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!username.trim()) {
      alert('Please enter a username');
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setIsRegistered(true);
        localStorage.setItem('globetrotter_username', username);
        
        // Accept the challenge
        await fetch(`${API_URL}/challenges/${inviteCode}/accept`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username })
        });
        
        setShowChallenger(false);
      } else {
        alert(data.message || 'Registration failed. Please try another username.');
      }
    } catch (error) {
      console.error('Error registering user:', error);
      alert('An error occurred during registration. Please try again.');
    }
  };
  
  // Start the challenge
  const startChallenge = async () => {
    if (isRegistered) {
      // Accept the challenge if registered
      try {
        await fetch(`${API_URL}/challenges/${inviteCode}/accept`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username })
        });
      } catch (error) {
        console.error('Error accepting challenge:', error);
      }
    }
    
    setShowChallenger(false);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-500 to-purple-600 flex items-center justify-center">
        <div className="w-16 h-16 border-8 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  // Show the challenger's info before starting
  // Show the challenger's info before starting
if (showChallenger && challengeData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-500 to-purple-600 p-4 flex flex-col items-center justify-center">
        <div className="max-w-md w-full mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="p-6">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800">
                You've Been Challenged!
              </h1>
              <p className="text-gray-600 mt-2">
                {challengeData.creatorName} has challenged you to beat their score
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-blue-600 to-purple-700 p-6 rounded-lg text-white mb-6">
              <div className="text-center mb-4">
                <p className="text-xl font-bold">🏆 Challenger Stats</p>
              </div>
              
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <p className="font-medium">Explorer: <span className="font-bold">{challengeData.creatorName}</span></p>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <p>🟢 Correct: <span className="font-bold">{challengeData.correctAnswers || 0}</span></p>
                    <p>🔴 Wrong: <span className="font-bold">{challengeData.incorrectAnswers || 0}</span></p>
                  </div>
                  <div className="text-right">
                    <p>Score: <span className="font-bold">{challengeData.creatorScore}%</span></p>
                    <p>Countries: <span className="font-bold">{challengeData.destinationsGuessed}</span></p>
                  </div>
                </div>
              </div>
            </div>
            
            {!isRegistered ? (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Join the Adventure</h2>
                <form onSubmit={handleRegister}>
                  <div className="mb-4">
                    <input
                      type="text"
                      placeholder="Enter your explorer name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg text-center transition"
                  >
                    Accept Challenge
                  </button>
                </form>
              </div>
            ) : (
              <button
                onClick={startChallenge}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg text-center transition mb-6"
              >
                Start Challenge
              </button>
            )}
            
            <div className="text-center">
              <button
                onClick={() => navigate('/play')}
                className="text-blue-600 font-medium hover:underline"
              >
                Skip challenge and play regular game
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  // If user is ready to play, show the game component in challenge mode
  return (
    <div className="challenge-page">
      <Game challengeMode={true} />
    </div>
  );
};

export default ChallengePage;