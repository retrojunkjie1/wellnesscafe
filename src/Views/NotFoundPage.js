import React from 'react';
import './Page.css';
import Header from '../components/Header';

const NotFoundPage = () => (
  <div className="page">
    <Header />
    <main className="container">
      <div className="page-hero">
        <h1>404</h1>
        <p>We couldn’t find that page. Try the links above.</p>
      </div>
    </main>
  </div>
);

export default NotFoundPage;
