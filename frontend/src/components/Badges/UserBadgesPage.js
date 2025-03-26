import NavBar from "../Main/NavBar";
import Footer from "../Main/Footer";
import Title from "../Main/Title";
import React, { useState } from 'react';
import UserBadges from "./UserBadges";

const UserBadgesPage = () => {

    return (
        <>
            <Title />
            <NavBar />
            <section>                
                <div className='content-holder-div'>
                    <UserBadges />
                </div>
            </section>
            
            <Footer />
        </>
        
    )
}

export default UserBadgesPage