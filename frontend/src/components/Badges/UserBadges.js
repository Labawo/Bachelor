import { useState, useEffect, useCallback } from "react";
import useAxiosPrivate from "../../hooks/UseAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faSearch, faEdit } from '@fortawesome/free-solid-svg-icons';
import ErrorModal from "../Modals/ErrorModal";

const UserBadges = () => {
    const [badges, setBadges] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();
    const [errorMessage, setErrorMessage] = useState("");
    const [loadBadgesFlag, setLoadBadgesFlag] = useState(false);

    const fetchBadges = useCallback(async () => {
        try {
            const response = await axiosPrivate.get('badgesnumber/myBadges');
            return response.data;
        } catch (err) {
            console.error(err);
            //navigate('/login', { state: { from: location }, replace: true });
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

    return (
        <article className="list-article">
            <div className="table-container">
                <h2 className="list-headers">Mano ženkleliai</h2>
                {badges.length ? (
                    <table className="my-table">
                        <thead>
                            <tr>
                                <th>Pavadinimas</th>
                                <th>Aprašymas</th>
                                <th>Tipas</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {badges.map((badge, i) => (
                                <tr key={i}>
                                    <td>{badge?.name}</td>
                                    <td>{badge?.description}</td>
                                    <td>{badge?.type}</td>
                                    <td>                                      
                                    </td>    
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="no-list-items-p">Ženklelių nėra</p>
                )}
            </div>
            <ErrorModal
                show={errorMessage !== ""}
                onClose={() => setErrorMessage("")}
                message={errorMessage}
            />
        </article>
    );
};

export default UserBadges;