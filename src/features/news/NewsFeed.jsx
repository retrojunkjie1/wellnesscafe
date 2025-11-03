import React, { useEffect, useState } from "react";
import Thumbnail from "../../components/Thumbnail";

const GOOGLE_NEWS_FEED =
  "https://news.google.com/rss/topics/CAAqIQgKIhtDQkFTRGdvSUwyMHZNR3QwTlRFU0FtVnVLQUFQAQ?ceid=US:en&oc=3";

const NewsFeed = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const MEDIASSTACK_API = `https://api.mediastack.com/v1/news?access_key=${
    process.env.REACT_APP_MEDIASTACK_API_KEY || ""
  }&languages=en&keywords=wellness,mindfulness,health`;

  const fetchGoogleNews = async () => {
    try {
      const res = await fetch(
        `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(
          GOOGLE_NEWS_FEED
        )}`
      );
      const data = await res.json();
      return (
        data.items?.map((a) => ({
          title: a.title,
          description: a.description,
          link: a.link,
          thumbnail: a.thumbnail || a.enclosure?.link || "",
        })) || []
      );
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn("Google News fetch failed", err);
      return [];
    }
  };

  const fetchMediastackNews = async () => {
    try {
      if (!process.env.REACT_APP_MEDIASTACK_API_KEY) {
        return [];
      } // optional
      const res = await fetch(MEDIASSTACK_API);
      const data = await res.json();
      return (
        data.data?.map((a) => ({
          title: a.title,
          description: a.description,
          link: a.url,
          thumbnail: a.image || "",
        })) || []
      );
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn("Mediastack error:", err);
      return [];
    }
  };

  const categorize = (article) => {
    const t = `${article.title || ""} ${
      article.description || ""
    }`.toLowerCase();
    if (
      t.includes("mindful") ||
      t.includes("meditation") ||
      t.includes("breath")
    )
      return "Mindfulness";
    if (
      t.includes("food") ||
      t.includes("diet") ||
      t.includes("nutrition") ||
      t.includes("recipe")
    )
      return "Nutrition";
    if (
      t.includes("recovery") ||
      t.includes("therapy") ||
      t.includes("addiction") ||
      t.includes("sobriety")
    )
      return "Recovery";
    return "Community";
  };

  // Convert any HTML (including escaped entities) to plain text
  const htmlToText = (input) => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(String(input || ""), "text/html");
      const txt = doc.body ? doc.body.textContent || "" : "";
      return txt.replace(/\s+/g, " ").trim();
    } catch (e) {
      return String(input || "")
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(
    () => {
      (async () => {
        try {
          const [g, m] = await Promise.all([
            fetchGoogleNews(),
            fetchMediastackNews(),
          ]);
          const all = [...g, ...m];
          const unique = Array.from(
            new Map(all.map((i) => [i.link, i])).values()
          );
          const categorized = unique.map((a) => ({
            ...a,
            category: categorize(a),
          }));
          setArticles(categorized);
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error("News load failed", e);
        } finally {
          setLoading(false);
        }
      })();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  if (loading) {
    return (
      <p className="text-center mt-10 text-gray-500">
        Loading live wellness news...
      </p>
    );
  }

  const grouped = ["Mindfulness", "Nutrition", "Recovery", "Community"].map(
    (cat) => ({
      cat,
      items: articles.filter((a) => a.category === cat),
    })
  );

  return (
    <div className="bg-gray-50 px-6 md:px-12 py-14">
      <h2 className="text-3xl font-semibold text-emerald-800 text-center mb-12">
        Live Wellness & Mindfulness News
      </h2>
      {grouped.map((group) => (
        <section key={group.cat} className="mb-12">
          <h3 className="text-2xl font-semibold text-emerald-700 mb-6">
            {group.cat}
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {group.items.slice(0, 6).map((a, i) => {
              const safeDesc = htmlToText(a.description);
              return (
                <a
                  key={i}
                  href={a.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-2xl overflow-hidden bg-white ring-1 ring-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                >
                  {a.thumbnail ? (
                    <div className="aspect-[16/9] w-full bg-gray-100">
                      <Thumbnail
                        src={a.thumbnail}
                        alt={a.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : null}
                  <div className="p-5">
                    <h4 className="text-base md:text-lg font-semibold text-emerald-900 line-clamp-2">
                      {a.title}
                    </h4>
                    {safeDesc ? (
                      <p className="text-gray-600 text-sm line-clamp-3 mt-1">
                        {safeDesc}
                      </p>
                    ) : null}
                  </div>
                </a>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
};

export default NewsFeed;
