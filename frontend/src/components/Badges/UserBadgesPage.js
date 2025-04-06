import NavBarNew from "../Main/NavBarNew";
import Footer from "../Main/Footer";
import React, { useState } from 'react';
import UserBadges from "./UserBadges";

const UserBadgesPage = () => {

    return (
        <>
            <NavBarNew />
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