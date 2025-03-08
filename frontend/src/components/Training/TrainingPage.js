import NavBar from "../Main/NavBar";
import Footer from "../Main/Footer";
import Title from "../Main/Title";
import Game from "./Game";
import Keyboard from "./Keyboard";
import useAuth from "../../hooks/UseAuth";
import React, { useState } from 'react';
import logo from "./fingeries.png";

const TrainingPage = () => {
    const { auth } = useAuth();

    return (
        <>
            <Title />
            <NavBar />
            <section>
                <div className='training-engine-holder-div'>
                    <div className='inner-training-engine-div'>
                        <Game />                        
                    </div>
                </div>
                <div className='keyboard-div'>
                    <h1>Rekomenduojamas pirštų išsidėstymas:</h1>
                    <Keyboard />
                    <img src={logo} alt="Logo" width='600px' height='300px'/>
                </div>
            </section>
            <Footer />
        </>
    )
}

export default TrainingPage