import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
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

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <ThemeProvider>
          <Router>
            <Navbar />
            <NavigationButtons />
            <FloatingAIWidget />
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
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/trauma-education" element={<TraumaEducationPage />} />
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
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
