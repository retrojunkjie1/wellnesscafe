import React, { useRef, createContext, useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./utils/ThemeContext";
import { AuthProvider } from "./AuthContext";
import Navbar from "./components/Navbar";
import NavigationButtons from "./components/NavigationButtons";
import FloatingAIWidget from "./components/FloatingAIWidget";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./Views/HomePage";
import Signup from "./features/auth/Signup";
import Recovery from "./Views/Recovery";
import Yoga from "./Views/Yoga";
import Acuwellness from "./Views/Acuwellness";
import Spiritual from "./Views/Spiritual";
import EventsPage from "./Views/EventsPage";
import AssistPage from "./Views/AssistPage";
import ProviderSignup from "./features/providers/ProviderSignup";
import ProviderDirectory from "./features/providers/ProviderDirectory";
import ProvidersPage from "./Views/ProvidersPage";
import BenefitsDetail from "./features/providers/BenefitsDetail";
import ExpectationsDetail from "./features/providers/ExpectationsDetail";
import TestimonialsDetail from "./features/providers/TestimonialsDetail";
import AboutPage from "./Views/AboutPage";
import StrategicInitiatives from "./features/providers/StrategicInitiatives";
import LeadershipPage from "./features/providers/LeadershipPage";
import ContactPage from "./features/providers/ContactPage";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import ProductPage from "./Views/ProductPage";
import ToolsPage from "./Views/ToolsPage";
import BreathingToolPage from "./Views/tools/BreathingToolPage";
import AuroraBreathing from "./features/recovery/tools/AuroraBreathing";
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
import BlogPage from "./Views/BlogPage";
import PrivacyPage from "./Views/PrivacyPage";
import TraumaEducationPage from "./Views/TraumaEducationPage";
import CareersPage from "./Views/CareersPage";
import FAQPage from "./Views/FAQPage";
import NewsPage from "./Views/NewsPage";
import NewsFeed from "./features/news/NewsFeed.jsx";
import ArticleReader from "./features/news/ArticleReader.jsx";
import ResourceDetail from "./Views/ResourceDetail";
import ProviderDashboard from "./features/providers/ProviderDashboard";
import AdminVerify from "./features/providers/AdminVerify";
import AdminImport from "./features/providers/AdminImport";
import SoberHomesState from "./Views/SoberHomesState";
import AdminUsers from "./features/admin/AdminUsers.jsx";
import AdminAssistants from "./features/admin/AdminAssistants.jsx";
import AssistantsPage from "./Views/AssistantsPage";
import CheckInPage from "./Views/CheckInPage";
import DevTools from "./components/DevTools";
import AuthDebug from "./components/AuthDebug";

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
            <Navbar />
            <NavigationButtons />
            <FloatingAIWidget ref={aiWidgetRef} />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute requireVerified>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/providers/dashboard"
                element={
                  <ProtectedRoute roles={["provider", "admin"]} requireVerified>
                    <ProviderDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/providers/dashboard/preview"
                element={<ProviderDashboard preview />}
              />
              <Route
                path="/providers/admin/import"
                element={
                  <ProtectedRoute roles={["admin", "provider"]} requireVerified>
                    <AdminImport />
                  </ProtectedRoute>
                }
              />
              <Route path="/providers" element={<ProvidersPage />} />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute roles={["admin"]} requireVerified>
                    <AdminUsers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/providers/admin/verify"
                element={
                  <ProtectedRoute roles={["admin"]} requireVerified>
                    <AdminVerify />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/assistants"
                element={
                  <ProtectedRoute roles={["admin"]} requireVerified>
                    <AdminAssistants />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/providers/directory"
                element={<ProviderDirectory />}
              />
              <Route path="/providers/apply" element={<ProviderSignup />} />
              <Route path="/providers/benefits" element={<BenefitsDetail />} />
              <Route
                path="/providers/expectations"
                element={<ExpectationsDetail />}
              />
              <Route
                path="/providers/testimonials"
                element={<TestimonialsDetail />}
              />
              <Route path="/recovery" element={<Recovery />} />
              <Route path="/yoga" element={<Yoga />} />
              <Route path="/acuwellness" element={<Acuwellness />} />
              <Route path="/spiritual" element={<Spiritual />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/assistance" element={<AssistPage />} />
              <Route path="/assistance/:slug" element={<ResourceDetail />} />
              <Route path="/product" element={<ProductPage />} />
              <Route
                path="/check-in"
                element={
                  <ProtectedRoute requireVerified>
                    <CheckInPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/tools" element={<ToolsPage />} />
              <Route path="/tools/breathing" element={<BreathingToolPage />} />
              <Route
                path="/tools/aurora-breathing"
                element={<AuroraBreathing />}
              />
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
              <Route
                path="/tools/gratitude-journal"
                element={
                  <ProtectedRoute requireVerified>
                    <GratitudeJournalPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tools/meditation-premium"
                element={
                  <ProtectedRoute requireVerified>
                    <MeditationTimerPremiumPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tools/emotion-tracker"
                element={
                  <ProtectedRoute requireVerified>
                    <EmotionTrackerPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tools/trigger-journal"
                element={
                  <ProtectedRoute requireVerified>
                    <TriggerJournalPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tools/weekly-review"
                element={
                  <ProtectedRoute requireVerified>
                    <WeeklyReviewPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tools/trigger-tracker"
                element={
                  <ProtectedRoute requireVerified>
                    <TriggerTrackerPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tools/mood-checkin"
                element={
                  <ProtectedRoute requireVerified>
                    <MoodCheckInPage />
                  </ProtectedRoute>
                }
              />
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
              <Route
                path="/dev-tools"
                element={
                  <ProtectedRoute roles={["admin"]} requireVerified>
                    <DevTools />
                  </ProtectedRoute>
                }
              />
              <Route path="/auth-debug" element={<AuthDebug />} />
            </Routes>
          </Router>
        </AIWidgetContext.Provider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
