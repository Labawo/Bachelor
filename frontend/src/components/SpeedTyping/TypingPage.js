import NavBarNew from "../Main/NavBarNew";
import Footer from "../Main/Footer";
import QuoteLevels from "./QuoteLevels";
import useAuth from "../../hooks/UseAuth";
import React, { useState } from 'react';
import logo1 from "../Levels/quote-image.png";

const TypingPage = () => {
    const { auth } = useAuth();

    return (
        <>
            <NavBarNew />
            <section style={{color: 'black'}}>
                <img src={logo1} alt="Logo" width='100%' height='150px'/>
                <QuoteLevels /> 
            </section>
                       
            <Footer />
        </>
        
    )
}

export default TypingPage