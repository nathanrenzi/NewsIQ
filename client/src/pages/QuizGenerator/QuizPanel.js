import { useEffect, useState } from "react";
import Axios from "axios";

import Answer from "./Answer.js";

export default function QuizPanel() {
	const [quiz, setQuiz] = useState("");
    const [questionNumber, setQuestionNumber] = useState(0);
    const [answerVisuals, setAnswerVisuals] = useState({ answer1: "default", answer2: "default", answer3: "default", answer4: "default" });
    const [answersSelected, setAnswersSelected] = useState({});
    const [loaded, setLoaded] = useState(false);
    const [message, setMessage] = useState("Generating quiz...")

    useEffect(() => {
        // Getting the quiz JSON from the server and passing in (an unused) ArticleID parameter
        Axios.get("http://localhost:9000/quiz?articleid=1234").then((res) => {
            const data = res.data;
            if (!data || data === undefined) {
                setLoaded(false);
                setMessage("Quiz loading failed. Please retry or exit.")
            }
            else {
                setQuiz(data);
                setLoaded(true);
                console.log(data);
            }
        }).catch((error) => {
            console.log(error);
            setLoaded(false);
            setMessage("Quiz loading failed. Please retry or exit.")
        })
    }, []);

    function selectAnswer(selection) {
        if (!(questionNumber in answersSelected)) {
            answersSelected[questionNumber] = selection;
            setAnswersSelected(answersSelected);
            updateVisuals(questionNumber);
        }
    }

    function updateVisuals(qnum) {
        if (qnum in answersSelected) {
            const visuals = { answer1: "noselect", answer2: "noselect", answer3: "noselect", answer4: "noselect" };
            visuals[quiz["questions"][qnum]["correct"]] = "correct-not-selected";
            if (answersSelected[qnum] == quiz["questions"][qnum]["correct"]) {
                visuals[answersSelected[qnum]] = "correct";
            }
            else {
                visuals[answersSelected[qnum]] = "incorrect";
            }
            setAnswerVisuals(visuals);
        }
        else {
            const visuals = { answer1: "default", answer2: "default", answer3: "default", answer4: "default" };
            setAnswerVisuals(visuals);
        }
    }

    function nextQuestion() {
        if (questionNumber < quiz["questions"].length - 1) {
            setQuestionNumber(questionNumber + 1);
            updateVisuals(questionNumber + 1);
        }
    }

    function previousQuestion() {
        if (questionNumber > 0) {
            setQuestionNumber(questionNumber - 1);
            updateVisuals(questionNumber - 1);
        }
    }

    return (
        <div id="quizPanel">
            {loaded &&
                <>
                <div id="topDiv">
                    <button style={{ backgroundImage: `${process.env.PUBLIC_URL}/images/close.svg` }} id="exitButton" />
                    <a style={{flexGrow: 1, paddingLeft: "10px"}}>Question {questionNumber + 1} of {quiz["questions"].length}</a>
                </div>
                <div id="divider" />
                <a id="question">{quiz["questions"][questionNumber]["question"]}</a>
                <Answer type={answerVisuals["answer1"]} answer={quiz["questions"][questionNumber]["answer1"]} onClick={() => selectAnswer("answer1")} />
                <Answer type={answerVisuals["answer2"]} answer={quiz["questions"][questionNumber]["answer2"]} onClick={() => selectAnswer("answer2")} />
                <Answer type={answerVisuals["answer3"]} answer={quiz["questions"][questionNumber]["answer3"]} onClick={() => selectAnswer("answer3")} />
                <Answer type={answerVisuals["answer4"]} answer={quiz["questions"][questionNumber]["answer4"]} onClick={() => selectAnswer("answer4")} />
                <button id="navButton" onClick={() => previousQuestion()}>Previous Question</button>
                <button style={{ float: "right" }} id="navButton" onClick={() => nextQuestion()}>Next Question</button>
                </>
            }
            {!loaded &&
                <a>{message}</a>
            }
        </div>
    )
}