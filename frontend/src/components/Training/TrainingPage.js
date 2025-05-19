import NavBarNew from "../Main/NavBarNew";
import Footer from "../Main/Footer";
import Keyboard from "./Keyboard";
import useAuth from "../../hooks/UseAuth";
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import logo from "./fingeries.png";
import logo1 from "../Notes/keyboard-image.png";

const TrainingPage = () => {
    const { auth } = useAuth();
    const [showCreate, setShowCreate] = useState(false);

    const navigate = useNavigate();

    const createLevel = () => {
        window.open(window.location.origin + "/gameModal", '_blank', 'toolbar=0, location=0, menubar=0');
        //navigate('/gameModal');
    };

    return (
        <>
            <NavBarNew />
            <section className='admin-section' style={{paddingTop: '0', minHeight: '90vh'}}>
            <img src={logo1} alt="Logo" width='100%' height='200px'/>
                <div>
                <h2 className="list-headers" style={{background: 'black', color: '#fff', paddingTop: '15px', paddingBottom: '15px', fontSize: '40px'}}>Treniruotė</h2>
                    <p style={{textAlign: 'center', fontSize: '15px', paddingBottom: '30px'}}>Rekomenduojamas pirštų išsidėstymas:</p>
                    <div style={{width: '80%', margin: 'auto', display: 'flex', flexDirection: 'row'}}>
                        <Keyboard />
                        <div>
                            <img src={logo} alt="Logo" width='600px' height='300px'/>
                        </div>
                        
                    </div>
                    <p style={{textAlign: 'center', fontSize: '15px', paddingTop: '30px'}}>Norėdami pradėti treniruočių žaidimą spauskite:</p>
                    <div className="create-btn-div" style = {{width: '20%', margin: 'auto'}}>
                        <button onClick={createLevel} className="blue-button" style = {{width: '90%'}}> Treniruotis </button>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    )
}

export default TrainingPage