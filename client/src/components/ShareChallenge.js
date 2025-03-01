import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

// API base URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const ShareChallenge = () => {
  const { inviteCode } = useParams();
  const navigate = useNavigate();
  const [challengeData, setChallengeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const shareCardRef = useRef(null);
  const [shareImage, setShareImage] = useState(null);
  const [copied, setCopied] = useState(false);
  
  // Fetch challenge data
  useEffect(() => {
    const fetchChallengeData = async () => {
      try {
        setLoading(true);
        setError(null);
        // console.log(`Fetching challenge data for code: ${inviteCode}`);
        
        const response = await axios.get(`${API_URL}/challenges/${inviteCode}`);
        const data = response.data;
        
        // console.log('Challenge data response:', data);
        
        if (data.success && data.challenge) {
          setChallengeData(data.challenge);
        } else {
          setError('Challenge data not found');
          console.error('Challenge data not found in response:', data);
        }
      } catch (error) {
        console.error('Error fetching challenge:', error);
        setError(`Error fetching challenge: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    if (inviteCode) {
      fetchChallengeData();
    } else {
      setError('No invite code provided');
      setLoading(false);
    }
  }, [inviteCode]);
  
  // Generate a simple share card
  const generateShareImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 315;
    
    const ctx = canvas.getContext('2d');
    
    // Draw background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#3b82f6');   // blue-500
    gradient.addColorStop(1, '#7c3aed');   // purple-600
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw title
    ctx.fillStyle = 'white';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🧩 Globetrotter Challenge', canvas.width/2, 60);
    
    // Draw subtitle
    ctx.font = '24px Arial';
    ctx.fillText('Can you beat my score?', canvas.width/2, 100);
    
    // Draw score info box
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.roundRect = function(x, y, w, h, r) {
      if (w < 2 * r) r = w / 2;
      if (h < 2 * r) r = h / 2;
      this.beginPath();
      this.moveTo(x+r, y);
      this.arcTo(x+w, y,   x+w, y+h, r);
      this.arcTo(x+w, y+h, x,   y+h, r);
      this.arcTo(x,   y+h, x,   y,   r);
      this.arcTo(x,   y,   x+w, y,   r);
      this.closePath();
      return this;
    };
    
    ctx.roundRect(100, 120, 400, 140, 10).fill();
    
    // Draw user info
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Explorer: ${challengeData?.creatorName || 'Anonymous'}`, 120, 150);
    
    // Draw score details
    ctx.font = '18px Arial';
    ctx.fillText(`🟢 Correct: ${challengeData?.correctAnswers || 0}`, 120, 190);
    ctx.fillText(`🔴 Wrong: ${challengeData?.incorrectAnswers || 0}`, 120, 220);
    ctx.fillText(`Success Rate: ${challengeData?.creatorScore || 0}%`, 330, 190);
    ctx.fillText(`Countries: ${challengeData?.destinationsGuessed || 0}`, 330, 220);
    
    // Draw success rate circle
    const centerX = 280;
    const centerY = 200;
    const radius = 30;
    
    // Background circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fill();
    
    // Progress arc
    const successRate = challengeData?.creatorScore || 0;
    const startAngle = -Math.PI / 2;
    const endAngle = startAngle + (Math.PI * 2 * successRate / 100);
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.lineTo(centerX, centerY);
    ctx.closePath();
    
    // Choose color based on success rate
    let color;
    if (successRate >= 70) color = '#4CAF50'; // green
    else if (successRate >= 40) color = '#FF9800'; // orange
    else color = '#F44336'; // red
    
    ctx.fillStyle = color;
    ctx.fill();
    
    // Draw call to action
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'white';
    ctx.fillText('Tap to play and test your geography knowledge!', canvas.width/2, 280);
    
    return canvas.toDataURL('image/png');
  };
  
  // Generate share image when challenge data is available
  useEffect(() => {
    if (challengeData) {
      try {
        const imageUrl = generateShareImage();
        // console.log("image url", imageUrl);
        setShareImage(imageUrl);
      } catch (error) {
        console.error('Error generating share image:', error);
      }
    }
  }, [challengeData]);
  
  // Handle WhatsApp share
//   const shareViaWhatsApp = () => {
//     if (!challengeData) return;
    
//     const shareUrl = `${window.location.origin}/challenge/${inviteCode}`;
//     const text = encodeURIComponent(
//       `🌍 I challenge you to beat my Globetrotter score! I got ${challengeData.correctAnswers} correct and ${challengeData.incorrectAnswers} wrong (${challengeData.creatorScore}% success rate). Can you guess these famous destinations? Play here: `
//     );
    
//     window.open(`https://wa.me/?text=${text}${encodeURIComponent(shareUrl)}`, '_blank');
//   };

// Using PostImage API (no API key required)
// Add this function to your ShareChallenge component
const shareImageViaWhatsApp = async () => {
    if (!shareImage) return;
    
    try {
      // Option 1: Using ImgBB API (requires API key)
      const imgbbApiKey = '4faa0b7c144f961ae48e19f35150b9d6'; // You'll need to get an API key
      const base64Image = shareImage.split(',')[1]; // Remove the data:image/png;base64, part
      
      const formData = new FormData();
      formData.append('key', imgbbApiKey);
      formData.append('image', base64Image);
      
      // Show loading state
      setLoading(true);
      
      const response = await fetch('https://api.imgbb.com/1/upload', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (data.success) {
        // We now have a hosted image URL
        const imageUrl = data.data.url;
        
        // Create challenge link
        const challengeUrl = `${window.location.origin}/challenge/${inviteCode}`;
        
        // Prepare WhatsApp text
        const text = encodeURIComponent(
          `🌍 I challenge you to beat my Globetrotter score! I got ${challengeData.correctAnswers} correct and ${challengeData.incorrectAnswers} wrong (${challengeData.creatorScore}% success rate).\n\nSee my challenge: ${imageUrl}\n\nPlay here: ${challengeUrl}`
        );
        
        // Open WhatsApp with the image URL in the text
        window.open(`https://wa.me/?text=${text}`, '_blank');
      } else {
        alert('Failed to upload image. Please try again or use the download option.');
      }
    } catch (error) {
      console.error('Error sharing image:', error);
      alert('Error sharing image. Please try downloading instead.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle copy link
  const copyLink = () => {
    const shareUrl = `${window.location.origin}/challenge/${inviteCode}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Handle play challenge
  const handlePlayChallenge = () => {
    navigate(`/challenge/${inviteCode}`);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-500 to-purple-600 flex items-center justify-center">
        <div className="w-16 h-16 border-8 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-500 to-purple-600 p-4 flex flex-col items-center justify-center">
        <div className="max-w-md w-full mx-auto bg-white rounded-xl shadow-xl overflow-hidden p-6">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => navigate('/play')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium"
          >
            Back to Game
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-purple-600 p-4 flex flex-col items-center justify-center">
      <div className="max-w-md w-full mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Challenge Your Friends!
          </h1>
          
          {/* Share Card Preview */}
          <div className="bg-gradient-to-br from-blue-600 to-purple-700 p-6 rounded-lg text-white mb-6">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold">🧩 Globetrotter Challenge</h2>
              <p className="opacity-90">Can you beat my score?</p>
            </div>
            
            <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-4">
              <p className="font-medium">Explorer: <span className="font-bold">{challengeData?.creatorName || 'Anonymous'}</span></p>
              
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                  <p>🟢 Correct: <span className="font-bold">{challengeData?.correctAnswers || 0}</span></p>
                  <p>🔴 Wrong: <span className="font-bold">{challengeData?.incorrectAnswers || 0}</span></p>
                </div>
                <div className="text-right">
                  <p>Score: <span className="font-bold">{challengeData?.creatorScore || 0}%</span></p>
                  <p>Countries: <span className="font-bold">{challengeData?.destinationsGuessed || 0}</span></p>
                </div>
              </div>
            </div>
            
            <p className="text-center text-sm opacity-90">
              Tap to play and test your geography knowledge!
            </p>
          </div>
          
          {/* Share Options */}
          <div className="grid grid-cols-2 gap-4 mb-4">
          <button
            onClick={shareImageViaWhatsApp}
            className="bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg flex items-center justify-center font-medium transition"
            disabled={loading}
            >
            <span className="mr-2">{loading ? 'Processing...' : 'Share Image'}</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 1.86.42 3.632 1.17 5.213L.06 23.5l6.344-1.652A11.947 11.947 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.6a9.59 9.59 0 01-4.889-1.334l-.351-.21-3.636 1.027.984-3.595-.23-.368A9.595 9.595 0 012.4 12C2.4 6.698 6.698 2.4 12 2.4S21.6 6.698 21.6 12s-4.298 9.6-9.6 9.6z"/>
                </svg>
            </button>
            <button
              onClick={copyLink}
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg flex items-center justify-center font-medium transition"
            >
              <span className="mr-2">{copied ? 'Copied!' : 'Copy Link'}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
          
          {/* Share Image Preview (if generated) */}
          {shareImage && (
            <div className="mb-6">
              <p className="text-gray-600 text-sm mb-2 text-center">Share Image Preview:</p>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <img 
                  src={shareImage} 
                  alt="Challenge Share" 
                  className="w-full h-auto"
                />
              </div>
              <p className="text-gray-500 text-xs mt-2 text-center">
                This image will be sent when sharing on platforms that support it.
              </p>
            </div>
          )}
          
          {/* Play Button */}
          {/* <button
            onClick={handlePlayChallenge}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-lg font-bold text-lg transition mb-4"
          >
            Play This Challenge
          </button> */}
          
          <div className="text-center">
            <button
              onClick={() => navigate('/play')}
              className="text-blue-600 font-medium hover:underline"
            >
              ← Back to main game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareChallenge;