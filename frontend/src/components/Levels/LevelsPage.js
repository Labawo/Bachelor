import NavBarNew from "../Main/NavBarNew";
import Footer from "../Main/Footer";
import Levels from "./Levels";
import React, { useState } from 'react';
import logo1 from "./quiz-image.png";
import logo2 from "./quote-image.png";

const LevelPage = ({ urlApiName, headerName, flag }) => {

    return (
        <>
            <NavBarNew />
            
            <section className='admin-section' style={{paddingTop: '0'}}>    
                {flag ? (<img src={logo1} alt="Logo" width='100%' height='150px'/>  ) : (<img src={logo2} alt="Logo" width='100%' height='150px'/>)}
                <Levels urlApi={urlApiName} header={headerName} headerBackgroundColor={flag ? 'black' : 'black'}/>
            </section>
            
            <Footer />
        </>
        
    )
}

export default LevelPage