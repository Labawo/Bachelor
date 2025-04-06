import NavBarNew from "../Main/NavBarNew";
import Footer from "../Main/Footer";
import QuoteLevels from "./QuoteLevels";
import useAuth from "../../hooks/UseAuth";
import React, { useState } from 'react';

const TypingPage = () => {
    const { auth } = useAuth();

    return (
        <>
            <NavBarNew />
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