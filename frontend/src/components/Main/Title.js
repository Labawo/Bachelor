import { useNavigate, Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faArchive, faTrophy, faUser } from '@fortawesome/free-solid-svg-icons';
import { useContext, useState } from "react";
import AuthContext from "../../context/AuthProvider";
import useAuth from "../../hooks/UseAuth";

const Title = () => {

    const navigate = useNavigate();

    const { setAuth } = useContext(AuthContext);

    const { auth } = useAuth();

    const logout = async () => {
        setAuth({});
        navigate('/login');
    }

    const changePassword = async () => {
        navigate('/resetPassword');
    }

    const userBadges = async () => {
        navigate('/userBadges');
    }

    const isAdmin = auth.roles.includes("Admin");
    const canAccessStudent = auth.roles.includes("Student") && !auth.roles.includes("Admin");

    return (
        <div className="title_div">
            <div className="logout-div">
                <span>
                    <button onClick={userBadges} className="password-btn">
                        <FontAwesomeIcon icon={isAdmin ? faArchive : faTrophy} />
                    </button>
                </span>
                <span>
                    <button onClick={changePassword} className="password-btn">
                        <FontAwesomeIcon icon={faUser} />
                    </button>
                </span>
                <span>
                    <button onClick={logout} className="logout-btn">
                        <FontAwesomeIcon icon={faSignOutAlt} />
                    </button>
                </span>
                <span>
                    <button className="user-name-div">
                        <b>{auth.user}</b>
                    </button> 
                </span>                      
            </div>   
            <div className="shortcut-div">
                <h3>SRMS<div className='title-admin-div'>{isAdmin ? <span className='title-admin-span'>/admin</span>:null}</div></h3>
            </div>           
        </div>
    );
};

export default Title;