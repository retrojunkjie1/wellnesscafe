// src/components/AuthDebug.jsx
import React from "react";
import { useAuth } from "../AuthContext";
import { auth, db } from "../firebase";

const AuthDebug = () => {
  const { user, loading, authEnabled } = useAuth();

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "2rem auto",
        padding: "2rem",
        background: "#f5f5f5",
        borderRadius: "8px",
        fontFamily: "monospace",
      }}
    >
      <h1 style={{ marginBottom: "2rem" }}>🔍 Authentication Debug Panel</h1>

      <div style={{ marginBottom: "1.5rem" }}>
        <h2>System Status</h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            <tr style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ padding: "0.5rem", fontWeight: "bold" }}>
                Auth Enabled:
              </td>
              <td style={{ padding: "0.5rem" }}>
                {authEnabled ? "✅ Yes" : "❌ No"}
              </td>
            </tr>
            <tr style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ padding: "0.5rem", fontWeight: "bold" }}>
                Firebase Auth:
              </td>
              <td style={{ padding: "0.5rem" }}>
                {auth ? "✅ Initialized" : "❌ Not Initialized"}
              </td>
            </tr>
            <tr style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ padding: "0.5rem", fontWeight: "bold" }}>
                Firebase Firestore:
              </td>
              <td style={{ padding: "0.5rem" }}>
                {db ? "✅ Initialized" : "❌ Not Initialized"}
              </td>
            </tr>
            <tr style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ padding: "0.5rem", fontWeight: "bold" }}>
                Loading:
              </td>
              <td style={{ padding: "0.5rem" }}>
                {loading ? "⏳ Yes" : "✅ No"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <h2>Current User</h2>
        {!user ? (
          <div
            style={{
              padding: "1rem",
              background: "#fff3cd",
              border: "1px solid #ffc107",
              borderRadius: "4px",
              color: "#856404",
            }}
          >
            <strong>⚠️ Not Authenticated</strong>
            <p style={{ margin: "0.5rem 0 0 0" }}>
              No user is currently signed in. Try:
            </p>
            <ol style={{ marginLeft: "1.5rem", marginTop: "0.5rem" }}>
              <li>
                Go to <a href="/login">/login</a> and sign in
              </li>
              <li>Check if Firebase credentials are in .env.local</li>
              <li>Check browser console for errors</li>
            </ol>
          </div>
        ) : (
          <div
            style={{
              padding: "1rem",
              background: "#d4edda",
              border: "1px solid #28a745",
              borderRadius: "4px",
            }}
          >
            <strong>✅ User Authenticated</strong>
            <table
              style={{
                width: "100%",
                marginTop: "1rem",
                borderCollapse: "collapse",
              }}
            >
              <tbody>
                <tr style={{ borderBottom: "1px solid #c3e6cb" }}>
                  <td style={{ padding: "0.5rem", fontWeight: "bold" }}>
                    UID:
                  </td>
                  <td style={{ padding: "0.5rem", wordBreak: "break-all" }}>
                    {user.uid}
                  </td>
                </tr>
                <tr style={{ borderBottom: "1px solid #c3e6cb" }}>
                  <td style={{ padding: "0.5rem", fontWeight: "bold" }}>
                    Email:
                  </td>
                  <td style={{ padding: "0.5rem" }}>{user.email || "N/A"}</td>
                </tr>
                <tr style={{ borderBottom: "1px solid #c3e6cb" }}>
                  <td style={{ padding: "0.5rem", fontWeight: "bold" }}>
                    Email Verified:
                  </td>
                  <td style={{ padding: "0.5rem" }}>
                    {user.emailVerified ? "✅ Yes" : "❌ No"}
                  </td>
                </tr>
                <tr style={{ borderBottom: "1px solid #c3e6cb" }}>
                  <td style={{ padding: "0.5rem", fontWeight: "bold" }}>
                    Display Name:
                  </td>
                  <td style={{ padding: "0.5rem" }}>
                    {user.displayName || "N/A"}
                  </td>
                </tr>
                <tr style={{ borderBottom: "1px solid #c3e6cb" }}>
                  <td style={{ padding: "0.5rem", fontWeight: "bold" }}>
                    Role:
                  </td>
                  <td style={{ padding: "0.5rem" }}>{user.role || "N/A"}</td>
                </tr>
                <tr style={{ borderBottom: "1px solid #c3e6cb" }}>
                  <td style={{ padding: "0.5rem", fontWeight: "bold" }}>
                    Provider IDs:
                  </td>
                  <td style={{ padding: "0.5rem" }}>
                    {user.providerIds?.length > 0
                      ? user.providerIds.join(", ")
                      : "N/A"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <h2>Environment Check</h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            <tr style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ padding: "0.5rem", fontWeight: "bold" }}>
                NODE_ENV:
              </td>
              <td style={{ padding: "0.5rem" }}>{import.meta.env.NODE_ENV}</td>
            </tr>
            <tr style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ padding: "0.5rem", fontWeight: "bold" }}>
                Hostname:
              </td>
              <td style={{ padding: "0.5rem" }}>{window.location.hostname}</td>
            </tr>
            <tr style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ padding: "0.5rem", fontWeight: "bold" }}>
                Firebase API Key Present:
              </td>
              <td style={{ padding: "0.5rem" }}>
                {import.meta.env.VITE_FIREBASE_API_KEY ? "✅ Yes" : "❌ No"}
              </td>
            </tr>
            <tr style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ padding: "0.5rem", fontWeight: "bold" }}>
                Firebase Project ID:
              </td>
              <td style={{ padding: "0.5rem" }}>
                {import.meta.env.VITE_FIREBASE_PROJECT_ID || "❌ Not Set"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <h2>Quick Actions</h2>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <a
            href="/login"
            style={{
              padding: "0.75rem 1.5rem",
              background: "#007bff",
              color: "white",
              textDecoration: "none",
              borderRadius: "4px",
            }}
          >
            Go to Login
          </a>
          <a
            href="/signup"
            style={{
              padding: "0.75rem 1.5rem",
              background: "#28a745",
              color: "white",
              textDecoration: "none",
              borderRadius: "4px",
            }}
          >
            Go to Signup
          </a>
          <a
            href="/dashboard"
            style={{
              padding: "0.75rem 1.5rem",
              background: "#17a2b8",
              color: "white",
              textDecoration: "none",
              borderRadius: "4px",
            }}
          >
            Try Dashboard
          </a>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "0.75rem 1.5rem",
              background: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Reload Page
          </button>
        </div>
      </div>

      <div
        style={{
          marginTop: "2rem",
          padding: "1rem",
          background: "#e9ecef",
          borderRadius: "4px",
          fontSize: "0.875rem",
        }}
      >
        <h3 style={{ marginTop: 0 }}>Troubleshooting Steps:</h3>
        <ol style={{ marginBottom: 0 }}>
          <li>
            <strong>If Auth is not enabled:</strong> Check that .env.local
            exists with Firebase credentials
          </li>
          <li>
            <strong>If user is null:</strong> You need to sign in at /login or
            /signup
          </li>
          <li>
            <strong>If email not verified:</strong> Check your email inbox (and
            spam) for verification link
          </li>
          <li>
            <strong>If dashboard redirects to login:</strong> This is normal -
            sign in first
          </li>
          <li>
            <strong>If stuck after login:</strong> Check browser console for
            errors (F12)
          </li>
        </ol>
      </div>
    </div>
  );
};

export default AuthDebug;
