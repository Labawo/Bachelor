import Footer from "./Footer";
import useAuth from "../../hooks/UseAuth";
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import NavBarNew from '../Main/NavBarNew';
import logo1 from "../Notes/keyboard-image.png";
import "./home.css";

const Home = () => {
    const { auth } = useAuth();

    const [showFirst, setShowFirst] = useState(false);
    const [showSecond, setShowSecond] = useState(false);
    const [showThird, setShowThird] = useState(false);
    const [showFourth, setShowFourth] = useState(false);

    const handleShowFirst = () => { setShowFirst(!showFirst); };
    const handleShowSecond = () => { setShowSecond(!showSecond);};
    const handleShowThird = () => { setShowThird(!showThird)};
    const handleShowFourth = () => { setShowFourth(!showFourth)};

    return (
        <>
            <NavBarNew />
            <section style={{paddingTop: '0', marginBottom: '50px'}}>   
                <div style={{}}>
                    <img src={logo1} alt="Logo" width='100%' height='200px' className='image-container-pages' style={{marginLeft: 'auto'}}/>
                </div> 
                            
                <button className={`collapsible ${showFirst ? 'active' : ''}`} onClick={handleShowFirst}>Naudotojo vadovas nr. 1</button>
                <div className={`content ${showFirst ? 'show-content' : 'hide-content'}`}>
                    <p>Prisijungus prie sistemos tiek administratoriui, tiek mokiniui matomi 6 puslapiai ir kurių du yra bendri.</p>
                    <p>Mokiniui pasirinkus spartaus rašymo arba testų sistema bus aprašoma ka juose galima daryti.</p>
                    <p>Mokinys pasirinkęs ženklelių skiltį yra nukreipiamas į savo ženkliukų puslapį kuriame taip pat gali matyti geriausių žaidėjų sąrašą.</p>
                    <p>Pasirinkus profilį tiek studentas tiek administratorius gali atsijungti ir keisti slaptažodžius tačiau studentas taip pat gali matyti statistiką apie savo rašymo greitį, turimą patirtį tiek testų, tiek spartaus rašymo žaidimuose ir surinktą ženklelių skaičių.</p>
                    <p>Administratorius pasirindamas nuvedęs pelę į lygių skiltį gali pasirinkti peržiūrėti dviejų tipų lygius arba sukurti naują lygį.</p>
                    <p>Prisijungus prie sistemos tiek administratoriui, tiek mokiniui matomi 6 puslapiai ir kurių du yra bendri.</p>
                    <p>Mokiniui pasirinkus spartaus rašymo arba testų sistema bus aprašoma ka juose galima daryti.</p>
                </div>
                <button className={`collapsible ${showSecond ? 'active' : ''}`} onClick={handleShowSecond}>Naudotojo vadovas nr. 2</button>
                <div className={`content ${showSecond ? 'show-content' : 'hide-content'}`}>
                    <p>Mokinys pasirinkęs ženklelių skiltį yra nukreipiamas į savo ženkliukų puslapį kuriame taip pat gali matyti geriausių žaidėjų sąrašą.</p>
                    <p>Pasirinkus profilį tiek studentas tiek administratorius gali atsijungti ir keisti slaptažodžius tačiau studentas taip pat gali matyti statistiką apie savo rašymo greitį, turimą patirtį tiek testų, tiek spartaus rašymo žaidimuose ir surinktą ženklelių skaičių.</p>
                    <p>Administratorius pasirindamas nuvedęs pelę į lygių skiltį gali pasirinkti peržiūrėti dviejų tipų lygius arba sukurti naują lygį.</p>
                    <p>Prisijungus prie sistemos tiek administratoriui, tiek mokiniui matomi 6 puslapiai ir kurių du yra bendri.</p>
                    <p>Mokiniui pasirinkus spartaus rašymo arba testų sistema bus aprašoma ka juose galima daryti.</p>
                    <p>Mokinys pasirinkęs ženklelių skiltį yra nukreipiamas į savo ženkliukų puslapį kuriame taip pat gali matyti geriausių žaidėjų sąrašą.</p>
                    <p>Pasirinkus profilį tiek studentas tiek administratorius gali atsijungti ir keisti slaptažodžius tačiau studentas taip pat gali matyti statistiką apie savo rašymo greitį, turimą patirtį tiek testų, tiek spartaus rašymo žaidimuose ir surinktą ženklelių skaičių.</p>
                </div>
                <button className={`collapsible ${showThird ? 'active' : ''}`} onClick={handleShowThird}>Naudotojo vadovas nr. 3</button>
                <div className={`content ${showThird ? 'show-content' : 'hide-content'}`}>
                    <p>Administratorius pasirindamas nuvedęs pelę į lygių skiltį gali pasirinkti peržiūrėti dviejų tipų lygius arba sukurti naują lygį.</p>
                    <p>Mokinys pasirinkęs ženklelių skiltį yra nukreipiamas į savo ženkliukų puslapį kuriame taip pat gali matyti geriausių žaidėjų sąrašą.</p>
                    <p>Pasirinkus profilį tiek studentas tiek administratorius gali atsijungti ir keisti slaptažodžius tačiau studentas taip pat gali matyti statistiką apie savo rašymo greitį, turimą patirtį tiek testų, tiek spartaus rašymo žaidimuose ir surinktą ženklelių skaičių.</p>
                    <p>Administratorius pasirindamas nuvedęs pelę į lygių skiltį gali pasirinkti peržiūrėti dviejų tipų lygius arba sukurti naują lygį.</p>
                    <p>Prisijungus prie sistemos tiek administratoriui, tiek mokiniui matomi 6 puslapiai ir kurių du yra bendri.</p>
                    <p>Mokiniui pasirinkus spartaus rašymo arba testų sistema bus aprašoma ka juose galima daryti.</p>
                    <p>Mokinys pasirinkęs ženklelių skiltį yra nukreipiamas į savo ženkliukų puslapį kuriame taip pat gali matyti geriausių žaidėjų sąrašą.</p>
                    <p>Pasirinkus profilį tiek studentas tiek administratorius gali atsijungti ir keisti slaptažodžius tačiau studentas taip pat gali matyti statistiką apie savo rašymo greitį, turimą patirtį tiek testų, tiek spartaus rašymo žaidimuose ir surinktą ženklelių skaičių.</p>
                    <p>Administratorius pasirindamas nuvedęs pelę į lygių skiltį gali pasirinkti peržiūrėti dviejų tipų lygius arba sukurti naują lygį.</p>
                    <p>Mokinys pasirinkęs ženklelių skiltį yra nukreipiamas į savo ženkliukų puslapį kuriame taip pat gali matyti geriausių žaidėjų sąrašą.</p>
                    <p>Pasirinkus profilį tiek studentas tiek administratorius gali atsijungti ir keisti slaptažodžius tačiau studentas taip pat gali matyti statistiką apie savo rašymo greitį, turimą patirtį tiek testų, tiek spartaus rašymo žaidimuose ir surinktą ženklelių skaičių.</p>
                    <p>Administratorius pasirindamas nuvedęs pelę į lygių skiltį gali pasirinkti peržiūrėti dviejų tipų lygius arba sukurti naują lygį.</p>
                </div>
                <button className={`collapsible ${showFourth ? 'active' : ''}`} onClick={handleShowFourth}>Naudotojo vadovas nr. 4</button>
                <div className={`content ${showFourth ? 'show-content' : 'hide-content'}`}>
                    <p>Prisijungus prie sistemos tiek administratoriui, tiek mokiniui matomi 6 puslapiai ir kurių du yra bendri.</p>
                    <p>Mokiniui pasirinkus spartaus rašymo arba testų sistema bus aprašoma ka juose galima daryti.</p>
                    <p>Mokinys pasirinkęs ženklelių skiltį yra nukreipiamas į savo ženkliukų puslapį kuriame taip pat gali matyti geriausių žaidėjų sąrašą.</p>
                    <p>Pasirinkus profilį tiek studentas tiek administratorius gali atsijungti ir keisti slaptažodžius tačiau studentas taip pat gali matyti statistiką apie savo rašymo greitį, turimą patirtį tiek testų, tiek spartaus rašymo žaidimuose ir surinktą ženklelių skaičių.</p>
                    <p>Administratorius pasirindamas nuvedęs pelę į lygių skiltį gali pasirinkti peržiūrėti dviejų tipų lygius arba sukurti naują lygį.</p>
                </div>
            </section>
            
            <Footer />
        </>
        
    )
}

export default Home