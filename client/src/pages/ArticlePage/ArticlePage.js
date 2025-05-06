import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./ArticlePage.module.css";
import axios from "axios";

import Footer from "../../components/Footer/Footer.js";

export default function ArticlePage() {
    const [urlList, setUrlList] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    const [titleList, setTitleList] = useState([]);
    const [articleList, setArticleList] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const titleParams = searchParams.getAll("title");

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const results = await Promise.all(
                    titleParams.map(title => axios.get(`http://localhost:9001/article/${title}`))
                );

                const urls = [];
                const categories = [];
                const titles = [];
                const articles = [];

                for (const res of results) {
                    urls.push(res.data.url);
                    categories.push(res.data.category);
                    titles.push(res.data.title);
                    articles.push(res.data);
                }
                setUrlList(urls);
                setCategoryList(categories);
                setTitleList(titles);
                setArticleList(articles);
                setLoaded(true);
                setNotFound(false);
            }
            catch(error) {
                console.error("Error fetching articles: ", error);
                setLoaded(false);
                setNotFound(true);
            }
            setLoading(false);
        }
        setLoading(true);
        fetchArticles();

    }, [searchParams]);

    const buildSearchParams = (key, list) => {
        const params = new URLSearchParams();
        list.forEach(value => {
            params.append(key, encodeURIComponent(value));
        });
        return params.toString();
    }

    const navigateToQuiz = () => {
        if (!articleList || articleList.length == 0) return;
        navigate(`/quiz?${buildSearchParams("url", urlList)}&${buildSearchParams("category", categoryList)}&${buildSearchParams("title", titleList)}`);
    }

    return (
        <>
            <div id="flexContainer">
                <article id="contentContainer">
                    {loading && !loaded && !notFound &&
                        <div className={styles.loading}>Loading...</div>
                    }
                    {loaded && !notFound && articleList.map((article, index) => {
                        return (
                            <div key={index}>
                                <h1 className={styles.header}>{article.title}</h1>
                                <div className={styles.authors}><span style={{ color: "var(--text-color-dark)" }}>Author:</span> {article.authors}</div>
                                <div className={styles.authors}><span style={{ color: "var(--text-color-dark)" }}>Original Article:</span> <a className={styles.link} href={article.url} target="_blank">Link</a></div>
                                <img className={styles.image} src={article.urlToImage} />
                                <div className={styles.content} dangerouslySetInnerHTML={{ __html: article.html }} />
                                {index == articleList.length - 1 &&
                                    <button onClick={navigateToQuiz} className={styles.quizButton}>{articleList.length > 1 ? "Take a quiz on these articles!" : "Take a quiz on this article!"}</button>
                                }
                            </div>
                        )
                    })
                    }
                    {notFound &&
                        <>
                            <h1 className={styles.headerCentered}>404 Article Not Found</h1>
                            <button className={styles.homeButton} onClick={() => navigate("/")}>Home</button>
                        </>
                    }
                </article>
            </div>
        </>
    )
}