import React, { useState, useEffect, useCallback } from 'react';
import { jsQuizz } from "./constants";
import Quiz from "./Quiz";
import useAxiosPrivate from "../../hooks/UseAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import "./engineModal.css";

const QuizEngine = ({ show, onClose, levelId }) => {

    const navigate = useNavigate();
    const [words, setWords] = useState([]);
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(false);

    const axiosPrivate = useAxiosPrivate();

    const fetchQuiz = useCallback(async (lvlId) => {
        try {
            const response = await axiosPrivate.get(`/levels/quizes/${lvlId}`);
            return response.data;
        } catch (err) {
            console.error(err);
            navigate('/login', { state: { from: location }, replace: true });
            return [];
        }
    }, [axiosPrivate, navigate, location]);

    const loadQuiz = async (lvlId) => {
        if (isLoading) return;

        setIsLoading(true);
        const data = await fetchQuiz(lvlId);
        setWords([...data]);
        setIsLoading(false);
    };

    useEffect(() => {
        if(levelId !== 0) {
            loadQuiz(levelId);
            console.log(words);
        }       
    }, [levelId]);

    const handleClose = () => {
        setWords([]);
        onClose();
    };

    return (
        <>
            <div className={`modal-game ${show ? "show" : ""}`}>
                <div className="modal-content-game">
                    <div className='close-button-div-game'>
                        <button className="primary-button-game" onClick={handleClose}>X</button>
                    </div>
                    <div className='engine-holder-div'>
                        {words.length !== 0 ? <Quiz questions={words} currQuestion={0} /> : <p>No quizes</p>}
                    </div>                
                </div>
            </div>
        </>
        
    );
};

export default QuizEngine;