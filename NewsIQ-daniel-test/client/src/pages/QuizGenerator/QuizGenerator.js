import { useParams } from "react-router-dom";

import QuizPanel from "./QuizPanel.js";
import "./style.css";

export default function QuizGenerator() {
    const { url, title } = useParams();

    return (
        <div id="quizPanelContainer">
            <QuizPanel articleURL={url} articleTitle={title} />
        </div>
    )
}