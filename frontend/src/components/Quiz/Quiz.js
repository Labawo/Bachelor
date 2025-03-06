import { useState } from "react";
import './quiz.css'
import { resultInitialState } from "./constants"
import AnswerTimer from "../QuizTimer/AnswerTimer"

const Quiz = ({ questions }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answerIdx, setAnswerIdx] = useState(null);
    const [answer, setAnswer] = useState(null);
    const [result, setResult] = useState(resultInitialState);
    const [showResult, setShowResult] = useState(false);
    const [showAnswerTimer, setShowAnswerTimer] = useState(true);
    const [inputAnswer, setInputAnswer] = useState('');

    const { question, choices, correctAnswer, type } = questions[currentQuestion];

    const onAnswerClick = (answer, index) => {
        setAnswerIdx(index);
        if (answer === correctAnswer) {
            setAnswer(true);
        } else {
            setAnswer(false);
        }
    };

    const onClickNext = (finalAnswer) => {
        setAnswerIdx(null);
        setShowAnswerTimer(false);
        setResult((prev) => 
            finalAnswer
                ? {
                    ...prev,
                    score: prev.score + 5,
                    correctAnswers: prev.correctAnswers + 1,
                }
                : {
                    ...prev,
                    wrongAnswers: prev.wrongAnswers + 1,
                }
        );

        if (currentQuestion !== questions.length - 1) {
            setCurrentQuestion((prev) => prev + 1);
        } else {
            setCurrentQuestion(0);
            setShowResult(true);
        }

        setInputAnswer('');

        setTimeout(() => {
            setShowAnswerTimer(true);
        });
    };

    const onTryAgain = () => {
        setResult(resultInitialState);
        setShowResult(false);
    };

    const handleTimeUp = () => {
        setAnswer(false);
        onClickNext(false);
    };

    const handleInputChange = (evt) => {
        setInputAnswer(evt.target.value);

        if(evt.target.value === correctAnswer) {
            setAnswer(true);
        } else {
            setAnswer(false);
        }
    }

    const getAnswerUI = () => {

        if(type === "FIB") {
            return <input className = 'quiz-input' value={inputAnswer} onChange={handleInputChange}/>
        }

        return (<ul className="quiz-ul">
            {
                choices.map((answer, index) => (
                    <li
                        onClick={() => onAnswerClick(answer, index)}
                        key={answer}
                        className={`quiz-li ${answerIdx === index ? 'selected-answer' : null}`}
                        >
                            {answer}
                    </li>
                ))
            }
        </ul>);
    };

    return (
        <div className="quiz-container">
            {!showResult ? (<>
                {showAnswerTimer && <AnswerTimer duration={5} onTimeUp={handleTimeUp}/>}
                <span className="active-question-no">{currentQuestion + 1}</span>
                <span className="total-questions">/{questions.length}</span>
                <h2 className="quiz-question">{question}</h2>
                {getAnswerUI()}
                <div className='quiz-footer'>
                    <button className="quiz-button" onClick={() => onClickNext(answer)} disabled={answerIdx === null && !inputAnswer}>
                        {currentQuestion === questions.length - 1 ? "Finish" : "Next"}
                    </button>
                </div>
            </>) : <div className='quiz-result'>
                    <h3 className='quiz-h3'>Result</h3>
                    <p className='quiz-p'>
                        Total Questions: <span className='quiz-span'>{questions.length}</span>
                    </p>
                    <p className='quiz-p'>
                        Total Score: <span className='quiz-span'>{result.score}</span>
                    </p>
                    <p className='quiz-p'>
                        Correct Answers: <span className='quiz-span'>{result.correctAnswers}</span>
                    </p>
                    <p>
                        Wrong Answers: <span className='quiz-span'>{result.wrongAnswers}</span>
                    </p>
                    <button onClick={onTryAgain} className="quiz-button">
                        Try again
                    </button>
                </div>}
            
        </div>
    )
};

export default Quiz;