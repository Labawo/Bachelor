import NavBar from "../Main/NavBar";
import Footer from "../Main/Footer";
import Title from "../Main/Title";
import Quizes from "./Quizes";
import useAuth from "../../hooks/UseAuth";
import React, { useState } from 'react';

const QuizPage = () => {
    const { auth } = useAuth();

    return (
        <>
            <Title />
            <NavBar />
            <section>
                <div className='content-holder-div'>
                    <Quizes />
                </div>
            </section>
            
            <Footer />
        </>
        
    )
}

export default QuizPage