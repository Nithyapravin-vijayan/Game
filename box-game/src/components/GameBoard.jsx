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
    const [distanceMessage, setDistanceMessage] = useState('');
    const [player1QuestionCount, setPlayer1QuestionCount] = useState(0);
    const [player2QuestionCount, setPlayer2QuestionCount] = useState(0);
    const [player1Visited, setPlayer1Visited] = useState(new Set([4]));
    const [player2Visited, setPlayer2Visited] = useState(new Set([5]));

    useEffect(() => {
        if (!gameOver && (player1QuestionCount < 5 || player2QuestionCount < 5)) {
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
                setPlayer1Visited(new Set(player1Visited).add(newPlayer1Pos));
            }
            setPlayer1QuestionCount(player1QuestionCount + 1);
            setCurrentPlayer(2);
        } else {
            if (!stay && player2Pos < 9) {
                newPlayer2Pos = player2Pos + 1;
                setPlayer2Pos(newPlayer2Pos);
                setPlayer2Visited(new Set(player2Visited).add(newPlayer2Pos));
            }
            setPlayer2QuestionCount(player2QuestionCount + 1);
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

        if (player1QuestionCount + player2QuestionCount >= 9) { // Total 10 questions
            const distance = calculateVisitedDistance();
            console.log(`Distance between visited boxes: ${distance}`);
            setGameOver(true);
            setShowModal(false);
            setDistanceMessage(`Distance between visited boxes: ${distance} boxes.`);
            onGameOver(`Distance between visited boxes: ${distance} boxes.`);
        }
    };

    const calculateVisitedDistance = () => {
        // Combine visited boxes of both players into a single set, excluding current positions
        const uniqueVisitedBoxes = new Set([
            ...Array.from(player1Visited).filter(pos => pos !== player1Pos),
            ...Array.from(player2Visited).filter(pos => pos !== player2Pos),
        ]);

        return uniqueVisitedBoxes.size; // Total count of unique visited boxes
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
        setDistanceMessage('');
        setPlayer1QuestionCount(0);
        setPlayer2QuestionCount(0);
        setPlayer1Visited(new Set([4]));
        setPlayer2Visited(new Set([5]));
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
                        <p>{distanceMessage}</p>
                        <p>The game has ended. Would you like to start a new game?</p>
                        <button onClick={resetGame} className="reset-button">New Game</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GameBoard;
