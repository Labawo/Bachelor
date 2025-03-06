import NavBar from "../Main/NavBar";
import Footer from "../Main/Footer";
import Title from "../Main/Title";
import Game from "./Game"
import useAuth from "../../hooks/UseAuth";
import React, { useState } from 'react';

const TrainingPage = () => {
    const { auth } = useAuth();

    return (
        <>
            <Title />
            <NavBar />
            <div className='gameboy-carcass'>
                <div className='gameboy-screen'>
                    <div className='engine-holder-div'>
                        <Game />
                    </div>                   
                </div>
                <div className='arrow-button'></div>
                <div className='round-button'></div>
            </div>
            <Footer />
        </>
        
    )
}

export default TrainingPage