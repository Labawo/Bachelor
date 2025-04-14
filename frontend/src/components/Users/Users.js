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

    const [graph, setGraph] = useState({
          
        series: [
          {
            name: "Naudotojai",
            data: [28, 29, 33, 36, 32, 32, 33, 1, 1, 3, 0]
          }
        ],
        options: {
          chart: {
            height: 350,
            type: 'line',
            dropShadow: {
              enabled: true,
              color: '#000',
              top: 18,
              left: 7,
              blur: 10,
              opacity: 0.5
            },
            zoom: {
              enabled: false
            },
            toolbar: {
              show: false
            }
          },
          colors: ['#77B6EA', '#545454'],
          dataLabels: {
            enabled: true,
          },
          stroke: {
            curve: 'smooth'
          },
          title: {
            text: 'Naudotojų skaičius',
            align: 'center'
          },
          grid: {
            borderColor: '#e7e7e7',
            row: {
              colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
              opacity: 0.5
            },
          },
          markers: {
            size: 1
          },
          xaxis: {
            categories: ['Sausis', 'Vasaris', 'Kovas', 'Balandis', 'Gegužė', 'Birželis', 'Liepa', 'Rugpjutis', 'Rugsėjis', 'Spalis', 'Lapkritis', 'Gruodis'],
            title: {
              text: 'Mėnuo'
            }
          },
          yaxis: {
            title: {
              text: 'Naudotojai'
            },
            min: 0,
            max: 40
          },
          legend: {
            position: 'top',
            horizontalAlign: 'right',
            floating: true,
            offsetY: -25,
            offsetX: -5
          }
        },
      
      
    });

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
            <ReactApexChart options={graph.options} series={graph.series} type="line" height={350} width={'100%'} style={{width: '95%', margin: 'auto', marginTop : '15px'}} />
            <div className="table-container" style={{borderTop : '2px solid black'}}>
                <div className='users-list-div' style={{background : 'lightgrey', width : '100%', 
                    marginTop: '0', paddingLeft: '10px', 
                    paddingRight: '20px', paddingTop: '15px', paddingBottom: '10px'}}>
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
                                            className='red-button'
                                            onClick={() => deleteUser(user.id)}
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                        <button
                                            className='gold-button'
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
