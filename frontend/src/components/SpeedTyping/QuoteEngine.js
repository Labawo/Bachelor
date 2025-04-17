import React, { useState, useEffect } from 'react';
import TypingTest from "./TypingTest";
import useAxiosPrivate from "../../hooks/UseAxiosPrivate";
import "../Quiz/engineModal.css";

const QuoteEngine = ({ show, onClose, levelId }) => {

    const [content, setContent] = useState('');
    const [timeToComplete, setTimeToComplete] = useState(0);
    const [isTraining, setIsTraining] = useState(false);

    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        const fetchLevelData = async () => {
            try {
            const response = await axiosPrivate.get(`/levels/quotes/${levelId}/randomQuote`);
            const { source, content, timeToComplete } = response.data;
            setContent(content.length > 500 ? content.substring(0, content.indexOf(' ', 475)) : content);
            setTimeToComplete(timeToComplete);
            if(source.toLowerCase().includes("treniruotė") || source.toLowerCase().includes("treniruočių") || source.toLowerCase().includes("treniruo")) {
                setIsTraining(true);
            }
            } catch (error) {
            console.error("Klaida gaunant citatą:", error);
            onClose();
            if (error.response && error.response.status === 403) {
                onClose();
            }
            }
        };

        if (levelId !== 0) {
            fetchLevelData();
        } else {
            setContent('');
            setTimeToComplete(0);
        }
    }, [axiosPrivate, levelId]);

    return (
        <>
            <div className={`modal-game ${show ? "show" : ""}`}>
                <div className="modal-content-game">
                    <div className='close-button-div-game'>
                        <button className="primary-button-game" onClick={onClose}>X</button>
                    </div>
                    
                    <div className='engine-holder-div'>
                        <TypingTest content={content} timeToComplete={timeToComplete} isTraining={isTraining}/>
                    </div>                
                </div>
            </div>
        </>
        
    );
};

export default QuoteEngine;