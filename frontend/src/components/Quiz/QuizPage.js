import NavBar from "../Main/NavBar";
import Footer from "../Main/Footer";
import Title from "../Main/Title";
import Quiz from "./Quiz"
import { jsQuizz } from "./constants"
import useAuth from "../../hooks/UseAuth";
import React, { useState } from 'react';

const QuizPage = () => {
    const { auth } = useAuth();

    return (
        <>
            <Title />
            <NavBar />
            <div className='gameboy-carcass'>
                <div className='gameboy-screen'>
                    <div className='engine-holder-div'>
                        <Quiz questions={jsQuizz.questions} />
                    </div>                   
                </div>
                <div className='arrow-button'></div>
                <div className='round-button'></div>
            </div>
            
            <Footer />
        </>
        
    )
}

export default QuizPage