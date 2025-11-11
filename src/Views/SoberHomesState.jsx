import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import PageBanner from "../components/PageBanner";
import AskWellnessAI from "../components/AskWellnessAI";
import { SOBER_STATES, STATE_META } from "../data/soberHomes";
import { db } from "../firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

const toTitle = (s) =>
  s
    .replaceAll("-", " ")
    .split(" ")
    .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : ""))
    .join(" ");

const SoberHomesState = () => {
  const { state } = useParams();
  const [data, setData] = useState(null);
  const [fsHomes, setFsHomes] = useState([]);
  const [oxfordHouses, setOxfordHouses] = useState([]);
  const [scrapingMetadata, setScrapingMetadata] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 20;
  const [city, setCity] = useState("");
  const [insurance, setInsurance] = useState("");
  const [showOnlyVacancies, setShowOnlyVacancies] = useState(false);
  const [genderFilter, setGenderFilter] = useState("");

  const slug = (state || "").toLowerCase();
  const stateName = STATE_META[slug]?.name || toTitle(state || "");

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const loader = SOBER_STATES[slug];
        if (!loader) {
          throw new Error("State not yet available");
        }
        const mod = await loader();
        if (mounted) setData(mod?.default || mod);
      } catch (err) {
        if (mounted) setError(err?.message || "Failed to load state data");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [slug]);

  // Try to fetch homes from Firestore if configured
  useEffect(() => {
    let alive = true;
    (async () => {
      if (!db) {
        setFsHomes([]);
        setOxfordHouses([]);
        return;
      }
      try {
        // Fetch traditional sober homes
        const snap = await getDocs(collection(db, `soberHomes/${slug}/homes`));
        const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        if (!alive) return;
        setFsHomes(rows);

        // Fetch Oxford Houses
        const oxfordSnap = await getDocs(
          collection(db, `soberHomes/${slug}/homes`)
        );
        const oxfordRows = oxfordSnap.docs
          .map((d) => {
            const data = d.data();
            // Check if this is an Oxford House (has sourceUrl or specific fields)
            if (data.sourceUrl?.includes('oxfordvacancies')) {
              return { 
                id: d.id, 
                ...data,
                // Convert Firestore Timestamps to Dates for display
                lastUpdated: data.lastUpdated?.toDate ? data.lastUpdated.toDate() : data.lastUpdated,
                scrapedAt: data.scrapedAt?.toDate ? data.scrapedAt.toDate() : data.scrapedAt,
              };
            }
            return null;
          })
          .filter(Boolean);
        
        if (!alive) return;
        setOxfordHouses(oxfordRows);

        // Fetch scraping metadata
        const metaDoc = await getDoc(doc(db, "scrapingMetadata", "oxfordHouses"));
        if (metaDoc.exists() && alive) {
          const metaData = metaDoc.data();
          setScrapingMetadata({
            ...metaData,
            lastScraped: metaData.lastScraped?.toDate ? metaData.lastScraped.toDate() : metaData.lastScraped,
          });
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn("firestore homes fetch failed", e);
        if (!alive) return;
        setFsHomes([]);
        setOxfordHouses([]);
      }
    })();
    return () => {
      alive = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="container max-w-[960px] my-8 mx-auto">
        Loading resources…
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-[960px] my-8 mx-auto px-4">
        <h1>Sober Living Homes in {stateName}</h1>
        <p className="text-gray-600 mt-2">{error}</p>
        <p className="mt-4">
          <Link to="/assistance" className="ghost-btn">
            Back to Assistance
          </Link>
        </p>
      </div>
    );
  }

  const buildFallbackHomes = (name) => {
    return [
      {
        name: `${name} 211 (United Way)`,
        city: "Statewide",
        type: "Referral & housing navigation",
        description:
          "Call 211 or visit 211.org for sober living and recovery referrals in your area.",
        apply: "Call 211 for live assistance.",
        contact: "https://www.211.org/",
      },
      {
        name: "SAMHSA Treatment & Recovery Locator",
        city: "Statewide",
        type: "Treatment, recovery housing, support",
        description:
          "Find local treatment and recovery resources that can connect you to sober living homes.",
        apply: "Search and contact providers.",
        contact: "https://findtreatment.gov/",
      },
      {
        name: "Oxford House Directory",
        city: "Statewide",
        type: "Peer-run sober housing",
        description:
          "Search Oxford House listings. Availability varies by city and county.",
        apply: "Contact houses directly to check openings.",
        contact: "https://www.oxfordhouse.org/directory",
      },
      {
        name: "Veterans Affairs (VA) Housing & Support",
        city: "Statewide",
        type: "Veteran transitional resources",
        description:
          "Veterans can access housing and recovery supports via VA and community partners.",
        apply: "Contact VA or local veteran services.",
        contact: "https://www.va.gov/",
      },
      {
        name: `${name} Drug Court / Problem-Solving Court Housing`,
        city: "County-based",
        type: "Justice-involved sober living",
        description:
          "Some sober living providers coordinate with Drug Courts and probation.",
        apply:
          "Ask your court officer or case manager for connected providers.",
        contact: "",
      },
    ];
  };

  // Merge Oxford Houses with regular homes
  const allHomes = [
    ...fsHomes,
    ...oxfordHouses.map(house => ({
      ...house,
      name: house.houseName,
      type: 'Oxford House - Peer-Run Sober Living',
      isOxfordHouse: true,
    })),
  ];

  const homes =
    allHomes.length > 0
      ? allHomes
      : data?.homes && data.homes.length > 0
      ? data.homes
      : buildFallbackHomes(stateName);

  const extractCity = (h) => {
    if (h?.city && String(h.city).trim()) return String(h.city).trim();
    const addr = String(h?.address || "").trim();
    // Heuristic: pick token before the first comma
    const re = /([^,]+),\s*[A-Z]{2}\b/;
    const m = re.exec(addr);
    if (m?.[1]) return m[1].trim();
    const parts = addr.split(",");
    if (parts.length >= 2) return parts.at(-2).trim();
    return "";
  };

  // Filter + paginate
  const q = (query || "").toLowerCase();
  const normalizeInsurance = (h) => {
    const ins = h?.insurance ?? h?.insuranceType ?? h?.insuranceTypes;
    if (!ins) return [];
    if (Array.isArray(ins)) return ins.map(String);
    if (typeof ins === "string") {
      return ins
        .split(/[,/|]/)
        .map((s) => s.trim())
        .filter(Boolean);
    }
    return [];
  };
  const citySet = new Set();
  for (const h of homes) {
    const c = extractCity(h);
    if (c) citySet.add(c);
  }
  const allCities = Array.from(citySet).sort((a, b) => a.localeCompare(b));

  const insSet = new Set();
  for (const h of homes) {
    for (const i of normalizeInsurance(h)) insSet.add(i);
  }
  const allInsurances = Array.from(insSet).sort((a, b) => a.localeCompare(b));

  const filtered = homes.filter((h) => {
    const name = (h?.name || "").toLowerCase();
    const cityStr = extractCity(h);
    const cityLower = (cityStr || "").toLowerCase();
    const type = (h?.type || "").toLowerCase();
    let catsArr = [];
    if (Array.isArray(h?.categories)) catsArr = h.categories;
    else if (Array.isArray(h?.category)) catsArr = h.category;
    else if (typeof h?.category === "string") catsArr = [h.category];
    const cats = catsArr.join(" ").toLowerCase();
    const insArr = normalizeInsurance(h).map((x) => x.toLowerCase());
    
    // Oxford House specific filters
    const hasVacancy = h.isOxfordHouse ? h.hasVacancy : true;
    const matchesGender = h.isOxfordHouse && genderFilter 
      ? h.gender === genderFilter 
      : true;
    
    return (
      // text query across key fields
      (!q ||
        name.includes(q) ||
        cityLower.includes(q) ||
        type.includes(q) ||
        cats.includes(q) ||
        insArr.some((i) => i.includes(q))) &&
      // city filter
      (!city || cityLower === city.toLowerCase()) &&
      // insurance filter
      (!insurance || insArr.includes(insurance.toLowerCase())) &&
      // vacancy filter (Oxford Houses only)
      (!showOnlyVacancies || hasVacancy) &&
      // gender filter (Oxford Houses only)
      matchesGender
    );
  });
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const start = (current - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);
  const snippetHomes = filtered.slice(0, 5).map((h) => ({
    name: h.name,
    city: h.city,
    type: h.type,
  }));

  // Helper to check if data is stale
  const isDataStale = (date) => {
    if (!date) return true;
    const now = new Date();
    const diffDays = (now - new Date(date)) / (1000 * 60 * 60 * 24);
    return diffDays > 7;
  };

  // Format date for display
  const formatDate = (date) => {
    if (!date) return "Unknown";
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div>
      <PageBanner
        imageSrc={`${process.env.PUBLIC_URL}/images/community.jpg`}
        altText={`Sober Living in ${stateName}`}
      />
      <main className="container max-w-[980px] my-8 mx-auto px-4">
        <div className="page-hero">
          <h1>Sober Living Homes in {stateName}</h1>
          <p>
            Curated list of sober living and transitional recovery housing
            resources including real-time Oxford House vacancies.
          </p>
        </div>

        {/* Data Freshness Indicator */}
        {scrapingMetadata && (
          <div
            className={`p-4 rounded-lg mb-4 ${
              isDataStale(scrapingMetadata.lastScraped)
                ? "bg-yellow-50 border border-yellow-200"
                : "bg-green-50 border border-green-200"
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-sm mb-1">
                  {isDataStale(scrapingMetadata.lastScraped)
                    ? "⚠️ Data may be outdated"
                    : "✅ Oxford House data is fresh"}
                </h3>
                <p className="text-sm text-gray-700">
                  Last updated: {formatDate(scrapingMetadata.lastScraped)}
                </p>
                {scrapingMetadata.totalHouses > 0 && (
                  <p className="text-sm text-gray-700 mt-1">
                    {scrapingMetadata.totalHouses} Oxford Houses tracked •{" "}
                    {scrapingMetadata.housesWithVacancies} with vacancies
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 py-3 border-b border-gray-200">
          <div className="flex-1 flex flex-col md:flex-row gap-3">
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name, city, type, category or insurance"
              className="w-full md:flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm backdrop-blur-md bg-white/60"
              aria-label="Search sober homes"
            />
            <select
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                setPage(1);
              }}
              className="w-full md:w-56 rounded-md border border-gray-300 px-3 py-2 text-sm backdrop-blur-md bg-white/60"
              aria-label="Filter by city"
            >
              <option value="">All cities</option>
              {allCities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <select
              value={insurance}
              onChange={(e) => {
                setInsurance(e.target.value);
                setPage(1);
              }}
              className="w-full md:w-56 rounded-md border border-gray-300 px-3 py-2 text-sm backdrop-blur-md bg-white/60"
              aria-label="Filter by insurance"
            >
              <option value="">All insurance</option>
              {allInsurances.map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
            <select
              value={genderFilter}
              onChange={(e) => {
                setGenderFilter(e.target.value);
                setPage(1);
              }}
              className="w-full md:w-40 rounded-md border border-gray-300 px-3 py-2 text-sm backdrop-blur-md bg-white/60"
              aria-label="Filter by gender"
            >
              <option value="">All genders</option>
              <option value="M">Men</option>
              <option value="W">Women</option>
              <option value="MC">Men + Children</option>
            </select>
            <label className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={showOnlyVacancies}
                onChange={(e) => {
                  setShowOnlyVacancies(e.target.checked);
                  setPage(1);
                }}
                className="rounded border-gray-300"
              />
              <span className="whitespace-nowrap">Only vacancies</span>
            </label>
            {(city || insurance || query || genderFilter || showOnlyVacancies) && (
              <button
                type="button"
                className="ghost-btn"
                onClick={() => {
                  setQuery("");
                  setCity("");
                  setInsurance("");
                  setGenderFilter("");
                  setShowOnlyVacancies(false);
                  setPage(1);
                }}
              >
                Clear
              </button>
            )}
          </div>
          <div className="text-sm text-gray-600">
            {total} result{total === 1 ? "" : "s"}
          </div>
        </div>

        <section className="card-grid section">
          {pageItems.map((h) => {
            const key = h.id || `${h.name}-${h.city}`;
            const contactUrl =
              typeof h.contact === "string" ? h.contact : h.contact?.website;
            const isOxford = h.isOxfordHouse;
            
            return (
              <div key={key} className={`p-card ${isOxford ? 'border-l-4 border-blue-500' : ''}`}>
                <div className="flex items-start justify-between mb-2">
                  <h3>{h.name}</h3>
                  {isOxford && (
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                      Oxford House
                    </span>
                  )}
                </div>
                
                <p className="text-gray-700 my-1.5">
                  📍 {h.city}
                  {h.county ? `, ${h.county}` : ""}
                </p>
                
                {isOxford && (
                  <>
                    <div className="my-2 p-3 bg-gray-50 rounded-lg">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="font-semibold">Gender:</span>{" "}
                          {h.gender === "M"
                            ? "Men"
                            : h.gender === "W"
                            ? "Women"
                            : h.gender === "MC"
                            ? "Men + Children"
                            : h.gender}
                        </div>
                        <div>
                          <span className="font-semibold">Capacity:</span>{" "}
                          {h.capacity} beds
                        </div>
                        <div className="col-span-2">
                          <span className="font-semibold">Vacancies:</span>{" "}
                          <span
                            className={`font-bold ${
                              h.vacancies > 0 ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {h.vacancies > 0
                              ? `${h.vacancies} bed${h.vacancies === 1 ? "" : "s"} available`
                              : "Full"}
                          </span>
                        </div>
                        {h.meetingTime && (
                          <div className="col-span-2">
                            <span className="font-semibold">House Meeting:</span>{" "}
                            {h.meetingTime}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {h.contact && (
                      <div className="my-2">
                        <p className="text-sm text-gray-700">
                          <span className="font-semibold">House:</span>{" "}
                          {h.contact.housePhone || "—"}
                        </p>
                        {h.contact.managerName && (
                          <p className="text-sm text-gray-700">
                            <span className="font-semibold">Manager:</span>{" "}
                            {h.contact.managerName}
                            {h.contact.managerPhone && ` • ${h.contact.managerPhone}`}
                          </p>
                        )}
                      </div>
                    )}
                    
                    {h.lastUpdated && (
                      <p className="text-xs text-gray-500 mt-2">
                        Updated: {formatDate(h.lastUpdated)}
                      </p>
                    )}
                  </>
                )}
                
                {!isOxford && (
                  <>
                    <p className="text-gray-800 my-1.5">{h.type}</p>
                    {h.verified && (
                      <span className="specialty-tag mr-1.5">Verified</span>
                    )}
                    {Array.isArray(h.categories) && h.categories.length > 0 && (
                      <p className="my-1.5">
                        {h.categories.map((c) => (
                          <span key={c} className="specialty-tag mr-1.5">
                            {c}
                          </span>
                        ))}
                      </p>
                    )}
                    {normalizeInsurance(h).length > 0 && (
                      <p className="my-1.5">
                        {normalizeInsurance(h).map((i) => (
                          <span key={i} className="specialty-tag mr-1.5">
                            {i}
                          </span>
                        ))}
                      </p>
                    )}
                    {h.description && (
                      <p className="text-gray-700 my-1.5">{h.description}</p>
                    )}
                    {h.address && (
                      <p className="text-gray-700 my-1.5">{h.address}</p>
                    )}
                    {h.apply && <p className="text-gray-600 my-2">{h.apply}</p>}
                    {(h.referral || h.financing) && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {h.referral && (
                          <span className="specialty-tag">
                            Referrals:{" "}
                            {Object.entries(h.referral)
                              .filter(([, v]) => v)
                              .map(([k]) => k)
                              .join(", ") || "—"}
                          </span>
                        )}
                        {h.financing && (
                          <span className="specialty-tag">
                            Financing:{" "}
                            {Object.entries(h.financing)
                              .filter(([, v]) => v)
                              .map(([k]) => k)
                              .join(", ") || "—"}
                          </span>
                        )}
                      </div>
                    )}
                  </>
                )}
                
                {/* Contact Actions */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {isOxford && h.contact?.housePhone && (
                    <a
                      href={`tel:${h.contact.housePhone}`}
                      className="ghost-btn text-sm"
                    >
                      📞 Call House
                    </a>
                  )}
                  {isOxford && h.contact?.managerPhone && (
                    <a
                      href={`tel:${h.contact.managerPhone}`}
                      className="ghost-btn text-sm"
                    >
                      📞 Call Manager
                    </a>
                  )}
                  {contactUrl && (
                    <a
                      href={contactUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ghost-btn text-sm"
                    >
                      🌐 Visit site
                    </a>
                  )}
                  {!isOxford && typeof h.contact === "object" && (
                    <>
                      {h.contact?.phone && (
                        <a href={`tel:${h.contact.phone}`} className="ghost-btn text-sm">
                          📞 Call
                        </a>
                      )}
                      {h.contact?.email && (
                        <a
                          href={`mailto:${h.contact.email}`}
                          className="ghost-btn text-sm"
                        >
                          ✉️ Email
                        </a>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && <p>No listings found for this state.</p>}
        </section>

        {filtered.length > PAGE_SIZE && (
          <div className="flex items-center justify-between mt-4">
            <button
              type="button"
              className="ghost-btn"
              disabled={current <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </button>
            <div className="text-sm text-gray-600">
              Page {current} of {totalPages}
            </div>
            <button
              type="button"
              className="ghost-btn"
              disabled={current >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </button>
          </div>
        )}

        <div className="mt-6">
          <Link to="/assistance" className="ghost-btn">
            Back to Assistance
          </Link>
        </div>
      </main>
      <AskWellnessAI stateSlug={slug} snippets={snippetHomes} />
    </div>
  );
};

export default SoberHomesState;
