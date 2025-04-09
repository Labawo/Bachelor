import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/UseAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faKey } from '@fortawesome/free-solid-svg-icons';
import EditUser from "./EditUser";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [secondFilter, setSecondFilter] = useState(false);
    const [filter, setFilter] = useState('');
    const [emailFilter, setEmailFilter] = useState('');
    const [selectedUserId, setSelectedUserId] = useState('');
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const controller = new AbortController();
        const getUsers = async () => {
            try {
                const response = await axiosPrivate.get('/users', {
                    signal: controller.signal
                });
                setUsers(response.data);
            } catch (err) {
                console.error(err);
                navigate('/login', { state: { from: location }, replace: true });
            }
        };

        getUsers();

        return () => {
            controller.abort();
        };
    }, [axiosPrivate, navigate, location]);

    useEffect(() => {
        if(secondFilter){
            setFilteredUsers(users.filter(user => user.userName.toLowerCase().includes(filter.toLowerCase())));
        }
        else {
            setFilteredUsers(users.filter(user => user.email.toLowerCase().includes(emailFilter.toLowerCase())));
        }       
    }, [users, filter, emailFilter]); 

    const deleteUser = async (userId) => {
        const confirmDelete = window.confirm("Ar tikrai norite ištrinti naudotoją?");
        if (confirmDelete) {
            try {
                await axiosPrivate.delete(`/users/${userId}`);
                setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
            } catch (error) {
                console.error(`Klaida trinant naudotoją ${userId}:`, error);
            }
        }
    };

    return (
        <article>
            <div className="table-container">
                <div className='users-list-div'>
                    <span className='users-list-span times-two'>
                        <div className='users-list-header'>
                            <p>Naudotojų sąrašas</p>
                        </div>
                    </span>
                    <span className='users-list-span'>
                        <div className="filter-container">
                            <div className="filter-container-inside">
                                <input
                                    type="text"
                                    value={filter}
                                    onClick={() => setSecondFilter(true)}
                                    onChange={(e) => setFilter(e.target.value)}
                                    placeholder="Filtruoti pagal vardą"
                                    className="filter-container-input"
                                />
                                <input
                                    type="text"
                                    value={emailFilter}
                                    onClick={() =>setSecondFilter(false)}
                                    onChange={(e) => setEmailFilter(e.target.value)}
                                    placeholder="Filtruoti pagal el paštą"
                                    className="filter-container-input"
                                />
                            </div>  
                        </div>
                    </span>
                </div>
                
                
                {filteredUsers.length ? (
                    <table className="my-table">
                        <thead>
                            <tr>
                                <th>Vardas</th>
                                <th>El. paštas</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user, i) => (
                                <tr key={i}>
                                    <td>{user?.userName}</td>
                                    <td>{user?.email}</td>
                                    <td>
                                        <button
                                            className="load-button-v1"
                                            onClick={() => deleteUser(user.id)}
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                        <button
                                            className="load-button-v1"
                                            onClick={() => {
                                                setSelectedUserId(user.id);
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faKey} />
                                        </button>                                        
                                    </td>    
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : <p>No users to display</p>}
            </div>
            <EditUser 
                show={selectedUserId != ''}
                onClose={() => setSelectedUserId('')}
                userId={selectedUserId}
            />
        </article>
    );
};

export default Users;
