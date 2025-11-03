import React, { useEffect, useState } from "react";
import "./NewsTicker.css";

const GOOGLE_NEWS_FEED =
  "https://news.google.com/rss/topics/CAAqIQgKIhtDQkFTRGdvSUwyMHZNR3QwTlRFU0FtVnVLQUFQAQ?ceid=US:en&oc=3";

const NewsTicker = () => {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(true);

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

  const content = items.length
    ? items
    : [
        "Live wellness updates loading…",
        "Mindfulness • Nutrition • Recovery • Community",
      ];

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
              <span className="news-item" key={`${t}-${i}`}>
                {t}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsTicker;
