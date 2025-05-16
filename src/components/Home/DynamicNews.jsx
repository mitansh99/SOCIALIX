import { useEffect, useState } from "react";

const API_KEY = import.meta.env.VITE_NEWS_API || process.env.VITE_NEWS_API; // Replace with your NewsAPI key
const NEWS_API_URL = `https://newsapi.org/v2/top-headlines?category=technology&language=en&pageSize=2&apiKey=${API_KEY}`;

const SkeletonNewsCard = () => (
  <div className="bg-white rounded-xl shadow-sm animate-pulse overflow-hidden">
    <div className="w-full h-32 bg-gray-300"></div>
    <div className="p-3 space-y-2">
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
      <div className="h-3 bg-gray-200 rounded w-full"></div>
    </div>
  </div>
);

// Helper to truncate description with ellipsis
const truncate = (str, max = 100) =>
  str && str.length > max ? str.slice(0, max - 3) + "..." : str;

const DynamicNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const res = await fetch(NEWS_API_URL, {
          headers: {
            "Upgrade-Insecure-Requests": "1",
          },
        });
        const data = await res.json();
        if (data.status === "ok") {
          setNews(data.articles.slice(0, 2));
        } else {
          setNews([]);
        }
      } catch (error) {
        console.error("Failed to fetch news:", error);
        setNews([]);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <SkeletonNewsCard />
        <SkeletonNewsCard />
      </div>
    );
  }

  if (!news.length) {
    return (
      <div className="text-center text-xs text-gray-400">No news available</div>
    );
  }

  return (
    <div className="space-y-4">
      {news.map((item, idx) => (
        <a
          key={idx}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <div
            key={idx}
            className="bg-white rounded-xl overflow-hidden shadow-sm cusor-pointer"
          >
            {item.urlToImage && (
              <img
                src={item.urlToImage}
                alt={item.title}
                className="w-full h-32 object-cover"
              />
            )}
            <div className="p-3">
              <h4 className="font-medium text-sm">{item.title}</h4>
              <p className="text-xs text-gray-400 mt-1">
                {truncate(item.description)}
              </p>
              <div className="text-xs text-gray-500 mt-2">
                {new Date(item.publishedAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
};

export default DynamicNews;
