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
            <section>
                <div className='engine-holder-div'>
                    <Quiz questions={jsQuizz.questions} />
                </div>  
            </section>
            
            <Footer />
        </>
        
    )
}

export default QuizPage