
// src/Views/HomePage.js
import React, { useState } from 'react';
import './HomePage.css';

// Use the consolidated Header component from src/components
import Header from '../components/Header';

const HomePage = () => {
    const [colorMode, setColorMode] = useState('calm');

    const toggleColor = () => {
        setColorMode((prev) => (prev === 'calm' ? 'energy' : 'calm'));
    };

        return (
            <div className={`wellcafe-homepage ${colorMode}`}>
                <Header />
                <main className="homepage-content">
                    <p>Welcome to WellnessCafe — your curated place for calm & clarity.</p>
                    <button className="theme-toggle" onClick={toggleColor}>
                        Toggle theme
                    </button>
                </main>
            </div>
        );
};

export default HomePage;
