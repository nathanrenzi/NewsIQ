import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./Profile.module.css";

export default function Profile() {
    const [scores, setScores] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch scores from localStorage
        const storedScores = localStorage.getItem('quizScores');
        if (storedScores) {
            setScores(JSON.parse(storedScores));
        }
        setLoaded(true);
    }, []);

    return (
        <div id="flexContainer">
            <div id="contentContainer">
                <h1 className={styles.header}>Your Profile</h1>
                <div className={styles.scoresContainer}>
                    {loaded && scores.length > 0 ? (
                        scores.map((score, index) => (
                            <div key={index} className={styles.scoreCard}>
                                <h2 className={styles.category}>{score.category}</h2>
                                <div className={(score.questionsCorrect / score.questionsTotal * 100) < 50 ? styles.badPercentage : styles.goodPercentage}>{(score.questionsCorrect / score.questionsTotal * 100).toFixed(1)}%</div>
                            </div>
                        ))
                    ) : (
                        <div className={styles.noScores}>No quiz scores yet. Take some quizzes and come back to see your progress!</div>
                    )}
                </div>
                <button className={styles.homeButton} onClick={() => navigate("/")}>Home</button>
            </div>
        </div>
    );
} 