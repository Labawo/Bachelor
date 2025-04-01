import NavBar from "../Main/NavBar";
import Footer from "../Main/Footer";
import Title from "../Main/Title";
import Levels from "./Levels";
import CreateLevel from "./CreateLevel";
import React, { useState } from 'react';

const LevelPage = () => {

    const [showCreate, setShowCreate] = useState(false);

    const createLevel = () => {
        setShowCreate(true);
    };

    return (
        <>
            <Title />
            <NavBar />
            <section>    
                <div className='content-holder-div inline-chd'>
                    <h2 className="list-headers">Lygių sąrašas</h2>
                    <div className="create-btn-div">
                        <button onClick={createLevel} className="create-button"> Sukurti Lygį </button>
                    </div>
                    <div className='content-holder-div left-chd'>
                        <Levels urlApi={'forWords'} header={'Testų lygiai'}/>
                    </div>
                    <div className='content-holder-div right-chd'>
                        <Levels urlApi={'notForWords'} header={'Citatų lygiai'}/>
                    </div>
                </div>
                <CreateLevel 
                    show={showCreate === true}
                    onClose={() => setShowCreate(false)}
                />
                
            </section>
            
            <Footer />
        </>
        
    )
}

export default LevelPage