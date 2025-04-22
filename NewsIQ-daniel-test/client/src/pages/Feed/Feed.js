import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import './Feed.css'; 

const Feed = () => {
  const [search, setSearch] = useState("");
  const [articles, setArticles] = useState([]);
  const navigate = useNavigate(); 

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const fetchNews = async () => {
        try {
          const { data: { apiKey } } = await axios.get("http://localhost:9001/fetchNewsApiKey");
          // Fetch news articles based on search (default to "latest")
          const response = await axios.get(
            `https://newsapi.org/v2/everything?q=${search || "latest"}&apiKey=${apiKey}`
          );

          setArticles(response.data.articles);
        } catch (error) {
          console.error("Error fetching news:", error);
        }
      };

      fetchNews();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  const handleCardClick = (articleTitle) => {
    navigate(`/article/${encodeURIComponent(articleTitle)}`);
  };

  return (
    <div className="feed-container">
      <header className="top-bar">
        <button className="profile-button" onClick={() => navigate("/profile")}>Profile</button>
        <span className="logo">NewsIQ</span>
        <button className="auth-button" onClick={() => navigate("/auth")}>Login/Signup</button>
      </header>

      <div className="search-bar-container">
        <input
          type="text"
          className="search-bar"
          placeholder="Search for news..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="articles-container">
        {articles.map((article, index) => (
          <div key={index} className="article-card" onClick={() => handleCardClick(article.title)}>
            <a
              href="#"
              className="article-link"
            >
              {article.title}
            </a>
            <p className="article-description">
              {article.description || "No description available."}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feed;
