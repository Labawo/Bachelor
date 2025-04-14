import { useState, useEffect, useCallback } from "react";
import useAxiosPrivate from "../../hooks/UseAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/UseAuth";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faSearch, faEdit } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from "../Modals/ConfirmationModal";
import ErrorModal from "../Modals/ErrorModal";
import EditLevel from "./EditLevel";
import CreateLevel from "./CreateLevel";

const Levels = ({ urlApi, header }) => {
    const [levels, setLevels] = useState([]);
    const [editLevelId, setEditLevelId] = useState(0);
    const [isNextPage, setIsNextPage] = useState(false);
    const [filter, setFilter] = useState('');
    const [filteredLevels, setFilteredLevels] = useState([]);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();
    const { auth } = useAuth();
    const [deleteId, setDeleteId] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [showCreate, setShowCreate] = useState(false);
    

    const handleInspect = (levelId) => {
        navigate(`/levels/${levelId}`);
    };   

    const fetchLevels = useCallback(async (pageNumber) => {
        try {
            const response = await axiosPrivate.get(`/levels/${urlApi}`, {
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
    }, [page, urlApi]); 

    useEffect(() => {
        setFilteredLevels(levels.filter(level => level.name.toLowerCase().includes(filter.toLowerCase())));       
    }, [levels, filter]); 

    const updateLevel = (levelId) => {
        setEditLevelId(levelId);
    };

    const removeLevel = async (levelId) => {
        try {
          await axiosPrivate.delete(`/levels/${levelId}`);
          setLevels(prevLevels =>
            prevLevels.filter(level => level.id !== levelId)
          );
          setDeleteId("");
        } catch (error) {
          console.error(`Klaida trinant lygį ${levelId}:`, error);
          setErrorMessage("Klaida trinant lygį.")
          setDeleteId("");
        }
    };

    const createLevel = () => {
        setShowCreate(true);
    };

    return (
        <article className="list-article">
            <div className="table-container" >
                <div className='users-list-div' style={{background : 'lightgrey', width : '100%', 
                    marginTop: '0', paddingLeft: '10px', 
                    paddingRight: '20px', paddingTop: '15px', paddingBottom: '10px'}}>
                    <span className='users-list-span times-two'>
                        <div className='users-list-header'>
                            <p>{header}</p>
                        </div>
                    </span>
                    <span className='users-list-span'>
                        <div className="filter-container">
                            <div className="filter-container-inside">
                                <input
                                    type="text"
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                    placeholder="Filtruoti pagal pavadinimą"
                                    className="filter-container-input"
                                />
                            </div>  
                        </div>
                    </span>
                </div>
                {/*<div className="create-btn-div">
                    <button onClick={createLevel}> Sukurti Lygį </button>
                </div>*/}
                {filteredLevels.length ? (
                    <table className="my-table">
                        <thead>
                            <tr>
                                <th>Pavadinimas</th>
                                <th>Patirtis</th>
                                <th>Skirtas testams?</th>
                                <th>Įrašų skaičius</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLevels.map((level, i) => (
                                <tr key={i}>
                                    <td>{level?.name}</td>
                                    <td>{level?.minExperience}</td>
                                    <td>{level?.isForWords ? "TAIP" : "NE"}</td>
                                    <td>{level?.itemCount}</td>
                                    <td>
                                        <button 
                                            className="load-button-v1"
                                            onClick={() => updateLevel(level.id)}
                                        >
                                            <FontAwesomeIcon icon={faEdit} />
                                        </button>
                                        <button 
                                            className="load-button-v1"
                                            onClick={() => handleInspect(level.id)}
                                        >
                                            <FontAwesomeIcon icon={faSearch} />
                                        </button>
                                        <button
                                            className="load-button-v1"
                                            onClick={() => setDeleteId(level.id)}
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
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
                ) : levels.length >= 0 && filter === '' ? (
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
            <ConfirmationModal 
                show={deleteId !== ""}
                onClose={() => setDeleteId("")}
                onConfirm={() => removeLevel(deleteId)}
                message={"Ar tikrai norite pašalinti lygį?"}
            />
            <EditLevel
                show={editLevelId !== 0}
                onClose={() => setEditLevelId(0)}
                levelId = {editLevelId} 
            />
            <CreateLevel 
                show={showCreate === true}
                onClose={() => setShowCreate(false)}
            />
        </article>
    );
};

export default Levels;