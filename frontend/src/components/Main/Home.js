import NavBar from "./NavBar";
import Footer from "./Footer";
import Title from "./Title";
import useAuth from "../../hooks/UseAuth";
import React, { useState } from 'react';

const Home = () => {
    const { auth } = useAuth();

    return (
        <>
            <Title />
            <NavBar />
            <section>                
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