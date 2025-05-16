export default async function handler(req, res) {
  try {
      console.log(process.env.VITE_NEWS_API)
    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?category=technology&language=en&pageSize=2&apiKey=${process.env.VITE_NEWS_API}` ,{
      headers: {
         "content-type": "application/json",
      },
    }
    );
    console.log(response)
    if (!response.ok) {
      throw new Error(`Failed to fetch news: ${response.statusText}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("API fetch error:", error.message);
    res.status(500).json({ error: error.message });
  }
}
