import { useState, useEffect, useCallback } from "react";
import useAxiosPrivate from "../../hooks/UseAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faSearch, faEdit } from '@fortawesome/free-solid-svg-icons';
import ErrorModal from "../Modals/ErrorModal";
import logo from "./badge-default.png";

const UserBadges = () => {
    const [badges, setBadges] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();
    const [errorMessage, setErrorMessage] = useState("");
    const [loadBadgesFlag, setLoadBadgesFlag] = useState(false);
    const [filter, setFilter] = useState('');
    const [filteredBadges, setFilteredBadges] = useState([]);

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

    useEffect(() => {
        setFilteredBadges(badges.filter(badge => badge.name.toLowerCase().includes(filter.toLowerCase())));       
    }, [badges, filter]);

    return (
        <article className="list-article">
            <div className="table-container">
                <div className='users-list-div' style={{background : 'black', color:'#fff', width : '100%', 
                    marginTop: '0', paddingLeft: '10px', 
                    paddingRight: '20px', paddingTop: '15px', paddingBottom: '10px'}}>
                    <span className='users-list-span times-two'>
                        <div className='users-list-header'>
                            <p>Mano ženklelių sąrašas</p>
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
                {filteredBadges.length ? (
                    <div className='badge-div'>
                        {filteredBadges.map((badge, i) => (
                            <span key={i} className='badge-span'>
                                <img src={logo} alt="Logo" width='80%' height='120px'/>
                                <p style={{fontWeight : '600'}}>{badge?.name}</p>
                                <p>{badge?.type}</p>
                                <div>
                                    <button
                                        className = 'red-button'
                                    >
                                        Peržiūrėti
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
        </article>
    );
};

export default UserBadges;