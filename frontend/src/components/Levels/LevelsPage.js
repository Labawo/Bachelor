import NavBar from "../Main/NavBar";
import Footer from "../Main/Footer";
import Title from "../Main/Title";
import Levels from "./Levels"
import React, { useState } from 'react';

const LevelPage = () => {

    return (
        <>
            <Title />
            <NavBar />
            <section>                
                <div className='content-holder-div'>
                    <Levels />
                </div>
            </section>
            
            <Footer />
        </>
        
    )
}

export default LevelPage