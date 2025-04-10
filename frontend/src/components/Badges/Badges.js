import { useState, useEffect, useCallback } from "react";
import useAxiosPrivate from "../../hooks/UseAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/UseAuth";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faSearch, faEdit } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from "../Modals/ConfirmationModal";
import ErrorModal from "../Modals/ErrorModal";
import CreateBadge from "./CreateBadge";
import EditBadge from "./EditBadge";

const Badges = () => {
    const [badges, setBadges] = useState([]);
    const [showCreate, setShowCreate] = useState(false);
    const [editBadgeId, setEditBadgeId] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();
    const [deleteId, setDeleteId] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loadBadgesFlag, setLoadBadgesFlag] = useState(false);

    const fetchBadges = useCallback(async () => {
        try {
            const response = await axiosPrivate.get('/badges');
            return response.data;
        } catch (err) {
            console.error(err);
            navigate('/login', { state: { from: location }, replace: true });
            return [];
        }
    }, [axiosPrivate, navigate, location]);

    const loadBadges = async () => {
        if (isLoading) return;
        setIsLoading(true);
        const data = await fetchBadges();
        console.log(data)
        setBadges([...data]);
        setIsLoading(false);
    };

    useEffect(() => {
        loadBadges();
    }, [loadBadgesFlag]); 

    const createBadge = () => {
        setShowCreate(true);
    };

    const updateBadge = (badgeId) => {
        setEditBadgeId(badgeId);
        setErrorMessage("");
    };

    const removeBadge = async (badgeId) => {
        try {
          await axiosPrivate.delete(`/badges/${badgeId}`);
          setBadges(prevBadges =>
            prevBadges.filter(badge => badge.id !== badgeId)
          );
          setDeleteId("");
        } catch (error) {
          console.error(`Error removing badge ${badgeId}:`, error);
          setErrorMessage("Error removing badge.")
          setDeleteId("");
        }
    };

    const closeCreateBadge = () => {
        setShowCreate(false);
        setLoadBadgesFlag(!loadBadgesFlag);
    }

    const closeEditBadge = () => {
        setEditBadgeId(0);
        setLoadBadgesFlag(!loadBadgesFlag);
    }

    return (
        <article className="list-article">
            <div className="table-container">
                <h2 className="list-headers">Ženklelių sąrašas</h2>
                <div style={{textAligh: 'center'}}>
                    <button onClick={createBadge} style={{marginLeft: '40%', width: '20%'}}> Sukurti Ženklelį </button>
                </div>
                {badges.length ? (
                    <div className='badge-div'>
                        {badges.map((badge, i) => (
                            <span key={i} className='badge-span'>
                                <p>{badge?.name}</p>
                                <p>{badge?.description}</p>
                                <p>{badge?.type}</p>
                                <div>
                                    <button 
                                        onClick={() => updateBadge(badge.id)}
                                    >
                                        <FontAwesomeIcon icon={faEdit} />
                                    </button>
                                    <button
                                        onClick={() => setDeleteId(badge.id)}
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>                                       
                                </div>    
                            </span>
                        ))}
                    </div>
                ) : (
                    <p className="no-list-items-p">Ženklelių nėra</p>
                )}
            </div>
            <ErrorModal
                show={errorMessage !== ""}
                onClose={() => setErrorMessage("")}
                message={errorMessage}
            />
            <ConfirmationModal 
                show={deleteId !== ""}
                onClose={() => setDeleteId("")}
                onConfirm={() => removeBadge(deleteId)}
                message={"Ar tikrai norite ištrinti ženkliuką?"}
            />
            <CreateBadge
                show={showCreate === true}
                onClose={closeCreateBadge}
            />
            <EditBadge
                show={editBadgeId !== 0}
                onClose={closeEditBadge}
                badgeId = {editBadgeId} 
            />
        </article>
    );
};

export default Badges;