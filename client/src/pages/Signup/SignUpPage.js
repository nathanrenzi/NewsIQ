import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./SignUpPage.css";

export default function SignUpPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
        await axios.post("http://localhost:9001/signup", { 
            firstName, lastName, username, password 
        });

      navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <>
      <form id="flexContainer" className="signup-container" onSubmit={handleSubmit}>
        <h1 className="page-title">Sign Up</h1>

        <input
          type="text"
          className="signup-input"
          placeholder="Enter First Name..."
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          required
        />
        <input
          type="text"
          className="signup-input"
          placeholder="Enter Last Name..."
          value={lastName}
          onChange={e => setLastName(e.target.value)}
          required
        />
        <input
          type="text"
          className="signup-input"
          placeholder="Enter Username..."
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          className="signup-input"
          placeholder="Enter Password..."
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        {error && <div className="signup-form-error">{error}</div>}

        <div className="signup-actions-container">
          <Link to="/login" className="signup-action-box">
            Log in?
          </Link>
          <button type="submit" className="signup-submit-button">
            Submit
          </button>
        </div>
      </form>
    </>
  );
}
