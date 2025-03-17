import NavBar from "../Main/NavBar";
import Footer from "../Main/Footer";
import Title from "../Main/Title";
import React, { useState } from 'react';
import Badges from "./Badges"

const BadgesPage = () => {

    return (
        <>
            <Title />
            <NavBar />
            <section>                
                <div className='content-holder-div'>
                    <Badges />
                </div>
            </section>
            
            <Footer />
        </>
        
    )
}

export default BadgesPage