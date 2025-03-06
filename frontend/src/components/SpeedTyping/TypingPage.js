import NavBar from "../Main/NavBar";
import Footer from "../Main/Footer";
import Title from "../Main/Title";
import TypingTest from "./TypingTest"
import useAuth from "../../hooks/UseAuth";
import React, { useState } from 'react';

const TypingPage = () => {
    const { auth } = useAuth();

    return (
        <>
            <Title />
            <NavBar />
            <div className='gameboy-carcass'>
                <div className='gameboy-screen'>
                    <div className='engine-holder-div'>
                        <TypingTest />
                    </div>                   
                </div>
                <div className='arrow-button'></div>
                <div className='round-button'></div>
            </div>
                       
            <Footer />
        </>
        
    )
}

export default TypingPage