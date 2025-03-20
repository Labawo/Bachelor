import NavBar from "../Main/NavBar";
import Footer from "../Main/Footer";
import Title from "../Main/Title";
import Quiz from "./Quiz"
import Quizes from "./Quizes"
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
                {/*<div className='engine-holder-div' style={display='hidden'}>
                    <Quiz questions={jsQuizz.questions} />
                </div> */} 
                <div className='content-holder-div'>
                    <Quizes />
                </div>
            </section>
            
            <Footer />
        </>
        
    )
}

export default QuizPage