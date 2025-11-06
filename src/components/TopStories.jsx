import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import sampleData from "../features/news/newsSample.json";
import "../features/news/NewsFeed.css";

const TopStories = ({ limit = 3 })=>{
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    (async()=>{
      try{
        const res = await fetch("/data/news.json", { cache: "no-store" });
        if(res.ok){
          const data = await res.json();
          const list = Array.isArray(data) ? data : Array.isArray(data.results) ? data.results : [];
          setItems(list.slice(0, limit));
        }else{
          setItems(sampleData.slice(0, limit));
        }
      }catch{
        setItems(sampleData.slice(0, limit));
      }finally{
        setLoading(false);
      }
    })();
  }, [limit]);

  const readTime = (text)=>{
    const words = String(text || "").split(/\s+/).filter(Boolean).length;
    const mins = Math.max(1, Math.round(words/200));
    return `${mins} min read`;
  };

  const sourceOf = (link, fallback="")=>{
    try{
      const u = new URL(String(link||""));
      if (u.hostname.includes("news.google.")){
        const urlParam = u.searchParams.get("url") || u.searchParams.get("u");
        if(urlParam){
          const inner = new URL(urlParam);
          return inner.hostname.replace(/^www\./, "");
        }
        return fallback || "";
      }
      return u.hostname.replace(/^www\./, "");
    }catch{return fallback || "";}
  };

  const thumb = (src)=>{
    const s = String(src||"");
    if(!s) return "/assets/default-thumbnail.png";
    if(s.startsWith("http://") || s.startsWith("https://")){
      return `/api/image?url=${encodeURIComponent(s)}`;
    }
    return s;
  };

  if(loading){
    return (
      <section className="newsfeed-container">
        <h2 className="newsfeed-title heading-rich">Top Stories</h2>
        <p style={{textAlign:'center', opacity:0.85}}>Loading…</p>
      </section>
    );
  }

  return (
    <section className="newsfeed-container">
      <div style={{display:'flex', alignItems:'baseline', justifyContent:'space-between', gap:12}}>
        <h2 className="newsfeed-title heading-rich" style={{marginBottom: '1rem'}}>Top Stories</h2>
        <Link to="/news" className="news-link">View all news →</Link>
      </div>
      <div className="news-grid">
        {items.map((it, i)=>{
          const img = thumb(it.image_url);
          const url = `/news/read?u=${encodeURIComponent(it.link)}`;
          return (
            <Link key={i} to={url} className="news-card" style={{textDecoration:'none'}}>
              <div className="news-img-wrap">
                <img src={img} alt={it.title || 'News'} className="news-img" loading="lazy" />
              </div>
              <div className="news-meta">
                <p className="news-author">{it.creator?.[0] || sourceOf(it.link, it.source || "") || "Source"}</p>
                <p className="news-date">
                  {it.pubDate ? new Date(it.pubDate).toLocaleDateString('en-US', {month:'short', day:'numeric'}) : ''}
                  {` • ${readTime(it.description)}`}
                </p>
              </div>
              <h3 className="news-headline heading-rich">{it.title}</h3>
              <p className="news-desc">{String(it.description||"").slice(0, 140)}…</p>
              <span className="read-inline">Read Article →</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default TopStories;
