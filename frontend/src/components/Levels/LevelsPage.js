import NavBarNew from "../Main/NavBarNew";
import Footer from "../Main/Footer";
import Levels from "./Levels";
import React, { useState } from 'react';

const LevelPage = ({ urlApiName, headerName }) => {

    return (
        <>
            <NavBarNew />
            <section>    
                <div className='content-holder-div'>
                    <Levels urlApi={urlApiName} header={headerName}/>
                </div>
            </section>
            
            <Footer />
        </>
        
    )
}

export default LevelPage