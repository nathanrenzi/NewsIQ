import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";

export default function Auth() {
    const navigate = useNavigate();

    return (
        <div id="flexContainer">
            <div id="contentContainer">
                <h1 className="auth-headline">
                    Welcome to NewsIQ
                </h1>
                <h2 className="auth-subheadline">Stay informed, Stay ahead.</h2>
                <p className="auth-text">Log in to access curated news, take quizzes on what you read, and boost your knowledge one article at a time.</p>
                <p className="auth-text-bottom">Don't have an account yet? Sign up and start your learning journey.</p>
                <div className="auth-container">
                    <Link to="/login" className="auth-box">
                        Log In
                    </Link>
                    <Link to="/signup" className="auth-box">
                        Sign Up
                    </Link>
                </div>
            </div>
        </div>
    );
}
