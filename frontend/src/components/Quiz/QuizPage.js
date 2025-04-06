import NavBarNew from "../Main/NavBarNew";
import Footer from "../Main/Footer";
import Quizes from "./Quizes";
import useAuth from "../../hooks/UseAuth";
import React, { useState } from 'react';

const QuizPage = () => {
    const { auth } = useAuth();

    return (
        <>
            <NavBarNew />
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