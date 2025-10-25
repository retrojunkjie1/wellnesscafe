import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './Views/HomePage';
import ProductPage from './Views/ProductPage';
import PricingPage from './Views/PricingPage';
import CompanyPage from './Views/CompanyPage';
import BlogPage from './Views/BlogPage';
import ChangelogPage from './Views/ChangelogPage';
import EventsPage from './Views/EventsPage';
import ToolsPage from './Views/ToolsPage';
import SpiritualPage from './Views/SpiritualPage';
import AssistPage from './Views/AssistPage';
import AboutPage from './Views/AboutPage';
import PrivacyPage from './Views/PrivacyPage';
import NotFoundPage from './Views/NotFoundPage';
import TraumaEducationPage from './Views/TraumaEducationPage';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/company" element={<CompanyPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/changelog" element={<ChangelogPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/tools" element={<ToolsPage />} />
          <Route path="/spiritual" element={<SpiritualPage />} />
          <Route path="/assist" element={<AssistPage />} />
          <Route path="/trauma-education" element={<TraumaEducationPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
