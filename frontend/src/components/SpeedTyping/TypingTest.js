import React, { useState, useRef, useEffect } from 'react';
import useAxiosPrivate from "../../hooks/UseAxiosPrivate";
import './typingtest.css';

const TypingTest = ({ content, timeToComplete }) => {

    const [timeLeft, setTimeLeft] = useState(timeToComplete);
    const [mistakes, setMistakes] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [isTyping, setIsTyping] = useState(false);
    const [WPM, setWPM] = useState(0);
    const [CPM, setCPM] = useState(0);
    const inputRef = useRef(null);
    const charRefs = useRef([]);

    const axiosPrivate = useAxiosPrivate();

    const [correctWrong, setCorrectWrong] = useState([]);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        inputRef.current.focus();
        setCorrectWrong(Array(charRefs.current.length).fill(''));
        setTimeLeft(0);
    }, [content]);

    useEffect(() => {
        let interval;
        if (isTyping && timeLeft > 0) {
            interval = setInterval(() => {

                setTimeLeft(timeLeft - 1);
                let correctChars = charIndex - mistakes;
                let totalTime = timeToComplete - timeLeft;

                let cpm = correctChars * (60 / totalTime);
                cpm = cpm < 0 || !cpm || cpm === Infinity ? 0 : cpm;
                setCPM(parseInt(cpm, 10));

                let wpm = Math.round((correctChars / 5 / totalTime) * 60);
                wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;
                setWPM(wpm);

            }, 1000);
        } else if (timeLeft === 0) {
            clearInterval(interval);
            setIsTyping(false);
        }
        return () => {
            clearInterval(interval);
        }
    }, [isTyping, timeLeft]);

    const resetGame = () => {
        setIsTyping(false);
        setTimeLeft(timeToComplete);
        setCharIndex(0);
        setMistakes(0);
        setCPM(0);
        setWPM(0);
        setCorrectWrong(Array(charRefs.current.length). fill(''));
        inputRef.current.focus();
    }

    const handleChange = (e) => {
        const characters = charRefs.current;
        const currentChar = charRefs.current[charIndex];
        let typedChar = e.target.value.slice(-1)
        if (charIndex < characters.length && timeLeft > 0) {
            if (!isTyping) {
                setIsTyping(true)
            }

            if (typedChar === currentChar.textContent) {
                setCharIndex(charIndex + 1);
                correctWrong[charIndex] = ' correct'
            } else {
                setCharIndex(charIndex + 1);
                setMistakes(mistakes + 1);
                correctWrong[charIndex] = ' wrong'
            }

            if(charIndex === characters.length - 1) {
                setIsTyping(false);
            } else {
                setIsTyping(true);
            }
        }
    }

    const handleEnding = async (cpm, wpm, mistakes, time) => {
        try {
          const speedData = {
            wpm: wpm,
            mistakes: mistakes,
            time: time,
          };
    
          const response = await axiosPrivate.post("/badgesnumber/quote", speedData);
    
          setSuccessMessage("Pabaiga, surinktas ženklelių skaičius!");
        } catch (error) {
          console.error("Klaida išsiunčiant rezultatus:", error);
          setErrorMessage("Klaida išsiunčiant rezultatus.");
        }
    };

    return (
        <div className='typing-test'>
            <div className='container'>
                <div className='test'>
                    <input type='text' className='speed-input-field' ref={inputRef} onChange={handleChange}/>
                    {
                        content.split("").map((char, index) => (
                            <span className={`char ${index === charIndex ? " active" : ""} ${correctWrong[index]}`} 
                            ref={(e) => charRefs.current[index] = e}>
                                {char}
                            </span>
                        ))
                    }
                </div>

                {timeLeft !== 0 ? (
                    <div className='result'>
                        <p>Likęs laikas: <strong>{timeLeft}</strong> </p>
                        <p>Klaidos: <strong>{mistakes}</strong></p>
                        <p>Žodžiai/min: <strong>{WPM}</strong> </p>
                        <button className='btn' onClick={resetGame}>Bandyti iš naujo</button>
                    </div>) : <button className='btn' onClick={resetGame}>Pradėti</button>}
            </div>
        </div>
        
    )
}

export default TypingTest