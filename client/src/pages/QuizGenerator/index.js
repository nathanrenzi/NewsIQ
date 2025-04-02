import { useEffect, useState } from "react";
import Axios from "axios";

import Answer from "./Answer.js";

export default function QuizGenerator() {
    const [quiz, setQuiz] = useState("Loading...");
    const [questionNumber, setQuestionNumber] = useState(0);

    useEffect(() => {
        // Getting the quiz JSON from the server and passing in (an unused) ArticleID parameter
        Axios.get("http://localhost:9000/quiz?articleid=1234").then((res) => {
            const data = JSON.stringify(res.data);
            setQuiz(data);
            console.log(data);
        }).catch((error) => {
            console.log(error);
            setQuiz("Error fetching quiz. Make sure server is running.")
        })
    }, [])

    return (
        <Answer />
    )
}