import React, { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import sampleData from "./newsSample.json";
import "./EnhancedNewsFeed.css";

const EnhancedNewsFeed = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedArticle, setSelectedArticle] = useState("");
  const [articleHTML, setArticleHTML] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const categories = [
    { id: "all", label: "All News", icon: "📰" },
    { id: "wellness", label: "Wellness", icon: "💚" },
    { id: "mental-health", label: "Mental Health", icon: "🧠" },
    { id: "recovery", label: "Recovery", icon: "🌱" },
    { id: "community", label: "Community", icon: "🤝" },
    { id: "research", label: "Research", icon: "🔬" },
    { id: "policy", label: "Policy", icon: "📋" }
  ];

  // Load news articles
  useEffect(() => {
    loadNews();
    // Auto-refresh every 30 minutes
    const refreshInterval = setInterval(() => {
      loadNews(true);
    }, 30 * 60 * 1000);
    
    return () => clearInterval(refreshInterval);
  }, []);

  // Filter and sort articles
  useEffect(() => {
    let filtered = [...articles];

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(article => 
        article.category?.toLowerCase() === selectedCategory ||
        article.description?.toLowerCase().includes(selectedCategory.replace("-", " "))
      );
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(article =>
        article.title?.toLowerCase().includes(query) ||
        article.description?.toLowerCase().includes(query) ||
        article.creator?.[0]?.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "latest":
          return new Date(b.pubDate || 0) - new Date(a.pubDate || 0);
        case "trending":
          return (b.views || 0) - (a.views || 0);
        case "oldest":
          return new Date(a.pubDate || 0) - new Date(b.pubDate || 0);
        default:
          return 0;
      }
    });

    setFilteredArticles(filtered);
  }, [articles, selectedCategory, searchQuery, sortBy]);

  const loadNews = async (isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    try {
      // Try to fetch from public/data/news.json
      const res = await fetch("/data/news.json", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        const items = Array.isArray(data) ? data : Array.isArray(data.results) ? data.results : [];
        if (items.length) {
          setArticles(enhanceArticles(items));
          setLastUpdate(new Date());
          return;
        }
      }
      // Fallback to sample data
      setArticles(enhanceArticles(sampleData));
      setLastUpdate(new Date());
    } catch (err) {
      console.error("Error loading news:", err);
      setArticles(enhanceArticles(sampleData));
      setError("We couldn't load news from the network. Showing local content.");
    } finally {
      setLoading(false);
    }
  };

  // Enhance articles with additional metadata
  const enhanceArticles = (items) => {
    return items.map((item, idx) => ({
      ...item,
      id: item.id || `article-${idx}`,
      isTrending: idx < 3, // Top 3 are trending
      isNew: isRecent(item.pubDate, 24), // New if within 24 hours
      views: Math.floor(Math.random() * 10000) + 100, // Simulated views
      category: detectCategory(item)
    }));
  };

  // Detect article category from content
  const detectCategory = (article) => {
    const text = `${article.title} ${article.description}`.toLowerCase();
    if (text.includes("mental health") || text.includes("behavioral health")) return "mental-health";
    if (text.includes("recovery") || text.includes("addiction") || text.includes("naloxone")) return "recovery";
    if (text.includes("community") || text.includes("denver") || text.includes("colorado")) return "community";
    if (text.includes("research") || text.includes("study")) return "research";
    if (text.includes("policy") || text.includes("medicaid") || text.includes("department")) return "policy";
    return "wellness";
  };

  const isRecent = (dateStr, hours) => {
    if (!dateStr) return false;
    const articleDate = new Date(dateStr);
    const now = new Date();
    const diffHours = (now - articleDate) / (1000 * 60 * 60);
    return diffHours <= hours;
  };

  const readTime = (text) => {
    const words = String(text || "").split(/\s+/).filter(Boolean).length;
    const mins = Math.max(1, Math.round(words / 200));
    return `${mins} min read`;
  };

  const sourceOf = (link, fallback = "") => {
    try {
      const u = new URL(String(link || ""));
      if (u.hostname.includes("news.google.")) {
        const urlParam = u.searchParams.get("url") || u.searchParams.get("u");
        if (urlParam) {
          const inner = new URL(urlParam);
          return inner.hostname.replace(/^www\./, "");
        }
        return fallback || "";
      }
      return u.hostname.replace(/^www\./, "");
    } catch {
      return fallback || "";
    }
  };

  const proxiedImage = (src) => {
    const s = String(src || "");
    if (!s) return "/assets/default-thumbnail.png";
    if (s.startsWith("http://") || s.startsWith("https://")) {
      return `/api/image?url=${encodeURIComponent(s)}`;
    }
    return s;
  };

  const openArticle = async (url) => {
    try {
      setSelectedArticle(url);
      setArticleHTML("<p style='text-align:center;opacity:0.8'>Loading article...</p>");
      const res = await fetch(`/api/news?url=${encodeURIComponent(url)}`);
      const html = await res.text();
      setArticleHTML(html || "<p style='opacity:0.8'>Article content unavailable.</p>");
    } catch (err) {
      console.error("Article load failed", err);
      setArticleHTML("<p style='opacity:0.8'>Unable to load article at this time.</p>");
    }
  };

  const formatTimestamp = (date) => {
    return date.toLocaleTimeString("en-US", { 
      hour: "2-digit", 
      minute: "2-digit" 
    });
  };

  if (loading) {
    return (
      <div className="enhanced-newsfeed">
        <div className="news-header">
          <h1 className="news-main-title">📰 Wellness News</h1>
          <p className="news-subtitle">Loading latest updates...</p>
        </div>
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Fetching news...</p>
        </div>
      </div>
    );
  }

  if (selectedArticle) {
    return (
      <div className="enhanced-newsfeed">
        <button 
          className="back-button" 
          onClick={() => { setSelectedArticle(""); setArticleHTML(""); }}
        >
          ← Back to News
        </button>
        <div className="article-reader" dangerouslySetInnerHTML={{ 
          __html: DOMPurify.sanitize(articleHTML, {
            ALLOWED_TAGS: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'img', 'a', 'ul', 'ol', 'li', 'strong', 'em', 'br', 'blockquote', 'div', 'span'],
            ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'target', 'rel', 'class', 'id']
          })
        }} />
      </div>
    );
  }

  const featuredArticle = filteredArticles[0];
  const trendingArticles = filteredArticles.filter(a => a.isTrending).slice(0, 3);
  const regularArticles = filteredArticles.slice(3);

  return (
    <div className="enhanced-newsfeed">
      {/* Header Section */}
      <div className="news-header">
        <div className="header-content">
          <h1 className="news-main-title">📰 Wellness News</h1>
          <p className="news-subtitle">
            Stay informed with the latest wellness, mental health, and recovery updates
          </p>
          <div className="last-update">
            <span className="live-indicator"></span>
            Last updated: {formatTimestamp(lastUpdate)}
          </div>
        </div>
      </div>

      {error && (
        <div className="news-alert">
          <span>⚠️</span> {error}
        </div>
      )}

      {/* Search and Filters */}
      <div className="news-controls">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search news..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button 
              className="clear-search"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        <div className="sort-dropdown">
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="latest">Latest First</option>
            <option value="trending">Trending</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Category Filters */}
      <div className="category-filters">
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`category-chip ${selectedCategory === cat.id ? "active" : ""}`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            <span className="cat-icon">{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {filteredArticles.length === 0 ? (
        <div className="no-results">
          <p>No articles found matching your criteria.</p>
          <button onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}>
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          {/* Featured Article */}
          {featuredArticle && selectedCategory === "all" && !searchQuery && (
            <div className="featured-section">
              <div className="section-badge">
                <span className="badge-icon">⭐</span>
                Featured Story
              </div>
              <div 
                className="featured-article"
                onClick={() => openArticle(featuredArticle.link)}
              >
                <div className="featured-image">
                  <img 
                    src={proxiedImage(featuredArticle.image_url)} 
                    alt={featuredArticle.title}
                    loading="lazy"
                  />
                  {featuredArticle.isNew && (
                    <span className="new-badge">🔴 LIVE</span>
                  )}
                </div>
                <div className="featured-content">
                  <div className="featured-meta">
                    <span className="featured-source">
                      {featuredArticle.creator?.[0] || sourceOf(featuredArticle.link, featuredArticle.source)}
                    </span>
                    <span className="featured-date">
                      {featuredArticle.pubDate && new Date(featuredArticle.pubDate).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric"
                      })}
                    </span>
                  </div>
                  <h2 className="featured-title">{featuredArticle.title}</h2>
                  <p className="featured-desc">{featuredArticle.description}</p>
                  <div className="featured-footer">
                    <span className="read-time">{readTime(featuredArticle.description)}</span>
                    <span className="read-more">Read Full Story →</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Trending Section */}
          {trendingArticles.length > 0 && selectedCategory === "all" && !searchQuery && (
            <div className="trending-section">
              <div className="section-badge">
                <span className="badge-icon">🔥</span>
                Trending Now
              </div>
              <div className="trending-grid">
                {trendingArticles.map((article, idx) => (
                  <div
                    key={article.id}
                    className="trending-card"
                    onClick={() => openArticle(article.link)}
                  >
                    <div className="trending-number">{idx + 1}</div>
                    <div className="trending-image">
                      <img 
                        src={proxiedImage(article.image_url)} 
                        alt={article.title}
                        loading="lazy"
                      />
                      {article.isNew && <span className="pulse-badge">●</span>}
                    </div>
                    <div className="trending-info">
                      <h3 className="trending-title">{article.title}</h3>
                      <div className="trending-meta">
                        <span>{article.creator?.[0] || sourceOf(article.link)}</span>
                        <span className="views">👁 {article.views?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Regular News Grid */}
          <div className="news-grid-section">
            <h3 className="section-title">
              {selectedCategory !== "all" 
                ? categories.find(c => c.id === selectedCategory)?.label 
                : searchQuery 
                  ? "Search Results" 
                  : "All News"}
            </h3>
            <div className="news-grid">
              {(selectedCategory === "all" && !searchQuery ? regularArticles : filteredArticles).map((article) => (
                <div
                  key={article.id}
                  className="news-card"
                  onClick={() => openArticle(article.link)}
                >
                  <div className="news-image-wrapper">
                    <img 
                      src={proxiedImage(article.image_url)} 
                      alt={article.title}
                      loading="lazy"
                      className="news-image"
                    />
                    {article.isNew && (
                      <span className="live-tag">● LIVE</span>
                    )}
                    {article.isTrending && (
                      <span className="trending-tag">🔥 TRENDING</span>
                    )}
                  </div>
                  <div className="news-content">
                    <div className="news-meta">
                      <span className="news-source">
                        {article.creator?.[0] || sourceOf(article.link, article.source)}
                      </span>
                      <span className="news-time">
                        {article.pubDate && new Date(article.pubDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric"
                        })}
                      </span>
                    </div>
                    <h4 className="news-title">{article.title}</h4>
                    <p className="news-description">
                      {article.description?.slice(0, 120)}...
                    </p>
                    <div className="news-footer">
                      <span className="category-tag">
                        {categories.find(c => c.id === article.category)?.icon || "📰"} 
                        {article.category?.replace("-", " ")}
                      </span>
                      <span className="read-link">Read →</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EnhancedNewsFeed;
