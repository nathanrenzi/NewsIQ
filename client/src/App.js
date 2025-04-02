import React from "react";
import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";

import QuizGenerator from "./pages/QuizGenerator/index.js"

export default function App() {
    return (
        <div id="app">
            <BrowserRouter>
                <Routes>
                    <Route index element={<QuizGenerator />} />
                </Routes>
            </BrowserRouter>
        </div>
    )
}