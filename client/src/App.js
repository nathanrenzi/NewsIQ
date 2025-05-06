import React from "react";
import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";
import "./App.css";

import Auth from "./pages/Auth/Auth.js";
import LoginPage  from "./pages/Login/LoginPage.js";
import SignUpPage from "./pages/Signup/SignUpPage.js";
import QuizGenerator from "./pages/QuizGenerator/QuizGenerator.js";
import ArticlePage from "./pages/ArticlePage/ArticlePage.js";
import Feed from "./pages/Feed/Feed.js";
import Profile from "./pages/Profile/Profile.js";
import NavBar from "./components/NavBar/NavBar.js"
import Footer from "./components/Footer/Footer.js"

export default function App() {
    return (
        <div id="app">
            <BrowserRouter>
                <NavBar />
                <Routes>
                    <Route index element={<Feed />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/login"  element={<LoginPage  />} />
                    <Route path="/signup" element={<SignUpPage />} />
                    <Route path="/quiz" element={<QuizGenerator />} />
                    <Route path="/article" element={<ArticlePage /> } />
                    <Route path="/profile" element={<Profile />} />
                </Routes>
                <Footer />
            </BrowserRouter>
        </div>
    )
}