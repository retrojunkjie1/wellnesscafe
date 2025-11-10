import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMoods } from "../hooks/useMoods";
import { format } from "date-fns";
import "./DashboardPin.css";

// Fallback affirmations if no API available
const fallbackAffirmations = [
  "I am safe, grounded, and open to new possibilities today.",
  "I choose progress over perfection, one step at a time.",
  "I honor my journey and trust the process of healing.",
  "I am worthy of love, peace, and all good things.",
  "My recovery is a gift I give myself every single day.",
  "I am stronger than my struggles and braver than I know.",
  "I embrace each moment with courage and compassion.",
  "I am building a life I'm proud of, brick by brick.",
];

const DashboardPin = () => {
  const { analytics } = useMoods();
  const [affirmation, setAffirmation] = useState("");
  const [loading, setLoading] = useState(true);
  const [dateKey, setDateKey] = useState(format(new Date(), "yyyy-MM-dd"));

  // Helper: Get or generate daily affirmation
  const fetchAffirmation = async (force = false) => {
    const today = format(new Date(), "yyyy-MM-dd");
    setDateKey(today);
    const localKey = `affirm-${today}`;
    const stored = localStorage.getItem(localKey);

    if (stored && !force) {
      setAffirmation(stored);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // For now, use a random fallback
      // Later this can call Cloud Function or useAffirmations hook
      const randomAffirmation =
        fallbackAffirmations[
          Math.floor(Math.random() * fallbackAffirmations.length)
        ];
      setAffirmation(randomAffirmation);
      localStorage.setItem(localKey, randomAffirmation);
    } catch (err) {
      console.error("Affirmation fetch error:", err);
      setAffirmation(fallbackAffirmations[0]);
    }
    setLoading(false);
  };

  // Initial load + 24h refresh
  useEffect(() => {
    fetchAffirmation();
    const timer = setInterval(
      () => fetchAffirmation(true),
      1000 * 60 * 60 * 24
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="dashboard-pin">
      <div className="pin-header">
        <h3 className="pin-title">🌞 Today's Focus</h3>
        <button
          onClick={() => fetchAffirmation(true)}
          className="refresh-btn"
          aria-label="Refresh affirmation"
        >
          ↻
        </button>
      </div>

      <div className="affirmation-container">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="affirmation-loading"
            >
              Loading daily affirmation…
            </motion.div>
          ) : (
            <motion.div
              key={dateKey}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="affirmation-text"
            >
              "{affirmation}"
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="pin-footer">
        <div className="mood-avg">
          <span className="mood-label">Mood Avg:</span>
          <span className="mood-value">{analytics.avg || 0}</span>
        </div>
        <a href="/tools" className="tools-link">
          Open Tools →
        </a>
      </div>
    </div>
  );
};

export default DashboardPin;
