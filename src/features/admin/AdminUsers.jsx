import React, { useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase";

const AdminUsers = () => {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("user");
  const [msg, setMsg] = useState("");

  const lookup = async () => {
    setMsg("");
    setResult(null);
    if (!db) {
      setMsg("Firestore unavailable.");
      return;
    }
    setLoading(true);
    try {
      const qUsers = query(
        collection(db, "users"),
        where("email", "==", email)
      );
      const snap = await getDocs(qUsers);
      if (snap.empty) {
        setMsg("No user found for that email.");
      } else {
        const d = snap.docs[0];
        setResult({ id: d.id, ...d.data() });
        setRole(d.data()?.role || "user");
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      setMsg(e?.message || "Lookup failed");
    }
    setLoading(false);
  };

  const save = async () => {
    setMsg("");
    if (!db || !result?.id) {
      return;
    }
    try {
      await updateDoc(doc(db, "users", result.id), { role });
      setMsg("Role updated.");
      setResult({ ...result, role });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      setMsg(e?.message || "Update failed");
    }
  };

  return (
    <div className="container max-w-[720px] mx-auto my-10 px-4">
      <h1>Admin: Manage User Roles</h1>
      <p>Promote or demote users by email. Roles: user, provider, admin.</p>
      <div className="card-grid section">
        <div className="p-card">
          <label className="block mb-2">User Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@example.com"
            className="w-full rounded-md border px-3 py-2"
          />
          <div style={{ marginTop: "0.75rem" }}>
            <button
              className="btn"
              disabled={loading || !email}
              onClick={lookup}
            >
              {loading ? "Looking up..." : "Find User"}
            </button>
          </div>
          {msg && <p className="text-gray-600 mt-2">{msg}</p>}
        </div>

        {result && (
          <div className="p-card">
            <h3>{result.email}</h3>
            <p className="text-gray-600">
              Current role: <strong>{result.role || "user"}</strong>
            </p>
            <label className="block mt-3">New Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="rounded-md border px-3 py-2"
            >
              <option value="user">user</option>
              <option value="provider">provider</option>
              <option value="admin">admin</option>
            </select>
            <div style={{ marginTop: "0.75rem" }}>
              <button className="btn" onClick={save}>
                Save
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
