import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/UseAxiosPrivate";
import NavBarAdmin from "../Main/NavBarAdmin";
import Footer from "../Main/Footer";
import Words from "../Words/Words";
import Quotes from "../Quotes/Quotes";
import logo1 from "../Notes/keyboard-image.png";

const LevelPage = () => {
    const { levelId } = useParams();
    const [level, setLevel] = useState(null);
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLevel = async () => {
            try {
                const response = await axiosPrivate.get(`/levels/${levelId}`);
                setLevel(response.data.resource);
            } catch (error) {
                console.error(error);
                if (error.response && error.response.status === 404) {
                    navigate(-1);
                }
            }
        };

        fetchLevel();
    }, [axiosPrivate, levelId]);

    return (
        <>
            <NavBarAdmin />
            <section className='admin-section' style={{paddingTop: '0'}}>
                <img src={logo1} alt="Logo" width='100%' height='200px'/>
                {level ? (
                    <div  style={{paddingTop: '0'}}>
                        <p style={{background: 'black', color: '#fff', paddingTop: '10px', paddingBottom: '10px', marginBottom: '10px', textAlign : 'left', paddingLeft: '5%', fontWeight: '600', fontSize: '40px'}}>Lygio aprašymas</p>
                        <h2> Lygio pavadinimas: {level.name}</h2>
                        <h2 style={{paddingBottom: "10px"}}>Patirtis: {level.minExperience}</h2>
                        <h2> Lygio informacija: {level.description}</h2>
                        {level.isForWords ? <Words levelId={level.id}/> : <Quotes levelId={level.id} /> }
                    </div>
                ) : (
                    <p>Kraunamas lygių apibųdinimas</p>
                )}
            </section>
            <Footer />
        </>
        
    );
};

export default LevelPage;