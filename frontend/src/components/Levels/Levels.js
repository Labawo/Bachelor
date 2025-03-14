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

    const canAccessAdmin = auth.roles.includes("Admin");
    

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

    const loadLevels = async () => {
        if (isLoading) return;

        setIsLoading(true);
        const data = await fetchLevels(page);
        console.log(data)
        setLevels(prevLevels => [...prevLevels, ...data]);
        setPage(prevPage => prevPage + 1);
        setIsLoading(false);
    };

    useEffect(() => {
        loadLevels();
    }, []); 

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
          console.error(`Error removing level ${levelId}:`, error);
          setErrorMessage("Error removing level.")
          setDeleteId("");
        }
    };

    return (
        <article className="therapies-container">
            <div className="table-container">
                <h2 className="list-headers">Levels List</h2>
                <div className="therapy-create-btn-div">
                    <button onClick={createLevel} className="therapy-create-btn"> Create Level </button>
                </div>
                {levels.length ? (
                    <table className="my-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>MinExperience</th>
                                <th>IsForWords</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {levels.map((level, i) => (
                                <tr key={i}>
                                    <td>{level?.name}</td>
                                    <td>{level?.minExperience}</td>
                                    <td>{level?.isForWords}</td>
                                    <td>
                                        <button 
                                            className="table-buttons-blue"
                                            onClick={() => updateLevel(level.id)}
                                        >
                                            <FontAwesomeIcon icon={faEdit} />
                                        </button>
                                        <button 
                                            className="table-buttons-blue"
                                            onClick={() => handleInspect(level.id)}
                                        >
                                            <FontAwesomeIcon icon={faSearch} />
                                        </button>
                                        <button
                                            className="table-buttons-red"
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
                    <p className="no-list-items-p">No levels to display</p>
                )}
                {isLoading ? (
                    <p>Loading...</p>
                ) : levels.length > 1 ? (
                    <button onClick={loadLevels} className="load-button-v1">Load More</button>
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
                message={"Are you sure you want to delete therapy?"}
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