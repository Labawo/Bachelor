import { useState } from "react";
import './quiz.css';
import { resultInitialState } from "./constants";
import AnswerTimer from "../QuizTimer/AnswerTimer";
import useAxiosPrivate from "../../hooks/UseAxiosPrivate";
import SuccessSelectModal from "../Modals/SuccessSelectModal";

const Quiz = ({ questions, currQuestion }) => {
    const [currentQuestion, setCurrentQuestion] = useState(currQuestion);
    const [answerIdx, setAnswerIdx] = useState(null);
    const [answer, setAnswer] = useState(null);
    const [result, setResult] = useState(resultInitialState);
    const [showResult, setShowResult] = useState(false);
    const [showAnswerTimer, setShowAnswerTimer] = useState(true);
    const [inputAnswer, setInputAnswer] = useState('');
    const axiosPrivate = useAxiosPrivate();

    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const { question, choices, correctAnswer, isOpen } = questions[currentQuestion];

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
            let answer = result.correctAnswers / questions.length * 100;
            handleEnding(answer);
        }

        setInputAnswer('');

        setTimeout(() => {
            setShowAnswerTimer(true);
        });
    };

    const handleEnding = async (score) => {
        try {
            const speedData = {
                points: score,
            };
            const response = await axiosPrivate.post("/badgesnumber/quiz", speedData);

            setSuccessMessage(`Pabaiga, surinktas ženklelių skaičius : ${response.data}!`);
        } catch (error) {
          console.error("Klaida išsiunčiant rezultatus:", error);
          setErrorMessage("Klaida išsiunčiant rezultatus.");
        }
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

        if(isOpen) {
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
        <div>
            {!showResult ? (<div className='timer-div-main'>
                {showAnswerTimer && <AnswerTimer duration={10} onTimeUp={handleTimeUp}/>}
            </div>) : null}
            
            <div className="quiz-container">
                {!showResult ? (<>
                    
                    <span className="active-question-no">{currentQuestion + 1}</span>
                    <span className="total-questions">/{questions.length}</span>
                    <h2 className="quiz-question">{question}</h2>
                    {getAnswerUI()}
                    <div className='quiz-footer'>
                        <button className="quiz-button" onClick={() => onClickNext(answer)} disabled={answerIdx === null && !inputAnswer}>
                            {currentQuestion === questions.length - 1 ? "Baigti" : "Kitas"}
                        </button>
                    </div>
                </>) : <div className='quiz-result'>
                        <h3 className='quiz-h3'>Rezultatas</h3>
                        <p className='quiz-p'>
                            Iš viso klausimų: <span className='quiz-span'>{questions.length}</span>
                        </p>
                        <p className='quiz-p'>
                            Surinkti taškai: <span className='quiz-span'>{result.score}</span>
                        </p>
                        <p className='quiz-p'>
                            Teisingi atsakymai: <span className='quiz-span'>{result.correctAnswers}</span>
                        </p>
                        <p className='quiz-p'>
                            Neteisingi atsakymai: <span className='quiz-span'>{result.wrongAnswers}</span>
                        </p>
                        <button onClick={onTryAgain} className="quiz-button">
                            Bandyti dar kartą.
                        </button>
                    </div>}
                
            </div>
            <SuccessSelectModal
                show={successMessage !== ""}
                onClose={() => setSuccessMessage("")}
                message={successMessage}
            />
        </div>
        
    )
};

export default Quiz;