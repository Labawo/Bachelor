import { useNavigate, Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faArchive } from '@fortawesome/free-solid-svg-icons';
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

    return (
        <div className="title_div">
            <div className="logout-div">
                <span>
                    <button onClick={changePassword} className="password-btn">
                        <FontAwesomeIcon icon={faArchive} />
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
                <h3>HESMS</h3>
            </div>           
        </div>
    );
};

export default Title;