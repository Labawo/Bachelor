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
                <div className='content-holder-div inline-chd'>
                    <div className='content-holder-div left-chd'>
                        <Levels />
                    </div>
                    <div className='content-holder-div right-chd'>
                        <Levels />
                    </div>
                </div>
                
            </section>
            
            <Footer />
        </>
        
    )
}

export default LevelPage