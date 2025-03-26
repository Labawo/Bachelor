import { useState, useEffect, useCallback } from "react";
import useAxiosPrivate from "../../hooks/UseAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/UseAuth";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faSearch, faEdit } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from "../Modals/ConfirmationModal";
import ErrorModal from "../Modals/ErrorModal";
import CreateLevel from "./CreateLevel";
import EditLevel from "./EditLevel";

const Levels = () => {
    const [levels, setLevels] = useState([]);
    const [showCreate, setShowCreate] = useState(false);
    const [editLevelId, setEditLevelId] = useState(0);
    const [isNextPage, setIsNextPage] = useState(false);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();
    const { auth } = useAuth();
    const [deleteId, setDeleteId] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleInspect = (levelId) => {
        navigate(`/levels/${levelId}`);
    };   

    const fetchLevels = useCallback(async (pageNumber) => {
        try {
            const response = await axiosPrivate.get('/levels', {
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

    const createLevel = () => {
        setShowCreate(true);
    };

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

    return (
        <article className="list-article">
            <div className="table-container">
                <h2 className="list-headers">Lygių sąrašas</h2>
                <div className="create-btn-div">
                    <button onClick={createLevel} className="create-button"> Sukurti Lygį </button>
                </div>
                {levels.length ? (
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
                            {levels.map((level, i) => (
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
            <ConfirmationModal 
                show={deleteId !== ""}
                onClose={() => setDeleteId("")}
                onConfirm={() => removeLevel(deleteId)}
                message={"Ar tikrai norite pašalinti lygį?"}
            />
            <CreateLevel 
                show={showCreate === true}
                onClose={() => setShowCreate(false)}
            />
            <EditLevel
                show={editLevelId !== 0}
                onClose={() => setEditLevelId(0)}
                levelId = {editLevelId} 
            />
        </article>
    );
};

export default Levels;