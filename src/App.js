import React, { useState, useEffect } from 'react';
import './App.css';

const Circle = ({ number, onClick, position, color }) => {
    return (
        <div
            className="circle "
            style={{ top: position.y, left: position.x, backgroundColor: color }}
            onClick={onClick}
        >
            {number}
        </div>
    );
};

const getRandomPosition = () => {
    const x = Math.floor(Math.random() * 90) + '%';
    const y = Math.floor(Math.random() * 90) + '%';
    return { x, y };
};

const App = () => {
    const [circles, setCircles] = useState([]);
    const [points, setPoints] = useState(0);
    const [time, setTime] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [allClear, setAllClear] = useState(false);
    const [inputPoints, setInputPoints] = useState('');
    const [targetPoints, setTargetPoints] = useState(0);
    const [timer, setTimer] = useState(null);

    useEffect(() => {
        if (targetPoints > 0) {
            const initialCircles = Array.from({ length: targetPoints }, (_, i) => ({
                number: i + 1,
                position: getRandomPosition(),
                color: 'white',
            }));
            setCircles(initialCircles);
            if (timer) clearInterval(timer);
            setTimer(setInterval(() => setTime((prev) => prev + 0.1), 100));
        }
        return () => {
            if (timer) clearInterval(timer);
        };
    }, [targetPoints]);

    const handleCircleClick = (number) => {
        if (number !== points + 1) {
            setGameOver(true);
            clearInterval(timer);
        } else {
            setPoints((prev) => prev + 1);
            setCircles((prev) =>
                prev.map((circle) =>
                    circle.number === number
                        ? { ...circle, color: 'red' }
                        : circle
                )
            );

            setTimeout(() => {
                setCircles((prev) => prev.filter((circle) => circle.number !== number));
            }, 1000);

            setTimeout(() => {
                if (number === targetPoints) {
                    setAllClear(true);
                    setGameOver(false);
                    clearInterval(timer);
                }
            }, 1000)

        }
    };

    const handleRestart = () => {
        const parsedPoints = parseInt(inputPoints);
        if (!isNaN(parsedPoints) && parsedPoints > 0) {
            setTargetPoints(parsedPoints);
            setGameOver(false);
            setPoints(0);
            setTime(0);
            setAllClear(false);
        }
    };

    const handleStartGame = () => {
        const parsedPoints = parseInt(inputPoints);
        if (!isNaN(parsedPoints) && parsedPoints > 0) {
            setTargetPoints(parsedPoints);
            setGameOver(false);
            setPoints(0);
            setTime(0);
            setAllClear(false);
        }
    };

    return (
        <div className="App">
            <div className='text-container'>
                {gameOver && <h1 style={{ color: 'red' }}>GAME OVER</h1>}
                {!gameOver && !allClear && <h1>LET'S PLAY</h1>}
                {allClear && <h1 style={{ color: 'green' }}>ALL CLEARED</h1>}
                <div>
                    Points:
                    <input
                        type="number"
                        value={inputPoints}
                        onChange={(e) => setInputPoints(e.target.value)}
                        className='input-points '
                    />
                </div>
                <div>
                    Time: <span className='p-time'>{time.toFixed(1)}s</span>
                </div>
                <div className="button-container">
                    {targetPoints === 0 ? (
                        <>
                            <button className='btn' onClick={handleStartGame}>Play</button>
                        </>
                    ) : (
                        <button onClick={handleRestart}>Restart</button>
                    )}
                </div>
            </div>
            <div className="game-board">
                {circles.map((circle) => (
                    <Circle
                        key={circle.number}
                        number={circle.number}
                        onClick={() => handleCircleClick(circle.number)}
                        position={circle.position}
                        color={circle.color}
                    />
                ))}
            </div>
        </div>
    );
};

export default App;
