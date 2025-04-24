import Footer from "./Footer";
import useAuth from "../../hooks/UseAuth";
import React, { useState } from 'react';
import NavBarNew from '../Main/NavBarNew';
import logo1 from "../Notes/keyboard-image.png";

const Home = () => {
    const { auth } = useAuth();

    return (
        <>
            <NavBarNew />
            <section style={{paddingTop: '0'}}>   
                <div style={{}}>
                    <img src={logo1} alt="Logo" width='100%' height='200px' className='image-container-pages' style={{marginLeft: 'auto'}}/>
                </div> 
                            
                <div className='content-holder-div' style={{marginTop: "10px"}}>
                    <p className="greeting-note">Hello <i><b>{auth.user}</b></i>, we are glad you are here! {auth.roles}  100 - (mistakes/length * 100) </p>
                    <h3>{auth.id}</h3>
                </div>
            </section>
            
            <Footer />
        </>
        
    )
}

export default Home