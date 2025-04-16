import NavBarNew from "../Main/NavBarNew";
import Footer from "../Main/Footer";
import React, { useState } from 'react';
import UserBadges from "./UserBadges";
import TopUsers from "../Users/TopUsers";
import logo from "./badges-image.png";

const UserBadgesPage = () => {

    return (
        <>
            <NavBarNew />
            <section style={{marginTop: '0', color:"black", overflow:'auto', maxHeight:'85vh'}}>    
            <img src={logo} alt="Logo" width='100%' height='200px'/>            
                <div >
                    <UserBadges />
                </div>
                <div>
                    <TopUsers />
                </div>
            </section>
            
            <Footer />
        </>
        
    )
}

export default UserBadgesPage