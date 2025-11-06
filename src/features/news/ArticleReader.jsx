import React, { useEffect, useMemo, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { fnUrl } from "../../utils/functionsBase";

const useQuery = ()=>{
  const { search } = useLocation();
  return useMemo(()=> new URLSearchParams(search), [search]);
};

const ArticleReader = ()=>{
  const q = useQuery();
  const url = q.get("u") || "";
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(()=>{
    if(!url){ setError("Missing article url"); setLoading(false); return; }
    (async()=>{
      try{
        const endpoint = `${fnUrl("articleRead")}?u=${encodeURIComponent(url)}`;
        const res = await fetch(endpoint);
        if(!res.ok){ throw new Error(`HTTP ${res.status}`); }
        const json = await res.json();
        setData(json);
      }catch(e){
        // eslint-disable-next-line no-console
        console.error("reader fetch failed", e);
        setError("Unable to load article");
      }finally{
        setLoading(false);
      }
    })();
  }, [url]);

  if(loading){
    return <div className="px-6 md:px-12 py-10 text-gray-400">Loading article…</div>;
  }
  if(error){
    return (
      <div className="px-6 md:px-12 py-10 text-red-300">
        <p className="mb-3">{error}</p>
        {url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            title="Open at source"
            aria-label="Open at source"
            className="inline-flex items-center gap-2 text-emerald-300 hover:text-emerald-200"
          >
            {/* External link icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="m15 3 6 6"/><path d="M21 3h-6v6"/></svg>
          </a>
        ) : null}
      </div>
    );
  }
  const title = data?.title || "Untitled";
  const site = data?.siteName ? ` — ${data.siteName}` : "";

  return (
    <div className="px-6 md:px-12 py-10">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-semibold text-emerald-100">{title}<span className="opacity-60 text-sm md:text-base">{site}</span></h1>
        <div className="flex items-center gap-3">
          {data?.url ? (
            <a
              href={data.url}
              target="_blank"
              rel="noopener noreferrer"
              title="Open at source"
              aria-label="Open at source"
              className="inline-flex items-center text-emerald-300 hover:text-emerald-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="m15 3 6 6"/><path d="M21 3h-6v6"/></svg>
            </a>
          ) : null}
          <Link to="/news" className="text-sm text-emerald-300 underline">Back to News</Link>
        </div>
      </div>
      {data?.image ? (
        <div className="rounded-xl overflow-hidden mb-6">
          <img src={`${fnUrl("imgProxy")}?u=${encodeURIComponent(data.image)}`} alt="" className="w-full h-auto" />
        </div>
      ): null}
      <article className="prose prose-invert max-w-none">
        {/* eslint-disable-next-line react/no-danger */}
        <div dangerouslySetInnerHTML={{ __html: data?.content || "" }} />
      </article>
      {data?.url ? (
        <div className="mt-8 text-sm text-gray-400">
          Source: <a href={data.url} target="_blank" rel="noopener noreferrer" className="underline">{data.siteName || data.url}</a>
        </div>
      ): null}
    </div>
  );
};

export default ArticleReader;
