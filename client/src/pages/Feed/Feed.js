import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Feed.css';

const Feed = () => {
    const [search, setSearch] = useState("");
    const [articles, setArticles] = useState([]);
    const [articlesLoaded, setArticlesLoaded] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setArticlesLoaded(false);
        const delayDebounce = setTimeout(() => {
            const fetchNews = async () => {
                try {
                    const { data: { apiKey } } = await axios.get("http://localhost:9001/fetchNewsApiKey");
                    // Fetch news articles based on search (default to "latest")
                    const response = await axios.get(
                        `https://newsapi.org/v2/everything?q=${search || "latest"}&apiKey=${apiKey}`
                    );

                    setArticles(response.data.articles);
                    setArticlesLoaded(true);
                } catch (error) {
                    setArticlesLoaded(false);
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
            <div className="articles-container">
                <input
                    type="text"
                    className="search-bar"
                    placeholder="Search for news..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                {articlesLoaded &&
                    <>
                    {
                        articles.map((article, index) => (
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
                        ))
                    }
                    {articles.length == 0 &&
                        <span className="article-no-results">No results found.</span>
                        }
                    </>
                }
                {!articlesLoaded &&
                    <>
                        {
                            Array.from({ length: 20 }).map((_, index) => (
                                <div key={index} className="article-card-loading">
                                    <div className="article-card-spinner"></div>
                                </div>
                            ))
                        }
                    </>
                }
            </div>
        </div>
    );
};

export default Feed;
