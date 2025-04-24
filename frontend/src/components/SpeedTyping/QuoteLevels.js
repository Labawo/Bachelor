import { useState, useEffect, useCallback } from "react";
import useAxiosPrivate from "../../hooks/UseAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/UseAuth";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faSearch, faEdit } from '@fortawesome/free-solid-svg-icons';
import ErrorModal from "../Modals/ErrorModal";
import QuoteEngine from "./QuoteEngine";

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

    const playQuote = (levelId) => {
        setGameId(levelId);
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
                <span className={`items-list-span ${sizesBool ? '' : 'times-two'}`} style={{background: '#fff', borderRight: '2px solid black', height: '100%'}}>
                    <div className='table-container'>
                        <h2 className="list-headers" style={{background: 'black', color: '#fff', paddingTop: '15px', paddingBottom: '15px'}}>Citatų sąrašas pagal lygį</h2>
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
                                                    className="gold-button"
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
                <span className={`items-list-span ${sizesBool ? 'times-two' : ''}`} style={{background: '#fff', borderLeft: '2px solid black', height: '100%'}}>
                    <div>
                        <h2 style={{background: 'black', color: '#fff', paddingTop: '15px', paddingBottom: '15px'}}>Lygio aprašymas</h2>
                        <h3>Pavadinimas</h3>
                        <p style={{textAlign: 'center'}}>{selectedLevelId !== '' ? selectedLevelName : ''}</p>
                        <h3>Aprašymas</h3>
                        <p style={{textAlign: 'center'}}>{selectedLevelId !== '' ? selectedLevelDescription : ''}</p>
                        <h3>Patirtis</h3>
                        <p style={{textAlign: 'center'}}>{selectedLevelId !== '' ? selectedLevelExperience : ''}</p>
                        {selectedLevelId !== '' ? (<div style={{width: '35%', margin: 'auto'}}>
                            <button 
                                className="green-button"
                                style={{width: '100%', color: 'rgb(56, 56, 56)'}}
                                onClick={() => playQuote(selectedLevelId)}
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
                onClose={() => setGameId(0)}
                levelId={gameId}
            />
        </article>
    );
};

export default QuoteLevels;