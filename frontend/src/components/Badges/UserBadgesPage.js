import NavBar from "../Main/NavBar";
import Footer from "../Main/Footer";
import Title from "../Main/Title";
import React, { useState } from 'react';

const UserBadgesPage = () => {

    return (
        <>
            <Title />
            <NavBar />
            <section>                
                <div className='content-holder-div'>
                    <h1>Labas bakuganas</h1>
                </div>
            </section>
            
            <Footer />
        </>
        
    )
}

export default UserBadgesPage