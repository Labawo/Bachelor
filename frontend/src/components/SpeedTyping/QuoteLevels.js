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

    return (
        <article className="list-article">
            <div className="table-container">
                <h2 className="list-headers">Lygių sąrašas</h2>
                {levels.length ? (
                    <table className="my-table">
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
                                            className="play-button"
                                            onClick={() => playQuote(level.id)}
                                        >
                                            Žaisti
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
                        <button onClick={() => setPage(page === 1 ? page : page - 1)} className="load-button-v1">-</button>
                        <button onClick={() => setPage(levels.length === 0 ? page : page + 1)} className="load-button-v1">+</button>
                        <div className='page-number-div'><p>{page}</p></div>
                    </div>                    
                ) : null}
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