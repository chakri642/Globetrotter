import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Pages
import HomePage from './pages/HomePage';
import GamePage from './pages/GamePage';
import ShareChallengePage from './pages/ShareChallengePage';
import ChallengePage from './pages/ChallengePage';
import NotFoundPage from './pages/NotFoundPage';
import './index.css';

// Main App Component
function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/play" element={<GamePage />} />
          <Route path="/share/:inviteCode" element={<ShareChallengePage />} />
          <Route path="/challenge/:inviteCode" element={<ChallengePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;