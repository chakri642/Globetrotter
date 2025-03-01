Globetrotter Challenge
======================

A travel-themed guessing game where players test their knowledge of famous destinations around the world.

Overview
--------

Globetrotter Challenge is a full-stack web application that presents players with cryptic clues about famous destinations. Players must guess the correct location from multiple choices, earning points for correct answers. The game features a social aspect where users can challenge friends to beat their score.

Features
--------

*   **Engaging Gameplay**: Receive cryptic clues about famous places and guess the destination
    
*   **Score Tracking**: Keep track of correct and incorrect answers
    
*   **Challenge System**: Challenge friends with a shareable link and custom image
    
    
*   **Rich Dataset**: 100+ destinations with unique clues, facts, and trivia
    

Tech Stack
----------

### Frontend

*   **React.js**: Component-based UI library
    
*   **React Router**: Client-side routing
    
*   **Framer Motion**: Smooth animations and transitions
    
*   **Tailwind CSS**: Utility-first styling
    
*   **Axios**: API requests
    
*   **HTML Canvas**: Dynamic image generation for challenges
    

### Backend

*   **Node.js**: JavaScript runtime
    
*   **Express**: Web framework
    
*   **MongoDB**: NoSQL database
    
*   **Mongoose**: MongoDB object modeling
    

Setup Instructions
------------------

### Prerequisites

*   Node.js (v14 or higher)
    
*   MongoDB (local instance or MongoDB Atlas)
    
*   npm or yarn
    

### Backend Setup

1.  git clone (https://github.com/chakri642/Globetrotter.git)
    
2.  cd servernpm install
    
3.  PORT=5001, MONGODB\_URI=your\_mongodb\_connection\_string
    
4.  npm run db:init
    
5.  npm run dev
    

### Frontend Setup

1.  cd ../client
    
2.  npm install
    
3.  REACT\_APP\_API\_URL=http://localhost:5001/api
    
4.  npm start
    
5.  Access the application at http://localhost:3000
    

Game Mechanics
--------------

1.  **Random Selection**: Destinations are randomly selected from the database
    
2.  **Clue Presentation**: 1-2 cryptic clues are shown to the player
    
3.  **Multiple Choice**: Player selects from 4 possible answers
    
4.  **Immediate Feedback**:
    
    *   Correct: Confetti animation + fun fact about the destination
        
    *   Incorrect: Sad face animation + correct answer revealed
        
5.  **Challenge Flow**: Players can create a challenge, which generates a unique link and image to share with friends
    

Key Implementation Details
--------------------------

### Challenge System

The challenge system generates unique invitation codes and creates shareable images on-the-fly using HTML Canvas. These images showcase the player's score and stats, creating a compelling invitation for friends to try to beat their score.

### API Routes

*   /api/destinations/random - Get random destination with clues
    
*   /api/game/check-answer - Validate user answers
    
*   /api/challenges/create - Create challenge invitation
    
*   /api/challenges/:inviteCode - Get challenge details
    

Design Choices
--------------

*   **Separation of Data**: All game data is stored and accessed from the backend to prevent client-side cheating
    
*   **Responsive Design**: Fully playable on mobile, tablet, and desktop
    
*   **Interactive UI**: Smooth animations and transitions enhance the user experience
    
*   **Scalable Architecture**: Designed to easily expand the dataset and add new features
    

License
-------

[MIT License](LICENSE)

_Explore the world from your screen with Globetrotter Challenge!_