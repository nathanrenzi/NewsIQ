import { useParams } from "react-router-dom";

import QuizPanel from "./QuizPanel.js";
import "./style.css";

export default function QuizGenerator() {
    const { url, category, title } = useParams();

    return (
        <div id="quizPanelContainer">
            <QuizPanel articleURL={url} articleCategory={category} articleTitle={title} />
        </div>
    )
}