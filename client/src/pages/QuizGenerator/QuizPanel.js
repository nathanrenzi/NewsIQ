import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";

import Answer from "./Answer.js";

export default function QuizPanel({articleURL, articleTitle}) {
    // Stores the quiz JSON
    const [quiz, setQuiz] = useState("");
    // Stores the current question number
    const [questionNumber, setQuestionNumber] = useState(0);
    // Stores the current state of the answer visuals
    const [answerVisuals, setAnswerVisuals] = useState({ answer1: "default", answer2: "default", answer3: "default", answer4: "default" });
    // Stores the current state of the control button visuals
    const [controlVisuals, setControlVisuals] = useState({ previousButton: "", nextButton: "" });
    // Stores the selected answers for each question
    const [answersSelected, setAnswersSelected] = useState({});
    // Stores the number of correct answers
    const [questionsCorrect, setQuestionsCorrect] = useState(0);
    // Stores the number of questions
    const [totalQuestions, setTotalQuestions] = useState(0);
    // Stores if the quiz is loaded
    const [loaded, setLoaded] = useState(false);
    // Stores if an error has occurred
    const [error, setError] = useState(false);
    // Stores if the quiz is complete
    const [complete, setComplete] = useState(false);

    const navigate = useNavigate();

    function initializeQuiz() {
        // Getting the quiz JSON from the server and passing in the article ID
        setError(false);
        Axios.get(`http://localhost:9001/quiz/${encodeURIComponent(articleURL)}`).then((res) => {
            const data = res.data;
            if (!data || data === undefined) {
                setLoaded(false);
                setError(true);
            }
            else {
                setQuiz(data);
                initializeValues(data);
            }
        }).catch((error) => {
            console.log(error);
            setLoaded(false);
            setError(true);
        })
    }

    function initializeValues(data) {
        setComplete(false);
        setError(false);
        setLoaded(true);
        setQuestionNumber(0);
        setQuestionsCorrect(0);
        setTotalQuestions(data["questions"].length);
        setAnswersSelected({});
        setAnswerVisuals({ answer1: "default", answer2: "default", answer3: "default", answer4: "default" })
        const controlVisuals = { previousButton: "previousButtonDisabled", nextButton: "" };
        setControlVisuals(controlVisuals);
    }

    useEffect(() => {
        initializeQuiz();
    }, []);

    function selectAnswer(selection) {
        if (!(questionNumber in answersSelected)) {
            answersSelected[questionNumber] = selection;
            setAnswersSelected(answersSelected);
            updateVisuals(questionNumber);
            if (Object.keys(answersSelected).length === quiz["questions"].length) {
                setComplete(true);
            }
            if (quiz["questions"][questionNumber]["correct"] === selection) {
                setQuestionsCorrect(questionsCorrect + 1);
            }
        }
    }

    function updateVisuals(qnum) {
        if (qnum in answersSelected) {
            const visuals = { answer1: "noselect", answer2: "noselect", answer3: "noselect", answer4: "noselect" };
            visuals[quiz["questions"][qnum]["correct"]] = "correct-not-selected";
            if (answersSelected[qnum] === quiz["questions"][qnum]["correct"]) {
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

        const controlVisuals = { previousButton: "", nextButton: "" };
        if (qnum === 0) {
            controlVisuals["previousButton"] = "previousButtonDisabled";
        }
        if (qnum === quiz["questions"].length - 1) {
            controlVisuals["nextButton"] = "nextButtonDisabled";
        }
        setControlVisuals(controlVisuals);
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

    function backToArticle() {
        navigate(`/article/${articleTitle}`)
    }

    function getQuestionResult(qnum) {
        const visual = answersSelected[qnum] === quiz["questions"][qnum]["correct"] ? "correct" : "incorrect";
        const num = parseInt(qnum) + 1;

        return (
            <div key={qnum} className={[visual, "questionResult"].join(' ')}>
                {num}
            </div>
        )
    }

    return (
        <div id="quizPanel">
            {error && !loaded &&
                <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                    <div>Error generating quiz. Please retry, or try again later.</div>
                    <div className="divider" />
                <div style={{ display: "flex", gap: "20px" }}>
                        <button onClick={() => initializeQuiz()} id="retryButton">Retry</button>
                    <button onClick={() => navigate("/")} id="homeButton">Home</button>
                </div>
                </div>
            }
            {loaded && !complete && !error &&
                <>
                <div id="topDiv">
                    <button onClick={() => backToArticle()} id="exitButton" />
                    <div style={{ flexGrow: 1, paddingLeft: "10px" }}>Question {questionNumber + 1} of {totalQuestions}</div>
                </div>
                <div className="divider" />
                <div id="question">{quiz["questions"][questionNumber]["question"]}</div>
                <Answer type={answerVisuals["answer1"]} answer={quiz["questions"][questionNumber]["answer1"]} onClick={() => selectAnswer("answer1")} />
                <Answer type={answerVisuals["answer2"]} answer={quiz["questions"][questionNumber]["answer2"]} onClick={() => selectAnswer("answer2")} />
                <Answer type={answerVisuals["answer3"]} answer={quiz["questions"][questionNumber]["answer3"]} onClick={() => selectAnswer("answer3")} />
                <Answer type={answerVisuals["answer4"]} answer={quiz["questions"][questionNumber]["answer4"]} onClick={() => selectAnswer("answer4")} />
                <button id="previousButton" className={["navButton", controlVisuals["previousButton"]].join(' ')} onClick={() => previousQuestion()}>Previous Question</button>
                <button id="nextButton" style={{ float: "right" }} className={["navButton", controlVisuals["nextButton"]].join(' ')} onClick={() => nextQuestion()}>Next Question</button>
                </>
            }
            {loaded && complete && !error &&
                <>
                <div id="resultsTopDiv">
                    <div id="results">Quiz Results</div>
                </div>
                <div className="divider-no-margin" />
                <div id="questionResultDiv">
                    {Object.keys(answersSelected).map(i => getQuestionResult(i))}
                </div>
                <div style={{ marginTop: "30px", textAlign: "center"}}>
                    <div>You got {questionsCorrect} out of {totalQuestions} questions correct!</div>
                </div>
                <div style={{ marginTop: "30px", display: "flex", justifyContent: "space-between" }}>
                    <button onClick={() => backToArticle()} id="backToArticleButton" className="default">Back to article</button>
                    <button onClick={() => initializeValues()} id="retryButton">Retry</button>
                    <button onClick={() => navigate("/")} id="homeButton">Home</button>
                </div>
                </>
            }
            {!loaded && !error &&
                <div>Generating quiz...</div>
            }
        </div>
    )
}