import { useState, useEffect, useCallback } from "react";
import useAxiosPrivate from "../../hooks/UseAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/UseAuth";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faSearch, faEdit } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from "../Modals/ConfirmationModal";
import ErrorModal from "../Modals/ErrorModal";

const Levels = () => {
    const [levels, setLevels] = useState([]);
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
        navigate(`/levels/createLevel`);
    };

    const updateLevel = (levelId) => {
        navigate(`/levels/${levelId}/editLevel`);
    };

    const removeLevel = async (levelId) => {
        try {
          await axiosPrivate.delete(`/levels/${levelId}`);
          setLevels(prevLevels =>
            preLevels.filter(level => level.id !== levelId)
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
                <h2 className="list-headers">Therapies List</h2>
                {canAccessDoctor && (
                    <div className="therapy-create-btn-div">
                        <button onClick={createTherapy} className="therapy-create-btn"> Create Therapy </button>
                    </div>                    
                )}
                {therapies.length ? (
                    <div className="therapy-list">
                        {therapies.map((therapy, i) => (
                            <div key={i} className="therapy-row">
                                <div className="therapy-info-name">
                                    <p>{therapy?.name}</p> 
                                </div>
                                <div className="therapy-info">
                                    <p>Psych. {therapy?.description}</p>
                                </div>
                                <div className="therapy-actions">
                                    
                                    {canAccessAdminOrCreator(therapy) ? (
                                        <>
                                            <button 
                                                className="table-buttons-blue"
                                                onClick={() => updateTherapy(therapy.id)}
                                            >
                                                <FontAwesomeIcon icon={faEdit} />
                                            </button>
                                        </>
                                    ) : <button className="mock-button"></button>}
                                    <button 
                                        className="table-buttons-blue"
                                        onClick={() => handleInspect(therapy.id)}
                                    >
                                        <FontAwesomeIcon icon={faSearch} />
                                    </button>
                                    {canAccessAdminOrCreator(therapy) && (
                                        <>
                                            <button
                                                className="table-buttons-red"
                                                onClick={() => setDeleteId(therapy.id)}
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="no-list-items-p">No therapies to display</p>
                )}
                {isLoading ? (
                    <p>Loading...</p>
                ) : therapies.length > 1 ? (
                    <button onClick={loadTherapies} className="load-button-v1">Load More</button>
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
                onConfirm={() => removeTherapy(deleteId)}
                message={"Are you sure you want to delete therapy?"}
            />
        </article>
    );
};

export default Levels;