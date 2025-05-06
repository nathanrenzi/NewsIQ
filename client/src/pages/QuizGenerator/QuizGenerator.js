import { useSearchParams } from "react-router-dom";

import QuizPanel from "./QuizPanel.js";
import "./QuizPanel.css";

export default function QuizGenerator() {
    const [searchParams] = useSearchParams();
    const url = searchParams.getAll("url");
    const category = searchParams.getAll("category");
    const title = searchParams.getAll("title");

    return (
        <div id="quizPanelContainer">
            <QuizPanel articleURL={url} articleCategory={category} articleTitle={title} />
        </div>
    )
}