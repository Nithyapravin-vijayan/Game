import React, { useState } from 'react';
import GameBoard from './components/GameBoard';
import Card from './components/Card';
import './App.css';

const Modal = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <Card>
        <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Game Over</h2>
        <p className="font-normal text-gray-700 dark:text-gray-400">{message}</p>
        <button
          onClick={onClose}
          className="mt-4 px-5 py-2.5 bg-blue-500 text-white rounded-lg font-medium text-sm hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          Close
        </button>
      </Card>
    </div>
  );
};

function App() {
  const [gameOver, setGameOver] = useState(false); // Track game over state
  const [message, setMessage] = useState(''); // Message for the modal
  const [reset, setReset] = useState(false); // Reset state for GameBoard

  const handleGameOver = (msg) => {
    setMessage(msg);
    setGameOver(true);
  };

  const resetGame = () => {
    setGameOver(false); // Reset game over state
    setMessage(''); // Clear message
    setReset(true); // Trigger reset on GameBoard
    setTimeout(() => setReset(false), 0); // Reset the trigger to allow future resets
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl  font-bold mb-4">Two Player Box Game</h1>

      <GameBoard onGameOver={handleGameOver} reset={reset} />

      {gameOver && (
        <Modal message={message} onClose={() => setGameOver(false)} />
      )}

    </div>
  );
}

export default App;
