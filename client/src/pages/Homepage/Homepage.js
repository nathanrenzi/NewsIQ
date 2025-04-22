import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Homepage.css";

export default function Homepage() {
  const navigate = useNavigate();

  return (
    <>
      <header className="top-bar">
        <span className="logo">NewsIQ</span>
      </header>

      <div className="homepage-container">
        <h1 className="headline">
          <span>Log in or make an account</span>
          <br />
          <span>to access NewsIQ!</span>
        </h1>

        <div className="auth-container">
          <Link to="/login" className="auth-box">
            Log In
          </Link>
          <div className="auth-or">Or</div>
          <Link to="/signup" className="auth-box">
            Sign Up
          </Link>
        </div>
      </div>
    </>
  );
}
