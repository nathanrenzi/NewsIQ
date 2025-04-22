import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./ArticlePage.module.css";
import axios from "axios";

export default function ArticlePage() {
    const [article, setArticle] = useState({});
    const [loaded, setLoaded] = useState(false);
    const [notFound, setNotFound] = useState(false);
    const navigate = useNavigate();
    const { title } = useParams();

    useEffect(() => {
        axios.get(`http://localhost:9001/article/:${title}`)
            .then((res) => {
                setArticle(res.data);
                setLoaded(true);
                setNotFound(false);
            })
            .catch((error) => {
                setLoaded(false);
                setNotFound(true);
            })
    }, []);

    const navigateToQuiz = () => {
        if (!article) return;
        navigate(`/quiz/${encodeURIComponent(article.url)}/$${encodeURIComponent(article.title)}`);
    }

    return (
        <div id="flexContainer">
            <article id="contentContainer">
                {!loaded && !notFound &&
                    <div className={styles.loading}>Loading...</div>
                }
                {loaded && !notFound &&
                    <>
                    <h1 className={styles.header}>{article.title}</h1>
                    <div className={styles.authors}><span style={{ color: "var(--primary-color-dark)" }}>Author:</span> {article.authors}</div>
                    <div className={styles.authors}><span style={{ color: "var(--primary-color-dark)" }}>Original Article:</span> <a href={article.url} target="_blank">Link</a></div>
                    <img className={styles.image} src={article.urlToImage} />
                    <div className={styles.content} dangerouslySetInnerHTML={{ __html: article.html }} />
                    <button onClick={navigateToQuiz} className={styles.quizButton}>Take a quiz on this article!</button>
                    </>
                }
                {notFound &&
                    <>
                    <h1 className={styles.header}>404 Article Not Found</h1>
                    <button className={styles.homeButton} onClick={() => navigate("/") }>Home</button>
                    </>
                }
            </article>
        </div>
    )
}