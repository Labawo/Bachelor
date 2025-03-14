import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/UseAxiosPrivate";
import NavBar from "../Main/NavBar";
import Footer from "../Main/Footer";
import Title from "../Main/Title";

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
            <Title />
            <NavBar />
            <section className="therapy-page">
                
                {level ? (
                    <div className='content-holder-div'>
                        <h2>{level.name}</h2>
                        <p>Description: {level.minExperience}</p>
                    </div>
                ) : (
                    <p>Loading level details...</p>
                )}
            </section>
            <Footer />
        </>
        
    );
};

export default LevelPage;