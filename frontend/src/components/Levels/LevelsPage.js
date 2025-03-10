import NavBar from "../Main/NavBar";
import Footer from "../Main/Footer";
import Title from "../Main/Title";
import React, { useState } from 'react';

const LevelPage = () => {

    return (
        <>
            <Title />
            <NavBar />
            <section>                
                <div className='content-holder-div'>
                    <p className="greeting-note">Hello to level page</p>
                </div>
            </section>
            
            <Footer />
        </>
        
    )
}

export default LevelPage