import NavBar from "../Main/NavBar";
import Footer from "../Main/Footer";
import Title from "../Main/Title";
import TypingTest from "./TypingTest"
import useAuth from "../../hooks/UseAuth";
import React, { useState } from 'react';
import QuoteLevels from "./QuoteLevels"

const TypingPage = () => {
    const { auth } = useAuth();

    return (
        <>
            <Title />
            <NavBar />
            <section>
                <div className='engine-holder-div'>
                    <TypingTest />
                </div>
            </section>
                       
            <Footer />
        </>
        
    )
}

export default TypingPage