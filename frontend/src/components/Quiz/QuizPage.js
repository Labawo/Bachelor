import NavBarNew from "../Main/NavBarNew";
import Footer from "../Main/Footer";
import Quizes from "./Quizes";
import useAuth from "../../hooks/UseAuth";
import React, { useState } from 'react';
import logo1 from "../Levels/quiz-image.png";

const QuizPage = () => {
    const { auth } = useAuth();

    return (
        <>
            <NavBarNew />
            <section style={{color: 'black'}}>
                <img src={logo1} alt="Logo" width='100%' height='150px'/> 
                <Quizes />
            </section>
            <Footer />
        </>
        
    )
}

export default QuizPage