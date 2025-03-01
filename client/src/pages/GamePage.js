import React from 'react';
import Game from '../components/Game';

const GamePage = () => {
  return (
    <div className="game-page">
      <Game challengeMode={false} />
    </div>
  );
};

export default GamePage;