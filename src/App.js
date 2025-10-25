// src/App.js
import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

import Layout from './components/Layout';
import HomePage from './Views/HomePage';
import ProductPage from './Views/ProductPage';
import ToolsPage from './Views/ToolsPage';
import EventsPage from './Views/EventsPage';
import SpiritualPage from './Views/SpiritualPage';
import BlogPage from './Views/BlogPage';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Layout theme="home"><HomePage /></Layout>} />
      <Route path="/product" element={<Layout theme="product"><ProductPage /></Layout>} />
      <Route path="/tools" element={<Layout theme="tools"><ToolsPage /></Layout>} />
      <Route path="/events" element={<Layout theme="events"><EventsPage /></Layout>} />
      <Route path="/spiritual" element={<Layout theme="spiritual"><SpiritualPage /></Layout>} />
      <Route path="/blog" element={<Layout theme="blog"><BlogPage /></Layout>} />
    </Routes>
  </Router>
);

export default App;
