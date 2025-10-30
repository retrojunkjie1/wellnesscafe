import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./utils/ThemeContext";
import { AuthProvider } from "./AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./Views/HomePage";
import Signup from "./features/auth/Signup";
import Recovery from "./Views/Recovery";
import Yoga from "./Views/Yoga";
import Acuwellness from "./Views/Acuwellness";
import Spiritual from "./Views/Spiritual";
import Events from "./Views/Events";
import Assistance from "./Views/Assistance";
import ProviderSignup from "./features/providers/ProviderSignup";
import ProviderDirectory from "./features/providers/ProviderDirectory";
import BenefitsDetail from "./features/providers/BenefitsDetail";
import ExpectationsDetail from "./features/providers/ExpectationsDetail";
import TestimonialsDetail from "./features/providers/TestimonialsDetail";
import AboutPage from "./Views/AboutPage";
import StrategicInitiatives from "./features/providers/StrategicInitiatives";
import LeadershipPage from "./features/providers/LeadershipPage";
import ContactPage from "./features/providers/ContactPage";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/providers" element={<ProviderDirectory />} />
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
            <Route path="/events" element={<Events />} />
            <Route path="/assistance" element={<Assistance />} />
            <Route path="/about" element={<AboutPage />} />
            <Route
              path="/about/strategic-initiatives"
              element={<StrategicInitiatives />}
            />
            <Route path="/about/leadership" element={<LeadershipPage />} />
            <Route path="/about/contact" element={<ContactPage />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
