import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/UseAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faKey } from '@fortawesome/free-solid-svg-icons';
import EditUser from "./EditUser";
import ReactApexChart  from "react-apexcharts";

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
                const response = await axiosPrivate.get('/topUsers', {
                    signal: controller.signal
                });
                setUsers(response.data);
                console.log(response.data);
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

    return (
        <article>
            <div className="table-container" style={{borderTop : '2px solid black'}}>
                <div className='users-list-div' style={{background : 'black', color : '#fff', width : '100%', 
                    marginTop: '0', paddingLeft: '10px', 
                    paddingRight: '20px', paddingTop: '15px', paddingBottom: '10px'}}>
                    <span className='users-list-span times-two'>
                        <div className='users-list-header'>
                            <p>Top 10 geriausių žaidėjų sąrašas</p>
                        </div>
                    </span>
                </div>
                
                
                {users.length ? (
                    <table className="my-table top-players">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Naudotojo vardas</th>
                                <th>Ženkliukų skaičius</th>
                                <th>Registruotas nuo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, i) => (
                                <tr key={i} className={i === 0 ? 'first-place' : i === 1 ? 'second-place' : i === 2 ? 'third-place' : ''}>
                                    <td>{i+1}</td>
                                    <td>{user?.userName}</td>
                                    <td>{user?.badgeCount}</td>   
                                    <td>{user?.firstRegistrationYear}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : <p>No users to display</p>}
            </div>
        </article>
    );
};

export default Users;
