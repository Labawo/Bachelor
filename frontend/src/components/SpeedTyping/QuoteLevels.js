import { useState, useEffect, useCallback } from "react";
import useAxiosPrivate from "../../hooks/UseAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/UseAuth";
import ErrorModal from "../Modals/ErrorModal";
import QuoteEngine from "./QuoteEngine";
import Keyboard from "../Training/Keyboard";
import logo2 from "../Training/fingeries.png";

const QuoteLevels = () => {
    const [levels, setLevels] = useState([]);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();
    const { auth } = useAuth();
    const [errorMessage, setErrorMessage] = useState("");
    const [gameId, setGameId] = useState(0);
    const [gameName, setGameName] = useState('');
    const [selectedLevelId, setSelectedLevelId] = useState('');
    const [selectedLevelName, setSelectedLevelName] = useState('');
    const [selectedLevelDescription, setSelectedLevelDescription] = useState('');
    const [selectedLevelExperience, setSelectedLevelExperience] = useState(0);
    const [selectedLevelRecords, setSelectedLevelRecords] = useState(0);
    const [sizesBool, setSizesBool] = useState(false);

    const fetchLevels = useCallback(async (pageNumber) => {
        try {
            const response = await axiosPrivate.get('/levels/quotes', {
                params: { pageNumber : pageNumber },
            });
            return response.data;
        } catch (err) {
            console.error(err);
            navigate('/login', { state: { from: location }, replace: true });
            return [];
        }
    }, [axiosPrivate, navigate, location]);

    const loadLevels = async (page) => {
        if (isLoading) return;

        setIsLoading(true);
        const data = await fetchLevels(page);
        console.log(data)
        setLevels([...data]);
        setIsLoading(false);
    };

    useEffect(() => {
        loadLevels(page);
    }, [page]); 

    const playQuote = (levelId, levelName) => {
        setGameId(levelId);
        setGameName(levelName);
    };

    const showList = () => {
        setSizesBool(false);
    };

    const setLevelData = (levelId, levelName, levelDescription, levelXp, levelRecords) => {
        setSelectedLevelId(levelId);
        setSelectedLevelName(levelName);
        setSelectedLevelDescription(levelDescription);
        setSelectedLevelExperience(levelXp);
        setSelectedLevelRecords(levelRecords);
        setSizesBool(true);
    };

    return (
        <article className="list-article" style={{background: 'lightgrey'}}>
            <div className='items-list-div' >
                <span className={`items-list-span ${sizesBool ? 'hidden' : 'times-two'}`} style={{background: '#fff', borderRight: '2px solid black', height: '100%'}}>
                    <div className='table-container'>
                        <h2 className="list-headers" style={{background: 'black', color: '#fff', paddingTop: '15px', paddingBottom: '15px', fontSize: '40px'}}>Citatų sąrašas pagal lygį</h2>
                        {levels.length ? (
                            <table className={`my-table ${sizesBool ? 'hidden' : ''}`}>
                                <thead>
                                    <tr>
                                        <th>Pavadinimas</th>
                                        <th>Patirtis</th>
                                        <th>Įrašų skaičius</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {levels.map((level, i) => (
                                        <tr key={i}>
                                            <td>{level?.name}</td>
                                            <td>{level?.minExperience}</td>
                                            <td>{level?.itemCount}</td>
                                            <td>
                                                <button 
                                                    className="blue-button"
                                                    style={{width: '35%'}}
                                                    onClick={() => setLevelData(level.id, level.name, level.description, level.minExperience, level.itemCount)}
                                                >
                                                    Plačiau
                                                </button>                                   
                                            </td>    
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="no-list-items-p">Lygių nėra</p>
                        )}
                        {isLoading ? (
                            <p>Loading...</p>
                        ) : levels.length >= 0 ? (
                            <div className="pagination-buttons">
                                <span className="pagination-buttons-span"><button className='pagination-btn' onClick={() => setPage(page === 1 ? page : page - 1)}>-</button></span>
                                <span className="pagination-buttons-span" style={{height: '50%', marginTop: 'auto', marginBottom:'auto'}}>{page}</span>
                                <span className="pagination-buttons-span"><button className='pagination-btn' onClick={() => setPage(levels.length === 0 ? page : page + 1)}>+</button></span>
                            </div>                    
                        ) : null}
                    </div>
                </span>
                <span className={`items-list-span ${sizesBool ? 'hidden' : ''}`} style={{background: '#fff', borderLeft: '2px solid black', height: '100%'}}>
                    <div>
                        <h2 style={{background: 'black', color: '#fff', paddingTop: '15px', paddingBottom: '15px', fontSize: '40px'}}>Paaiškinimas</h2>
                        <div style={{paddingLeft: '10px', paddingRight: '10px'}}>
                            <p style={{fontSize: '15px'}}>Paspaudę mygtuką <strong>Plačiau</strong> yra atidaromas lygio aprašymas. Norint gryžti atgal spaudžaimas mygtukas <strong>Išeiti</strong> esantis lygio aprašymo pradžioje kairėje pusėje.</p>
                            <p style={{fontSize: '15px'}}>Toliau galima pasirinkti žaisti lygį kurio metu bus atidarytas spartaus rašymo varikliukas.</p>
                        </div>
                    </div> 
                </span>
                <span className={`items-list-span ${sizesBool ? 'times-three' : 'hidden'}`} style={{background: '#fff', paddingBottom: '50px', height: '100%'}}>
                    <div>
                        <h2 style={{background: 'black', color: '#fff', paddingTop: '15px', paddingBottom: '15px', fontSize: '40px'}}>Lygio aprašymas</h2>
                        <div style={{width: '20%'}}>
                            <button onClick={showList} className='black-button' style={{width: '100%', fontSize: '15px'}}> Išeiti </button>
                        </div>
                        <div style={{fontSize: '15px'}}>
                            <h3 style={{borderBottom: '1px solid black', paddingTop: '10px', paddingBottom: '10px'}}>Pavadinimas</h3>
                            <p style={{textAlign: 'center'}}>{selectedLevelId !== '' ? selectedLevelName : ''}</p>
                            <h3 style={{borderBottom: '1px solid black', paddingTop: '10px', paddingBottom: '10px'}}>Aprašymas</h3>
                            <p style={{textAlign: 'center'}}>{selectedLevelId !== '' ? selectedLevelDescription : ''}</p>
                            <p style={{textAlign: 'center'}}>Rekomenduojamas pirštų išsidėstymas:</p>
                            <div style={{width: '80%', margin: 'auto', display: 'flex', flexDirection: 'row', paddingTop: '30px', paddingBottom: '10px'}}>
                                <Keyboard />
                                <div>
                                    <img src={logo2} alt="Logo" width='600px' height='300px'/>
                                </div>
                                
                            </div>
                        </div>
                        <p style={{textAlign: 'center', fontSize: '15px'}}>Norėdami pradėti žaidimą spauskite:</p>
                        {selectedLevelId !== '' ? (<div style={{width: '30%', margin: 'auto'}}>
                            <button 
                                className="blue-button"
                                style={{width: '100%', fontSize: '15px'}}
                                onClick={() => playQuote(selectedLevelId, selectedLevelName)}
                            >
                                Žaisti
                            </button>
                        </div>) : null}
                    </div>
                </span>
            </div>
            
            <ErrorModal
                show={errorMessage !== ""}
                onClose={() => setErrorMessage("")}
                message={errorMessage}
            />
            <QuoteEngine
                show={gameId !== 0}
                onClose={() => {setGameId(0); setGameName('')}}
                levelId={gameId}
                levelName={gameName}
            />
        </article>
    );
};

export default QuoteLevels;