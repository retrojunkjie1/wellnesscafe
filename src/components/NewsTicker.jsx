import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import "./NewsTicker.css";

const GOOGLE_NEWS_FEED =
  "https://news.google.com/rss/topics/CAAqIQgKIhtDQkFTRGdvSUwyMHZNR3QwTlRFU0FtVnVLQUFQAQ?ceid=US:en&oc=3";

const NewsTicker = () => {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(true);
  const [headerNotice, setHeaderNotice] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(
          `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(
            GOOGLE_NEWS_FEED
          )}`
        );
        const data = await res.json();
        const titles = (data.items || []).map((a) => a.title).filter(Boolean);
        if (alive) {
          setItems(titles);
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn("Ticker fetch failed", e);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Subscribe to the same Firestore announcement used by LiveUpdateBanner
  useEffect(() => {
    if (!db) return undefined;
    try {
      const unsubscribe = onSnapshot(
        doc(db, "announcements", "headerNotice"),
        (snap) => {
          if (snap.exists()) {
            const data = snap.data();
            if (data && data.active !== false) {
              const prefix = data.date ? `Effective ${data.date}, ` : "";
              const msg = data.message || "";
              const combined = `${prefix}${msg}`.trim();
              setHeaderNotice(combined || null);
            } else {
              setHeaderNotice(null);
            }
          }
        },
        // eslint-disable-next-line no-console
        (err) => console.warn("Ticker announcement fetch failed", err)
      );
      return () => unsubscribe();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn("Ticker announcement listener error", e);
      return undefined;
    }
  }, []);

  // Site-specific updates to include in ticker (e.g., compliance/effective notices)
  const siteUpdates = useMemo(() => {
    const list = [];
    if (headerNotice) list.push(headerNotice);
    return list;
  }, [headerNotice]);

  const content = (items.length ? items : [
    "Live wellness updates loading…",
    "Mindfulness • Nutrition • Recovery • Community",
  ]).concat(siteUpdates);

  return (
    <div className="news-ticker-root">
      <button
        className="news-toggle"
        onClick={() => setOpen((v) => !v)}
        aria-pressed={open}
        aria-label={open ? "Hide live news" : "Show live news"}
        type="button"
      >
        {open ? "Hide Live News" : "Show Live News"}
      </button>
      {open && (
        <div className="news-ticker" aria-live="polite">
          <div className="news-track">
            {content.concat(content).map((t, i) => (
              <Link
                to="/news"
                className="news-item"
                key={`${t}-${i}`}
                aria-label={`Read more: ${t}`}
              >
                {t}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsTicker;
