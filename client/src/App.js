import React from "react";
import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";
import "./App.css"

import Homepage from "./pages/Homepage/index.js";
import QuizGenerator from "./pages/QuizGenerator/index.js";

export default function App() {
    return (
        <div id="app">
            <BrowserRouter>
                <Routes>
                    <Route index element={<Homepage />} />
                    <Route path="/quiz" element={<QuizGenerator /> } />
                </Routes>
            </BrowserRouter>
        </div>
    )
}