import React from "react";

export default function Answer({type, answer, onClick}) {
    return (
        <button className={["answerButton", type].join(" ")} onClick={onClick}>{answer}</button>
    )
}