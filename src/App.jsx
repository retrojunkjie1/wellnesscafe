import React, { createContext, useContext, useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { ThemeProvider } from "./utils/ThemeContext";
import { AuthProvider } from "./AuthContext";

// New Route Guards
import ProtectedRoute from './components/access/ProtectedRoute.jsx';
import PremiumRoute from './components/access/PremiumRoute.jsx';
import ProviderRoute from './components/access/ProviderRoute.jsx';
import AdminRoute from './components/access/AdminRoute.jsx';

// Component & Page Imports
import LuxuryNavbar from "./components/LuxuryNavbar";
import NavigationButtons from "./components/NavigationButtons";
import FloatingAIWidget from "./components/FloatingAIWidget";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import DevTools from "./components/DevTools";
import AuthDebug from "./components/AuthDebug";

import HomePage from "./Views/HomePage";
import Recovery from "./Views/Recovery";
import Yoga from "./Views/Yoga";
import Acuwellness from "./Views/Acuwellness";
import Spiritual from "./Views/Spiritual";
import EventsPage from "./Views/EventsPage";
import AssistPage from "./Views/AssistPage";
import ProvidersPage from "./Views/ProvidersPage";
import AboutPage from "./Views/AboutPage";
import ProductPage from "./Views/ProductPage";
import ToolsPage from "./Views/ToolsPage";
import BlogPage from "./Views/BlogPage";
import PrivacyPage from "./Views/PrivacyPage";
import TraumaEducationPage from "./Views/TraumaEducationPage";
import CareersPage from "./Views/CareersPage";
import FAQPage from "./Views/FAQPage";
import NewsPage from "./Views/NewsPage";
import ResourceDetail from "./Views/ResourceDetail";
import SoberHomesState from "./Views/SoberHomesState";
import AssistantsPage from "./Views/AssistantsPage";
import CheckInPage from "./Views/CheckInPage";

// Feature-specific Imports
import Signup from "./features/auth/Signup";
import ProviderDashboard from "./features/providers/ProviderDashboard";
import ProviderSignup from "./features/providers/ProviderSignup";
import ProviderDirectory from "./features/providers/ProviderDirectory";
import BenefitsDetail from "./features/providers/BenefitsDetail";
import ExpectationsDetail from "./features/providers/ExpectationsDetail";
import TestimonialsDetail from "./features/providers/TestimonialsDetail";
import StrategicInitiatives from "./features/providers/StrategicInitiatives";
import LeadershipPage from "./features/providers/LeadershipPage";
import ContactPage from "./features/providers/ContactPage";
import AdminVerify from "./features/providers/AdminVerify";
import AdminImport from "./features/providers/AdminImport";
import AuroraBreathing from "./features/recovery/tools/AuroraBreathing";
import NewsFeed from "./features/news/NewsFeed.jsx";
import ArticleReader from "./features/news/ArticleReader.jsx";
import AdminAssistants from "./features/admin/AdminAssistants.jsx";

// Tool Pages
import MeditationTimerPage from "./Views/tools/MeditationTimerPage";
import AffirmationsGeneratorPage from "./Views/tools/AffirmationsGeneratorPage";
import StressAssessmentPage from "./Views/tools/StressAssessmentPage";
import TriggerTrackerPage from "./Views/tools/TriggerTrackerPage";
import MoodCheckInPage from "./Views/tools/MoodCheckInPage";
import GratitudeJournalPage from "./Views/tools/GratitudeJournalPage";
import MeditationTimerPremiumPage from "./Views/tools/MeditationTimerPremiumPage";
import EmotionTrackerPage from "./Views/tools/EmotionTrackerPage";
import TriggerJournalPage from "./Views/tools/TriggerJournalPage";
import WeeklyReviewPage from "./Views/tools/WeeklyReviewPage";

// New Premium/Admin Pages
import Upgrade from "./pages/Upgrade.jsx";
import AuroraDashboard from "./pages/premium/AuroraDashboard.jsx";
import UsersAdmin from "./pages/admin/UsersAdmin.jsx";

// Wellness Sessions (Milestone 4)
import SessionTemplates from "./features/wellness-sessions/SessionTemplates.jsx";
import ActiveSession from "./features/wellness-sessions/ActiveSession.jsx";

// Create context for AI Widget control
const AIWidgetContext = createContext(null);

export const useAIWidget = () => {
  const context = useContext(AIWidgetContext);
  if (!context) {
    console.warn("useAIWidget must be used within AIWidgetContext provider");
  }
  return context;
};

function App() {
  const aiWidgetRef = useRef(null);

  return (
    <AuthProvider>
      <ThemeProvider>
        <AIWidgetContext.Provider value={aiWidgetRef}>
          <Router>
            <LuxuryNavbar />
            <NavigationButtons />
            <FloatingAIWidget ref={aiWidgetRef} />
            <Routes>
              {/* Core & Auth Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/upgrade" element={<Upgrade />} />

              {/* USER-PROTECTED ROUTES */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/check-in"
                element={
                  <ProtectedRoute>
                    <CheckInPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tools/gratitude-journal"
                element={
                  <ProtectedRoute>
                    <GratitudeJournalPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tools/meditation-premium"
                element={
                  <ProtectedRoute>
                    <MeditationTimerPremiumPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tools/emotion-tracker"
                element={
                  <ProtectedRoute>
                    <EmotionTrackerPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tools/trigger-journal"
                element={
                  <ProtectedRoute>
                    <TriggerJournalPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tools/weekly-review"
                element={
                  <ProtectedRoute>
                    <WeeklyReviewPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tools/trigger-tracker"
                element={
                  <ProtectedRoute>
                    <TriggerTrackerPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tools/mood-checkin"
                element={
                  <ProtectedRoute>
                    <MoodCheckInPage />
                  </ProtectedRoute>
                }
              />

              {/* PREMIUM-PROTECTED ROUTES */}
              <Route
                path="/aurora"
                element={
                  <PremiumRoute>
                    <AuroraDashboard />
                  </PremiumRoute>
                }
              />

              {/* PROVIDER-PROTECTED ROUTES */}
              <Route
                path="/providers/dashboard"
                element={
                  <ProviderRoute>
                    <ProviderDashboard />
                  </ProviderRoute>
                }
              />

              {/* ADMIN-PROTECTED ROUTES */}
              <Route
                path="/admin/users"
                element={
                  <AdminRoute>
                    <UsersAdmin />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/assistants"
                element={
                  <AdminRoute>
                    <AdminAssistants />
                  </AdminRoute>
                }
              />
              <Route
                path="/providers/admin/verify"
                element={
                  <AdminRoute>
                    <AdminVerify />
                  </AdminRoute>
                }
              />
              <Route
                path="/providers/admin/import"
                element={
                  <AdminRoute>
                    <AdminImport />
                  </AdminRoute>
                }
              />
              <Route
                path="/dev-tools"
                element={
                  <AdminRoute>
                    <DevTools />
                  </AdminRoute>
                }
              />

              {/* Provider Public Routes */}
              <Route path="/providers" element={<ProvidersPage />} />
              <Route path="/providers/apply" element={<ProviderSignup />} />
              <Route
                path="/providers/directory"
                element={<ProviderDirectory />}
              />
              <Route path="/providers/benefits" element={<BenefitsDetail />} />
              <Route
                path="/providers/expectations"
                element={<ExpectationsDetail />}
              />
              <Route
                path="/providers/testimonials"
                element={<TestimonialsDetail />}
              />

              {/* Content & Info Pages */}
              <Route path="/recovery" element={<Recovery />} />
              <Route path="/yoga" element={<Yoga />} />
              <Route path="/acuwellness" element={<Acuwellness />} />
              <Route path="/spiritual" element={<Spiritual />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/assistance" element={<AssistPage />} />
              <Route path="/assistance/:slug" element={<ResourceDetail />} />
              <Route path="/product" element={<ProductPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route
                path="/trauma-education"
                element={<TraumaEducationPage />}
              />
              <Route path="/about" element={<AboutPage />} />
              <Route
                path="/about/strategic-initiatives"
                element={<StrategicInitiatives />}
              />
              <Route path="/about/leadership" element={<LeadershipPage />} />
              <Route path="/about/contact" element={<ContactPage />} />
              <Route path="/about/privacy" element={<PrivacyPage />} />
              <Route path="/about/careers" element={<CareersPage />} />
              <Route path="/about/faq" element={<FAQPage />} />
              <Route path="/about/news" element={<NewsPage />} />
              <Route path="/news" element={<NewsFeed />} />
              <Route path="/news/read" element={<ArticleReader />} />
              <Route path="/assistants/:type" element={<AssistantsPage />} />
              <Route
                path="/resources/soberLivingHomes/:state"
                element={<SoberHomesState />}
              />

              {/* Public Tools */}
              <Route path="/tools" element={<ToolsPage />} />
              <Route path="/tools/breathing" element={<AuroraBreathing />} />
              <Route
                path="/tools/meditation"
                element={<MeditationTimerPage />}
              />
              <Route
                path="/tools/affirmations"
                element={<AffirmationsGeneratorPage />}
              />
              <Route
                path="/tools/stress-assessment"
                element={<StressAssessmentPage />}
              />

              {/* Wellness Sessions (Milestone 4) */}
              <Route path="/sessions/templates" element={<SessionTemplates />} />
              <Route path="/sessions/active" element={<ActiveSession />} />

              {/* Debug */}
              <Route path="/auth-debug" element={<AuthDebug />} />
            </Routes>
          </Router>
        </AIWidgetContext.Provider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
