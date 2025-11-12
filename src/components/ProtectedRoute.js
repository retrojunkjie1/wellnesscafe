import React, { useState } from "react";
import PropTypes from "prop-types";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { auth } from "../firebase";
import { sendEmailVerification } from "firebase/auth";

const ProtectedRoute = ({ children, roles, requireVerified }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [resendMsg, setResendMsg] = useState("");

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Optional email verification gate (skip in development)
  const isDevelopment =
    process.env.NODE_ENV === "development" ||
    window.location.hostname === "localhost";

  if (requireVerified && !user?.emailVerified && !isDevelopment) {
    const onResend = async () => {
      setResendMsg("Sending...");
      try {
        if (auth?.currentUser) {
          // Enhanced email verification with action code settings
          const actionCodeSettings = {
            url: `${window.location.origin}/dashboard`,
            handleCodeInApp: true,
          };

          await sendEmailVerification(auth.currentUser, actionCodeSettings);
          setResendMsg(
            "✅ Verification email sent! Please check your inbox AND spam/junk folder. " +
              "If you still don't see it, wait 2-3 minutes and try again."
          );
        } else {
          setResendMsg("❌ No user session found. Please log in again.");
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error("Email verification failed:", e);
        let errorMessage = "Could not send verification email.";
        if (e.code === "auth/too-many-requests") {
          errorMessage =
            "⏱️ Too many requests. Please wait 5-10 minutes before trying again.";
        } else if (e.code === "auth/user-token-expired") {
          errorMessage =
            "🔒 Your session has expired. Please log out and log in again.";
        } else if (e.code === "auth/invalid-user-token") {
          errorMessage = "🔒 Invalid session. Please log out and log in again.";
        } else if (e.message) {
          errorMessage = `❌ Error: ${e.message}`;
        }
        setResendMsg(errorMessage);
      }
    };
    return (
      <div className="container max-w-[720px] mx-auto my-12 px-4">
        <div className="text-center">
          <div className="mb-6">
            <div className="text-6xl mb-4">📧</div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Check Your Email
            </h2>
            <p className="text-gray-600 mb-4">
              We've sent a verification link to{" "}
              <strong className="text-blue-600">{user?.email}</strong>
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>Next steps:</strong>
              </p>
              <ol className="text-sm text-blue-700 mt-2 text-left list-decimal list-inside space-y-1">
                <li>Open your email inbox</li>
                <li>Look for an email from WellnessCafe</li>
                <li>Click the "Verify Email" link</li>
                <li>Return here and click "I've verified - Continue"</li>
              </ol>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex gap-3 justify-center">
              <button
                type="button"
                className="btn btn-primary"
                onClick={onResend}
                disabled={resendMsg === "Sending..."}
              >
                {resendMsg === "Sending..."
                  ? "Sending..."
                  : "Resend Verification Email"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => window.location.reload()}
              >
                I've Verified - Continue
              </button>
            </div>

            {resendMsg && (
              <div
                className={`text-sm p-3 rounded-lg ${
                  resendMsg.includes("sent")
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {resendMsg}
              </div>
            )}

            <div className="text-xs text-gray-500 mt-4">
              <p>
                Didn't receive the email? Check your spam folder or try
                resending.
              </p>
              <p className="mt-1">
                Still having issues?
                <a
                  href="mailto:support@wellnesscafe.com?subject=Email Verification Issue&body=I'm having trouble receiving my email verification. My email is: [your-email-here]"
                  className="text-blue-600 hover:underline ml-1"
                >
                  Contact support
                </a>
              </p>
              <details className="mt-2">
                <summary className="cursor-pointer text-blue-600 hover:underline text-xs">
                  Troubleshooting tips
                </summary>
                <ul className="mt-1 ml-4 text-xs text-gray-600 list-disc">
                  <li>Make sure the email address is correct</li>
                  <li>
                    Check all email folders (inbox, spam, junk, promotions)
                  </li>
                  <li>
                    Try refreshing this page after clicking the verification
                    link
                  </li>
                  <li>The verification link expires after 24 hours</li>
                </ul>
              </details>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Optional role-based guard
  if (roles && Array.isArray(roles) && roles.length > 0) {
    const hasProviderOwnership =
      Array.isArray(user?.providerIds) && user.providerIds.length > 0;
    const role = user?.role || (hasProviderOwnership ? "provider" : null);
    const allowed = role ? roles.includes(role) : false;
    if (!allowed) {
      // Not authorized for this route; redirect to dashboard/home
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  roles: PropTypes.arrayOf(PropTypes.string),
  requireVerified: PropTypes.bool,
};

export default ProtectedRoute;
