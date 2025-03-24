import NavBar from "../Main/NavBar";
import Footer from "../Main/Footer";
import Title from "../Main/Title";
import QuoteLevels from "./QuoteLevels";
import useAuth from "../../hooks/UseAuth";
import React, { useState } from 'react';

const TypingPage = () => {
    const { auth } = useAuth();

    return (
        <>
            <Title />
            <NavBar />
            <section>
                <div className='content-holder-div'>
                    <QuoteLevels /> 
                </div>
            </section>
                       
            <Footer />
        </>
        
    )
}

export default TypingPage