import React, { useState, useEffect } from 'react';

const initialBoxState = Array(10).fill(null);

const GameBoard = ({ onGameOver }) => {
    const [boxes, setBoxes] = useState(initialBoxState);
    const [player1Pos, setPlayer1Pos] = useState(4);
    const [player2Pos, setPlayer2Pos] = useState(5);
    const [currentPlayer, setCurrentPlayer] = useState(1);
    const [turnCount, setTurnCount] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [distanceMessage, setDistanceMessage] = useState(''); // New state for the distance message

    useEffect(() => {
        if (!gameOver) {
            setShowModal(true);
        }
    }, [currentPlayer, gameOver]);

    const handleMove = (stay) => {
        let newPlayer1Pos = player1Pos;
        let newPlayer2Pos = player2Pos;

        if (currentPlayer === 1) {
            if (!stay && player1Pos > 0) {
                newPlayer1Pos = player1Pos - 1;
                setPlayer1Pos(newPlayer1Pos);
            }
            setCurrentPlayer(2);
        } else {
            if (!stay && player2Pos < 9) {
                newPlayer2Pos = player2Pos + 1;
                setPlayer2Pos(newPlayer2Pos);
            }
            setCurrentPlayer(1);
        }

        const newBoxes = [...boxes];
        if (newPlayer1Pos === newPlayer2Pos) {
            newBoxes[newPlayer1Pos] = 'both';
        } else {
            newBoxes[newPlayer1Pos] = newBoxes[newPlayer1Pos] === 'player2' ? 'both' : 'player1';
            newBoxes[newPlayer2Pos] = newBoxes[newPlayer2Pos] === 'player1' ? 'both' : 'player2';
        }
        setBoxes(newBoxes);

        const newTurnCount = turnCount + 1;
        setTurnCount(newTurnCount);
        if (newTurnCount >= 5) {
            const distance = Math.abs(newPlayer1Pos - newPlayer2Pos);
            console.log(`Player 1 Position: ${newPlayer1Pos}, Player 2 Position: ${newPlayer2Pos}, Distance: ${distance}`);
            setGameOver(true);
            setShowModal(false); // Hide the turn modal when the game is over
            setDistanceMessage(`Distance between players: ${distance} boxes.`);
            onGameOver(`Distance between players: ${distance} boxes.`);
        }
    };

    const handlePlayerDecision = (stay) => {
        handleMove(stay);
        setShowModal(false);
    };

    const resetGame = () => {
        setBoxes(initialBoxState);
        setPlayer1Pos(4);
        setPlayer2Pos(5);
        setCurrentPlayer(1);
        setTurnCount(0);
        setShowModal(false);
        setGameOver(false);
        setDistanceMessage(''); // Reset the distance message
    };

    return (
        <div>
            <div id="game-board" className="flex flex-row space-x-2 mb-4">
                {boxes.map((box, index) => (
                    <div
                        key={index}
                        className={`box 
                                ${index === 4 ? 'center-box' : ''} 
                                ${index === player1Pos ? 'player1-box animate-move' : ''} 
                                ${index === player2Pos ? 'player2-box animate-move' : ''}
                                ${box === 'player1' ? 'player1-visited' : ''}
                                ${box === 'player2' ? 'player2-visited' : ''}
                                ${box === 'both' ? 'both-visited' : ''}
                            `}
                    >
                        {index === player1Pos && '←'}
                        {index === player2Pos && '→'}
                    </div>
                ))}
            </div>

            {/* Turn Modal */}
            {showModal && !gameOver && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Player {currentPlayer}, do you want to stay in your current box?</h3>
                        <div className="flex space-x-4 justify-center">
                            <button onClick={() => handlePlayerDecision(true)} className="yes-button">Yes</button>
                            <button onClick={() => handlePlayerDecision(false)} className="no-button">No</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Game Over Modal */}
            {gameOver && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Game Over</h3>
                        <p>{distanceMessage}</p> {/* Show the distance message */}
                        <p>The game has ended. Would you like to start a new game?</p>
                        <button onClick={resetGame} className="reset-button">New Game</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GameBoard;
