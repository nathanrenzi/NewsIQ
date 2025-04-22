import React from "react";
import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";
import "./App.css";

import Homepage from "./pages/Homepage/Homepage.js";
import QuizGenerator from "./pages/QuizGenerator/QuizGenerator.js";
import ArticlePage from "./pages/ArticlePage/ArticlePage.js";
import Feed from "./pages/Feed/Feed.js";

export default function App() {
    return (
        <div id="app">
            <BrowserRouter>
                <Routes>
                    <Route index element={<Homepage />} />
                    <Route path="/quiz/:url/:title" element={<QuizGenerator />} />
                    <Route path="/article/:title" element={<ArticlePage /> } />
                    <Route path="/feed" element={<Feed /> } />
                </Routes>
            </BrowserRouter>
        </div>
    )
}