import { useEffect, useState } from "react";
import Axios from "axios";

export default function QuizGenerator() {
    const [output, setOutput] = useState("Loading...")

    useEffect(() => {
        Axios.get("http://localhost:9000/quiz?articleid=1234").then((res) => {
            setOutput(JSON.stringify(res.data));
        })
    }, [])

    return (
        <div id="quizGenerator">
            <p>{output}</p>
        </div>
    )
}