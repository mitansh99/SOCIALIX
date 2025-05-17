import { createContext, useContext, useState, useEffect } from "react";

const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
  const [currentNews, setCurrentNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState([]);

  const [ loadingQuote,setLoadingQuote] = useState(true);
  const [ quote,setQuote] = useState(null);

  //News Api
  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/news");
      const data = await res.json();
      if (data.status === "ok") {
        setCurrentNews(data.articles.slice(0, 2));
      } else {
        setCurrentNews([]);
      }
    } catch (error) {
      setError("Failed to fetch news:", error);
      setCurrentNews([]);
    } finally {
      setLoading(false);
    }
  };

  //quote API
  const fetchQuote = async () => {
      setLoadingQuote(true);
      try {
        const res = await fetch(
          `https://api.allorigins.win/get?url=${encodeURIComponent(
            `https://zenquotes.io/api/random?timestamp=${new Date().getTime()}`
          )}`
        );
        const data = await res.json();
        const parsedData = JSON.parse(data.contents);
        setQuote({
          quoteText: parsedData[0].q,
          quoteAuthor: parsedData[0].a || "Unknown",
        });
      } catch (error) {
        console.error("Failed to fetch quote:", error);
        setQuote({
          quoteText: "Stay connected. Stay inspired.",
          quoteAuthor: "Unknown",
        });
      } finally {
        setLoadingQuote(false);
      }
    };

   useEffect(() => {
    if (!currentNews) {
      fetchNews();
    }
    if(!quote) {
        fetchQuote();
    }
  }, []);

    
  
  

  return (
    <ApiContext.Provider value={{ currentNews, loading, error ,quote , loadingQuote }}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => {
  return useContext(ApiContext);
};
