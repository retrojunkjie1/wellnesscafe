
// src/Views/HomePage.js
import React, {useState} from 'react';
import './HomePage.css';

const HomePage = () => {
    const [colorMode, setColorMode] = useState('calm');

    const toggleColor = () => {
        setColorMode(prev => prev === 'calm' ? 'energy' : 'calm');
    };

    return (
        <div className={`wellcafe-homepage ${colorMode}`}>
            <h1>Welcome to WellnessCafe</h1>
            <h1>Find Personal Coach</h1>
            <p>Experience a smarter way to relax, recover, and reconnect—powered by AI wellness intelligence.</p>

            <div className={`wellcafe-box ${colorMode}`}></div>
            
            <button className="wellcafe-button" onClick={toggleColor}>
                Switch Mood
            </button>
        </div>
    );
};

export default HomePage;
