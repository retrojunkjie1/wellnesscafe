import React, { useMemo, useState } from "react";
import "./AssistanceDirectory.css";
import data from "../../data/assistanceDirectory.json";

const iconForCategory = (cat) => {
  const map = {
    "Recovery Centers": "🧘",
    "Sober Living Homes": "🏠",
    "Legal Aid": "⚖️",
    "Financial Assistance": "💼",
    "Housing Assistance": "🏘️",
    "Healthcare Navigation": "💊",
    "Crisis & Hotlines": "📞",
    "Employment & Education": "🎓",
  };
  return map[cat] || "📚";
};

const unique = (arr) => Array.from(new Set(arr));

const AssistanceDirectory = () => {
  const [query, setQuery] = useState("");
  const [stateFilter, setStateFilter] = useState("ALL");
  const [expanded, setExpanded] = useState({});

  const categories = useMemo(() => unique(data.map((d) => d.category)), []);
  const states = useMemo(
    () => ["ALL", ...unique(data.map((d) => d.state).filter(Boolean))],
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.filter((d) => {
      const byState = stateFilter === "ALL" || d.state === stateFilter;
      const byQuery =
        !q ||
        [d.category, d.name, d.location, d.type]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(q));
      return byState && byQuery;
    });
  }, [query, stateFilter]);

  const grouped = useMemo(() => {
    const map = {};
    filtered.forEach((item) => {
      map[item.category] = map[item.category] || [];
      map[item.category].push(item);
    });
    return map;
  }, [filtered]);

  const toggle = (cat) => {
    setExpanded((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  return (
    <section
      className="assistance-section"
      aria-label="WellnessCafe Assistance Whitebook"
    >
      <div className="assistance-overlay"></div>
      <div className="assistance-container">
        <header className="assistance-header">
          <h2 className="assistance-title">
            Government & Wellness Assistance — Connect. Recover. Rebuild.
          </h2>
          <p className="assistance-sub">
            Your living directory of wellness, recovery, and support systems.
          </p>
        </header>

        <div className="ad-actions">
          <div className="ad-search">
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
              }}
              placeholder="Search by state, category, or name"
              aria-label="Search"
            />
          </div>
          <div className="ad-select">
            <select
              value={stateFilter}
              onChange={(e) => {
                setStateFilter(e.target.value);
              }}
              aria-label="Filter by state"
            >
              {states.map((s) => {
                return (
                  <option key={s} value={s}>
                    {s}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="ad-cta">
            <a href="/providers/join">Join as a Provider</a>
          </div>
        </div>

        <div className="ad-grid">
          {categories.map((cat) => {
            const items = grouped[cat] || [];
            const isOpen = !!expanded[cat];
            return (
              <article key={cat} className="ad-card">
                <div
                  className="ad-card-header"
                  onClick={() => {
                    toggle(cat);
                  }}
                  role="button"
                  aria-expanded={isOpen}
                >
                  <span className="ad-icon" aria-hidden>
                    {iconForCategory(cat)}
                  </span>
                  <span className="ad-card-title">{cat}</span>
                  <span className="ad-count">{items.length}</span>
                </div>
                {isOpen && (
                  <div className="ad-card-body">
                    {items.map((it) => {
                      return (
                        <div key={it.name + it.location} className="ad-item">
                          <div>
                            <div className="ad-item-title">{it.name}</div>
                            <div className="ad-item-meta">
                              {it.type} • {it.location}
                            </div>
                          </div>
                          <div className="ad-links">
                            {it.contact?.phone && (
                              <a
                                className="ad-link"
                                href={`tel:${it.contact.phone.replace(
                                  /[^+\d]/g,
                                  ""
                                )}`}
                              >
                                Call
                              </a>
                            )}
                            {it.contact?.website && (
                              <a
                                className="ad-link"
                                href={it.contact.website}
                                target="_blank"
                                rel="noreferrer"
                              >
                                Site
                              </a>
                            )}
                            {it.contact?.email && it.contact.email !== "" && (
                              <a
                                className="ad-link"
                                href={`mailto:${it.contact.email}`}
                              >
                                Email
                              </a>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </article>
            );
          })}
        </div>

        <div className="ad-footer">
          “Built with clarity — powered by WellnessCafe Intelligence © 2025”
        </div>
      </div>
    </section>
  );
};

export default AssistanceDirectory;
