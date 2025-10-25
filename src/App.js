// src/App.js
import React from 'react';
import logo from './logo.svg'; // replace with your actual logo if you have one (e.g. './Logo512.png')
import './App.css';
import HomePage from './Views/HomePage';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="Wellcafeland logo" />
        <p>
          Welcome to <strong>WellnessCafe AI</strong> — your digital space for
          mindfulness, balance, and intelligent recovery.
        </p>
        <a
          className="App-link"
          href="https://wellnesscafelanding.web.app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Visit Live Site
        </a>
      </header>
      <HomePage />
    </div>
  );
}

export default App;
