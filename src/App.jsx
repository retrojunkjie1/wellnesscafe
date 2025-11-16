import React, { createContext, useContext, useRef, Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { ThemeProvider } from "./utils/ThemeContext";
import { AuthProvider } from "./AuthContext";

// New Route Guards (keep these as static - small and critical)
import ProtectedRoute from "./components/access/ProtectedRoute.jsx";
import PremiumRoute from "./components/access/PremiumRoute.jsx";
import ProviderRoute from "./components/access/ProviderRoute.jsx";
import AdminRoute from "./components/access/AdminRoute.jsx";

// Core UI Components (keep as static - always needed)
import LuxuryNavbar from "./components/LuxuryNavbar";
import NavigationButtons from "./components/NavigationButtons";
import FloatingAIWidget from "./components/FloatingAIWidget";
import Login from "./components/Login";

// Lazy-loaded heavy components
const Dashboard = lazy(() => import("./components/Dashboard"));
const DevTools = lazy(() => import("./components/DevTools"));
const AuthDebug = lazy(() => import("./components/AuthDebug"));

// Lazy-loaded Views
const HomePage = lazy(() => import("./Views/HomePage"));
const Recovery = lazy(() => import("./Views/Recovery"));
const Yoga = lazy(() => import("./Views/Yoga"));
const Acuwellness = lazy(() => import("./Views/Acuwellness"));
const Spiritual = lazy(() => import("./Views/Spiritual"));
const EventsPage = lazy(() => import("./Views/EventsPage"));
const AssistPage = lazy(() => import("./Views/AssistPage"));
const ProvidersPage = lazy(() => import("./Views/ProvidersPage"));
const AboutPage = lazy(() => import("./Views/AboutPage"));
const ProductPage = lazy(() => import("./Views/ProductPage"));
const ToolsPage = lazy(() => import("./Views/ToolsPage"));
const BlogPage = lazy(() => import("./Views/BlogPage"));
const PrivacyPage = lazy(() => import("./Views/PrivacyPage"));
const TraumaEducationPage = lazy(() => import("./Views/TraumaEducationPage"));
const CareersPage = lazy(() => import("./Views/CareersPage"));
const FAQPage = lazy(() => import("./Views/FAQPage"));
const NewsPage = lazy(() => import("./Views/NewsPage"));
const ResourceDetail = lazy(() => import("./Views/ResourceDetail"));
const SoberHomesState = lazy(() => import("./Views/SoberHomesState"));
const AssistantsPage = lazy(() => import("./Views/AssistantsPage"));
const CheckInPage = lazy(() => import("./Views/CheckInPage"));

// Lazy-loaded Feature components
const Signup = lazy(() => import("./features/auth/Signup"));
const ProviderDashboard = lazy(() => import("./features/providers/ProviderDashboard"));
const ProviderSignup = lazy(() => import("./features/providers/ProviderSignup"));
const ProviderDirectory = lazy(() => import("./features/providers/ProviderDirectory"));
const BenefitsDetail = lazy(() => import("./features/providers/BenefitsDetail"));
const ExpectationsDetail = lazy(() => import("./features/providers/ExpectationsDetail"));
const TestimonialsDetail = lazy(() => import("./features/providers/TestimonialsDetail"));
const StrategicInitiatives = lazy(() => import("./features/providers/StrategicInitiatives"));
const LeadershipPage = lazy(() => import("./features/providers/LeadershipPage"));
const ContactPage = lazy(() => import("./features/providers/ContactPage"));
const AdminVerify = lazy(() => import("./features/providers/AdminVerify"));
const AdminImport = lazy(() => import("./features/providers/AdminImport"));
const AuroraBreathing = lazy(() => import("./features/recovery/tools/AuroraBreathing"));
const NewsFeed = lazy(() => import("./features/news/NewsFeed.jsx"));
const ArticleReader = lazy(() => import("./features/news/ArticleReader.jsx"));
const AdminAssistants = lazy(() => import("./features/admin/AdminAssistants.jsx"));

// Lazy-loaded Tool Pages
const MeditationTimerPage = lazy(() => import("./Views/tools/MeditationTimerPage"));
const AffirmationsGeneratorPage = lazy(() => import("./Views/tools/AffirmationsGeneratorPage"));
const StressAssessmentPage = lazy(() => import("./Views/tools/StressAssessmentPage"));
const TriggerTrackerPage = lazy(() => import("./Views/tools/TriggerTrackerPage"));
const MoodCheckInPage = lazy(() => import("./Views/tools/MoodCheckInPage"));
const GratitudeJournalPage = lazy(() => import("./Views/tools/GratitudeJournalPage"));
const MeditationTimerPremiumPage = lazy(() => import("./Views/tools/MeditationTimerPremiumPage"));
const EmotionTrackerPage = lazy(() => import("./Views/tools/EmotionTrackerPage"));
const TriggerJournalPage = lazy(() => import("./Views/tools/TriggerJournalPage"));
const WeeklyReviewPage = lazy(() => import("./Views/tools/WeeklyReviewPage"));

// Lazy-loaded Premium/Admin Pages
const Upgrade = lazy(() => import("./pages/Upgrade.jsx"));
const AuroraDashboard = lazy(() => import("./pages/premium/AuroraDashboard.jsx"));
const UsersAdmin = lazy(() => import("./pages/admin/UsersAdmin.jsx"));

// Lazy-loaded Wellness Sessions (AI-heavy)
const SessionTemplates = lazy(() => import("./features/wellness-sessions/SessionTemplates.jsx"));
const ActiveSession = lazy(() => import("./features/wellness-sessions/ActiveSession.jsx"));

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
      <p className="text-slate-600">Loading...</p>
    </div>
  </div>
);

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
            <Suspense fallback={<LoadingFallback />}>
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
            </Suspense>
          </Router>
        </AIWidgetContext.Provider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
