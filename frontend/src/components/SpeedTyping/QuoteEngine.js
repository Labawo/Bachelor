import React, { useState, useEffect } from 'react';
import TypingTest from "./TypingTest";
import useAxiosPrivate from "../../hooks/UseAxiosPrivate";
import "../Quiz/engineModal.css";

const QuoteEngine = ({ show, onClose, levelId }) => {

    const [content, setContent] = useState('');
    const [author, setAuthor] = useState('');
    const [source, setSource] = useState('');
    const [timeToComplete, setTimeToComplete] = useState(0);
    const [isTraining, setIsTraining] = useState(false);

    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        const fetchLevelData = async () => {
            try {
            const response = await axiosPrivate.get(`/levels/quotes/${levelId}/randomQuote`);
            const { source, author, content, timeToComplete } = response.data;
            setContent(content.length > 500 ? content.substring(0, content.indexOf(' ', 475)) : content);
            setSource(source);
            setAuthor(author);
            setTimeToComplete(timeToComplete);
            if(source.toLowerCase().includes("trenir") || source.toLowerCase().includes("treniruočių") || source.toLowerCase().includes("treniruo")) {
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
            setSource('');
            setAuthor('');
            setTimeToComplete(0);
        }
    }, [axiosPrivate, levelId]);

    const handleClose = () => {
        onClose();
    };

    return (
        <>
            <div className={`modal-game ${show ? "show" : ""}`}>
                <div className="modal-content-game">
                    <div className='close-button-div-game'>
                        <button className="primary-button-game" onClick={handleClose}>X</button>
                    </div>
                    <div>
                        <div style={{paddingLeft: '4.5%', paddingTop: '3%'}}>
                            <p style={{fontWeight: 'bold'}}>{source}</p>
                            <p style={{fontStyle: 'italic'}}>{author}</p>
                        </div>
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