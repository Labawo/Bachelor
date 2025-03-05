import './Game.css';
import * as ReactDOMClient from 'react-dom/client';
import React, { useEffect, useRef, useState } from 'react';
import GameController from '../controller/GameController';

// Main game UI
export default function GameBoard() {
    const canvasRoot = useRef(null);
    const canvasRef = useRef();
    const [scoreBoard, setScoreBoard] = useState(0);
    const [level, setLevel] = useState(1);
    const [gameOver, setGameOver] = useState(false);

    useEffect(() => {
        const canvasElement = canvasRef.current;

        if (canvasRoot.current === null) {
            // To avoid creating root multiple times
            canvasRoot.current = ReactDOMClient.createRoot(canvasElement);
        }

        // Initiating game controller and starting the game per page load
        const gameController = new GameController(canvasRoot.current, canvasElement, setScoreBoard, setLevel, setGameOver);
        gameController.startGame();
        return () => {
            // Resetting game controller per unmount
            gameController.stopGame();
        }
    }, [setScoreBoard, setLevel, setGameOver]);

    return (
        <div>
            <div className='gameBoardContainer'>
                <div className='scoreContainer'>
                    <div>SCORE</div>
                    <div>{scoreBoard}</div>
                    <div>Level</div>
                    <div>{level}</div>
                </div>
                <div className='canvasContainer'>
                    <div ref={canvasRef}>
                    </div>
                </div>
                <div className='footNote'>* Press space to pause/resume</div>
            </div>
            {gameOver &&
                <div className='gameOverContainer'>
                    Game Over!
                </div>
            }
        </div>
    );
}