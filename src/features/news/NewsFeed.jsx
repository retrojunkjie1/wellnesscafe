import React, { useEffect, useState } from "react";
import sampleData from "./newsSample.json";
import "./NewsFeed.css";

const NewsFeed = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedArticle, setSelectedArticle] = useState("");
  const [articleHTML, setArticleHTML] = useState("");

  // eslint-disable-next-line react-hooks/exhaustive-deps
useEffect(() => {

    const load = async ()=>{
      try {
        // Fully-local first: curated JSON under /public
        const res = await fetch("/data/news.json", { cache: "no-store" });
        if (res.ok){
          const data = await res.json();
          const items = Array.isArray(data)
            ? data
            : Array.isArray(data.results)
            ? data.results
            : [];
          if (items.length){
            setArticles(items);
            return;
          }
        }
        // Fallback to bundled sample data
        setArticles(sampleData);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Error loading news:", err);
        setArticles(sampleData);
        setError("We couldn’t load news from the network. Showing a local sample.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const readTime = (text) => {
    const words = String(text || "").split(/\s+/).filter(Boolean).length;
    const mins = Math.max(1, Math.round(words / 200));
    return `${mins} min read`;
  };

  const sourceOf = (link, fallback="")=>{
    try{
      const u = new URL(String(link||""));
      // If it's a Google News redirect, don't display that — try to extract domain from search params
      if (u.hostname.includes("news.google.")){
        const urlParam = u.searchParams.get("url") || u.searchParams.get("u");
        if (urlParam){
          const inner = new URL(urlParam);
          return inner.hostname.replace(/^www\./, "");
        }
        return fallback || "";
      }
      return u.hostname.replace(/^www\./, "");
    }catch{return fallback || "";}
  };

  const proxiedImage = (src)=>{
    const s = String(src||"");
    if (!s) return "";
    if (s.startsWith("http://") || s.startsWith("https://")){
      return `/api/image?url=${encodeURIComponent(s)}`;
    }
    return s; // local asset
  };

  const openArticle = async (url)=>{
    try{
      setSelectedArticle(url);
      setArticleHTML("");
      const res = await fetch(`/api/news?url=${encodeURIComponent(url)}`);
      const html = await res.text();
      setArticleHTML(html || "");
    }catch(err){
      // eslint-disable-next-line no-console
      console.error("Article load failed", err);
      setArticleHTML("<p style='opacity:0.8'>Unable to load article at this time.</p>");
    }
  };

  if (loading) {
    return (
      <div className="newsfeed-container">
        <h2 className="newsfeed-title">Top Stories</h2>
        <p style={{ textAlign: "center", opacity: 0.8 }}>Loading…</p>
      </div>
    );
  }

  if (selectedArticle){
    return (
      <div className="newsfeed-container">
        <button className="news-link" onClick={()=>{ setSelectedArticle(""); setArticleHTML(""); }}>← Back to News</button>
        <div className="article-content" dangerouslySetInnerHTML={{ __html: articleHTML }} />
      </div>
    );
  }

  return (
    <div className="newsfeed-container">
      {/* Soundscape Selector */}
      <div className="news-sound-picker">
        <select className="news-sound-select" defaultValue="NTS Ambient" aria-label="Select soundscape">
          <option>NTS Ambient</option>
          <option>Lo-Fi Calm</option>
          <option>Ocean Breath</option>
          <option>Guided Silence</option>
        </select>
      </div>

      <h2 className="newsfeed-title heading-rich">Top Stories</h2>
      {error ? (
        <p style={{ textAlign: "center", opacity: 0.85 }}>{error}</p>
      ) : null}
      <div className="news-grid">
        {articles.map((item, i) => {
          const imgSrc = item.image_url ? proxiedImage(item.image_url) : "/assets/default-thumbnail.png";
          return (
          <div key={i} className="news-card" onClick={()=> openArticle(item.link)}>
            <div className="news-img-wrap">
              <img src={imgSrc} loading="lazy" alt={item.title || "News image"} className="news-img" />
            </div>
            <div className="news-meta">
              <p className="news-author">{item.creator?.[0] || sourceOf(item.link, item.source || "") || "Source"}</p>
              <p className="news-date">
                {item.pubDate
                  ? new Date(item.pubDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  : ""} 
                • {readTime(item.description)}
              </p>
            </div>
            <h3 className="news-headline heading-rich">{item.title}</h3>
            <p className="news-desc">{(item.description || "").slice(0, 150)}…</p>
            <span className="read-inline">Read Article →</span>
          </div>
        );})}
      </div>
    </div>
  );
};

export default NewsFeed;
