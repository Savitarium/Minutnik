import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';

const REST_TIME = 20;
const WORK_TIME = 60 * 20;

function App() {
    const [status, setStatus] = useState('off');
    const [time, setTime] = useState(0);
    const [initialTime, setInitialTime] = useState(0);
    const [intervalId, setIntervalId] = useState(null);

    const startInterval = (newTime) => {
        clearInterval(intervalId);
        const id = setInterval(() => {
            setTime(prevTime => prevTime - 1);
        }, 1000);
        setIntervalId(id);
        setTime(newTime);
    };


    const startTimer = () => {
        setStatus('work');
        if (initialTime === 0) {
            startInterval(WORK_TIME);
        } else {
            startInterval(initialTime);
            setInitialTime(0);
        }
    };

    const stopTimer = () => {
        setStatus('off');
        if (intervalId !== null) {
            clearInterval(intervalId);
            setIntervalId(null);
        }
        setTime(0);
        setInitialTime(WORK_TIME);
    };

    const closeApp = () => {
        window.close();
    };

    const formatTime = () => {
        const minutes = Math.floor(time / 60).toString().padStart(2, '0');
        const seconds = (time % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    };

    useEffect(() => {
        if (status === 'work' && time === 0) {
            clearInterval(intervalId);
            setStatus('rest');
            startInterval(REST_TIME);
        } else if (status === 'rest' && time === 0) {
            clearInterval(intervalId);
            setStatus('work');
            startInterval(WORK_TIME);
        }
    }, [status, time]);

    useEffect(() => {
        if (initialTime !== 0) {
            clearInterval(intervalId);
            startInterval(initialTime);
        } else if (status === 'rest') {
            clearInterval(intervalId);
            startInterval(REST_TIME);
        }
    }, [initialTime, status]);

    const handleBtnClick = () => {
        if (status === 'off') {
            startTimer();
        } else {
            stopTimer();
        }
    };

    return (
        <div>
            <h1>Protect your eyes</h1>
            {status === 'off' && (
                <div>
                    <p>
                        According to optometrists in order to save your eyes, you should follow the 20/20/20. It means you should to
                        rest your eyes every 20 minutes for 20 seconds by looking more than 20 feet away.
                    </p>
                    <p>This app will help you track your time and inform you when it's time to rest.</p>
                </div>
            )}
            {status === 'work' && <img src="./images/work.png" alt="Work" />}
            {status === 'rest' && <img src="./images/rest.png" alt="Rest" />}
            {status !== 'off' && <div className="timer">{formatTime()}</div>}
            {status === 'off' && (
                <button className="btn" onClick={handleBtnClick}>
                    Start
                </button>
            )}
            {status !== 'off' && (
                <button className="btn" onClick={handleBtnClick}>
                    Stop
                </button>
            )}
            <button className="btn btn-close" onClick={closeApp}>
                X
            </button>
        </div>
    );
}

render(<App />, document.querySelector('#app'));
