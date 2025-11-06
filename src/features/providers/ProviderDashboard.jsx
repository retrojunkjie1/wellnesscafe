import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../AuthContext";
import { db } from "../../firebase";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

const serviceList = [
  "Yoga",
  "Acuwellness",
  "Therapy",
  "Counseling",
  "Spiritual",
  "Recovery Coaching",
  "Group Facilitation",
  "Nutrition",
];
const modeList = ["Video", "Chat", "In-person"];

const ProviderDashboard = ({preview=false}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [form, setForm] = useState({
    servicesOffered: [],
    meetingModes: [],
    ratePerHour: "",
    calendarUrl: "",
  });

  const isProvider = useMemo(()=>{
    if(preview){ return true; }
    return Boolean(user && (user.role === "provider" || user?.providerIds?.length));
  },[preview,user]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setStatus("");
      // attempt to load provider profile owned by user
      try {
        if (db && user?.uid) {
          const q = query(
            collection(db, "providers"),
            where("ownerUid", "==", user.uid)
          );
          const snap = await getDocs(q);
          if (!snap.empty) {
            const p = snap.docs[0];
            const data = p.data();
            setForm({
              servicesOffered: data.serviceTypes || [],
              meetingModes: data.meetingModes || [],
              ratePerHour: String(data.ratePerHour ?? ""),
              calendarUrl: data.calendarUrl || "",
            });
          }
        } else {
          // local fallback
          const raw = localStorage.getItem(
            `wc_provider_prefs_${user?.uid || "anon"}`
          );
          if (raw) {
            setForm(JSON.parse(raw));
          }
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn("provider settings load failed", error);
        setStatus("Failed to load provider settings.");
      }
      setLoading(false);
    })();
  }, [user]);

  const toggle = (field, val) => {
    setForm((p) => {
      const arr = p[field] || [];
      return {
        ...p,
        [field]: arr.includes(val)
          ? arr.filter((v) => v !== val)
          : [...arr, val],
      };
    });
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const onSave = async () => {
    setSaving(true);
    setStatus("");
    try {
      // persist to Firestore if available, else localStorage
      if (db && user?.uid) {
        const q = query(
          collection(db, "providers"),
          where("ownerUid", "==", user.uid)
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
          const ref = doc(db, "providers", snap.docs[0].id);
          await updateDoc(ref, {
            serviceTypes: form.servicesOffered,
            meetingModes: form.meetingModes,
            ratePerHour: Number(form.ratePerHour || 0),
            calendarUrl: form.calendarUrl,
          });
        }
      } else {
        localStorage.setItem(
          `wc_provider_prefs_${user?.uid || "anon"}`,
          JSON.stringify(form)
        );
      }
      setStatus("Saved.");
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn("provider settings save failed", error);
      setStatus("Save failed. Try again.");
    }
    setSaving(false);
  };

  if (!isProvider) {
    return (
      <div
        className="provider-dashboard container"
        style={{ maxWidth: 900, margin: "2rem auto" }}
      >
        <h1>Provider Dashboard</h1>
        <p>You need a provider profile to access this dashboard.</p>
        <p>
          <a href="/providers/apply" className="btn">
            Apply to join the network
          </a>
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div
        className="provider-dashboard container"
        style={{ maxWidth: 900, margin: "2rem auto" }}
      >
        Loading provider settings…
      </div>
    );
  }

  return (
    <div
      className="provider-dashboard container"
      style={{ maxWidth: 900, margin: "2rem auto" }}
    >
      <h1>Provider Dashboard</h1>
      {preview && (
        <div className="pv-ok" style={{margin:"8px 0 12px"}}>
          Preview mode — changes are saved locally on this device.
        </div>
      )}
      <p>
        Choose the services you offer, update your modes, and set your rate.
      </p>

      {status && (
        <div className="pv-ok" style={{ margin: "12px 0" }}>
          {status}
        </div>
      )}

      <section style={{ marginTop: 20 }}>
        <h3>Services Offered</h3>
        <div
          className="pv-chip-list"
          style={{ display: "flex", flexWrap: "wrap", gap: 8 }}
        >
          {serviceList.map((s) => (
            <button
              key={s}
              type="button"
              className={
                form.servicesOffered.includes(s) ? "chip active" : "chip"
              }
              onClick={() => toggle("servicesOffered", s)}
            >
              {s}
            </button>
          ))}
        </div>
      </section>

      <section style={{ marginTop: 20 }}>
        <h3>Meeting Modes</h3>
        <div
          className="pv-chip-list"
          style={{ display: "flex", flexWrap: "wrap", gap: 8 }}
        >
          {modeList.map((m) => (
            <button
              key={m}
              type="button"
              className={form.meetingModes.includes(m) ? "chip active" : "chip"}
              onClick={() => toggle("meetingModes", m)}
            >
              {m}
            </button>
          ))}
        </div>
      </section>

      <section style={{ marginTop: 20 }}>
        <h3>Rate & Scheduling</h3>
        <div
          className="pv-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px,1fr))",
            gap: 12,
          }}
        >
          <label>
            <span className="pv-label">Rate per hour (USD)</span>
            <input
              name="ratePerHour"
              type="number"
              min="0"
              value={form.ratePerHour}
              onChange={onChange}
            />
          </label>
          <label>
            <span className="pv-label">Calendar link (Cal/Calendly)</span>
            <input
              name="calendarUrl"
              value={form.calendarUrl}
              onChange={onChange}
            />
          </label>
        </div>
      </section>

      <div style={{ marginTop: 24 }}>
        <button className="pv-submit" onClick={onSave} disabled={saving}>
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </div>
  );
};
export default ProviderDashboard;
