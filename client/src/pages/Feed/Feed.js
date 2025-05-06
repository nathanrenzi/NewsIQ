import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Feed.css';

const Feed = () => {
    const [search, setSearch] = useState("");
    const [articles, setArticles] = useState([]);
    const [articlesLoaded, setArticlesLoaded] = useState(false);
    const [multiSelect, setMultiSelect] = useState(false);
    const [selectedArticles, setSelectedArticles] = useState([]);
    const [selectedIndices, setSelectedIndices] = useState([]);
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setError(false);
        setArticlesLoaded(false);
        const delayDebounce = setTimeout(() => {
            const fetchNews = async () => {
                try {
                    const response = await axios.get(`http://localhost:9001/fetchArticles/${search == "" ? "no-search" : search}`);
                    setArticles(response.data);
                    setArticlesLoaded(true);
                } catch (error) {
                    setArticlesLoaded(false);
                    setError(true);
                    console.error("Error fetching news:", error);
                }
            };

            fetchNews();
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [search]);

    const handleCardClick = (articleTitle, articleIndex) => {
        if (multiSelect) {
            if (!selectedIndices.includes(articleIndex)) {
                setSelectedArticles(prev => [...prev, articleTitle]);
                setSelectedIndices(prev => [...prev, articleIndex]);
            }
            else {
                setSelectedArticles(prev => prev.filter(title => title !== articleTitle));
                setSelectedIndices(prev => prev.filter(index => index !== articleIndex));
            }
        }
        else {
            navigate(`/article?title=${encodeURIComponent(articleTitle)}`);
        }
    };

    const handleMultiSelectClick = () => {
        const params = new URLSearchParams();
        selectedArticles.forEach(value => {
            params.append('title', encodeURIComponent(value));
        });
        navigate(`/article?${params.toString()}`)
    }

    return (
        <div id="flexContainer">
            <div className="article-container">
                <div className="search-bar-div">
                    <input
                        type="text"
                        className="search-bar"
                        placeholder="Search for news..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button onClick={() => { setMultiSelect(!multiSelect); setSelectedIndices([]); setSelectedArticles([]); }} className={["search-multi", multiSelect ? "search-multi-selected" : "search-multi-notselected"].join(' ')}>
                        Multi-Select
                    </button>
                </div>
                {!error && articlesLoaded &&
                    <>
                    {
                        articles.map((article, index) => (
                            <div key={index} className={["article-card", selectedIndices.includes(index) ? "article-card-selected" : ""].join(' ')} onClick={() => handleCardClick(article.title, index)}>
                                <a
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
                    {multiSelect && selectedIndices.length > 0 && 
                        <div id="multi-panel">
                            <span>{selectedIndices.length} {selectedIndices.length > 1 ? "articles" : "article"} selected</span>
                            <button onClick={handleMultiSelectClick} id="multi-panel-button">Start Multi-Select!</button>
                        </div>
                    }
                    {articles.length == 0 &&
                        <span className="article-no-results">No results found.</span>
                    }
                    </>
                }
                {!error && !articlesLoaded &&
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
                {error &&
                    <span className="article-no-results">Could not load articles.</span>
                }
            </div>
        </div>
    );
};

export default Feed;
