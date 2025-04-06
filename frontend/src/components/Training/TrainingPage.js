import NavBarNew from "../Main/NavBarNew";
import Footer from "../Main/Footer";
import Keyboard from "./Keyboard";
import useAuth from "../../hooks/UseAuth";
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import logo from "./fingeries.png";

const TrainingPage = () => {
    const { auth } = useAuth();
    const [showCreate, setShowCreate] = useState(false);

    const navigate = useNavigate();

    const createLevel = () => {
        navigate('/gameModal');
    };

    return (
        <>
            <NavBarNew />
            <section>
                <div className='content-holder-div'>
                    <h1>Rekomenduojamas pirštų išsidėstymas:</h1>
                        <Keyboard />
                    <img src={logo} alt="Logo" width='600px' height='300px'/>
                    <div className='inner-training-engine-div'>
                        <div className="create-btn-div">
                            <button onClick={createLevel} className="create-button"> Treniruotis </button>
                        </div>                      
                    </div>
                </div>
            </section>
            <Footer />
        </>
    )
}

export default TrainingPage