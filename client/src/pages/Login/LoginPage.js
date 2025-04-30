import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./LoginPage.css";

export default function LoginPage() {
  // For form inputs & error message
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  // Help avigates to other routes
  const navigate = useNavigate();

  // Handles form submissions
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      // Login request
      await axios.post("http://localhost:9001/login", { 
        username, password 
      });
      // Navigates to user's profile if successful
      navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <>
      <form id="flexContainer" className="login-container" onSubmit={handleSubmit}>
        <h1 className="login-page-title">Log in</h1>

        <input
          type="text"
          className="login-input"
          placeholder="Enter Username..."
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          className="login-input"
          placeholder="Enter Password..."
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        {error && <div className="login-form-error">{error}</div>}

        <div className="login-actions-container">
          <Link to="/signup" className="login-action-box">
            Sign up?
          </Link>
          <button type="submit" className="login-submit-button">
            Submit
          </button>
        </div>

        <Link to="/forgot-password" className="login-forgot-link">
          Forgot Password?
        </Link>
      </form>
    </>
  );
}
