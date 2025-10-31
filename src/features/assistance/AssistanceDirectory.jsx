import React, { useMemo, useState } from "react";
// Reuse the unified glass icon system from PageTemplate for transparent icons
import "../../Views/PageTemplate.css";
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
  const [modalCat, setModalCat] = useState(null);

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

  const categoryMeta = useMemo(
    () => ({
      "Recovery Centers": {
        title: "Recovery Centers",
        desc: "Inpatient and outpatient treatment with holistic recovery programs.",
      },
      "Sober Living Homes": {
        title: "Sober Living Homes",
        desc: "Safe, peer-supported housing for sustained recovery.",
      },
      "Legal Aid": {
        title: "Legal Aid & Advocacy",
        desc: "Civil legal support, tenant rights, benefits, and more.",
      },
      "Financial Assistance": {
        title: "Financial Assistance",
        desc: "Find public benefits, grants, and cost-of-care help.",
      },
      "Housing Assistance": {
        title: "Housing Assistance",
        desc: "Affordable housing, HUD resources, homeless services.",
      },
      "Healthcare Navigation": {
        title: "Healthcare Navigation",
        desc: "Medicaid options, coverage, and care coordination.",
      },
      "Crisis & Hotlines": {
        title: "Emergency & Crisis Intervention",
        desc: "24/7 hotlines, safety planning, and rapid response.",
      },
      "Employment & Education": {
        title: "Employment & Education",
        desc: "Job search, training, and upskilling programs.",
      },
    }),
    []
  );

  const openModal = (cat) => setModalCat(cat);
  const closeModal = () => setModalCat(null);

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
            const meta = categoryMeta[cat] || {
              title: cat,
              desc: `${items.length} verified resources in this category.`,
            };
            return (
              <article key={cat} className="ad-card">
                <button
                  type="button"
                  className="ad-card-click"
                  onClick={() => openModal(cat)}
                  aria-label={`Open ${meta.title} resources`}
                >
                  <div
                    className="wellness-icon-card wellness-icon wellness-icon-sm"
                    aria-hidden
                  >
                    {iconForCategory(cat)}
                  </div>
                  <h3 className="ad-card-title">{meta.title}</h3>
                  <p className="ad-card-desc">{meta.desc}</p>
                  <span className="ad-learn">Learn more →</span>
                </button>
              </article>
            );
          })}
        </div>

        {modalCat && (
          <div className="ad-modal-backdrop" role="dialog" aria-modal="true">
            <div className="ad-modal" role="document">
              <div className="ad-modal-header">
                <div
                  className="wellness-icon-card wellness-icon wellness-icon-sm"
                  aria-hidden
                >
                  {iconForCategory(modalCat)}
                </div>
                <h3 className="ad-modal-title">
                  {categoryMeta[modalCat]?.title || modalCat}
                </h3>
                <button
                  className="ad-modal-close"
                  onClick={closeModal}
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
              <div className="ad-modal-body">
                {(grouped[modalCat] || []).map((it) => (
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
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="ad-footer">
          “Built with clarity — powered by WellnessCafe Intelligence © 2025”
        </div>
      </div>
    </section>
  );
};

export default AssistanceDirectory;
