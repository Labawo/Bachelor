import React, { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AuthContext from "../../context/AuthProvider";
import { faSignOutAlt, faArchive, faTrophy, faUser } from '@fortawesome/free-solid-svg-icons';
import '../../styles/NavBarNew.css'; // Import your CSS file
import useAuth from "../../hooks/UseAuth";

const NavBarStudent = () => {
  // States to control visibility of the search box and submenus
    const [showInput, setShowInput] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);
    const [showHtmlCssSubMenu, setShowHtmlCssSubMenu] = useState(false);
    const [showJsSubMenu, setShowJsSubMenu] = useState(false);
    const [showMoreSubMenu, setShowMoreSubMenu] = useState(false);

    const navigate = useNavigate();

    const { setAuth } = useContext(AuthContext);

    const { auth } = useAuth();
    const location = useLocation();

    const canAccessAdmin = auth.roles.includes("Admin");
    const canAccessStudent = auth.roles.includes("Student") && !auth.roles.includes("Admin");

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

    // Toggle search box input visibility
    const toggleSearchBox = () => {
        setShowInput(!showInput);
    };

    // Toggle sidebar visibility
    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };

    // Toggle submenus visibility
    const toggleHtmlCssSubMenu = () => {
        setShowHtmlCssSubMenu(!showHtmlCssSubMenu);
    };

    const toggleJsSubMenu = () => {
        setShowJsSubMenu(!showJsSubMenu);
    };

    const toggleMoreSubMenu = () => {
        setShowMoreSubMenu(!showMoreSubMenu);
    };

  return (
    <nav>
      <div className="navbar">
        <i className='bx bx-menu' onClick={toggleSidebar}></i>
        <div className="logo"><a href="#">SRMS {canAccessAdmin ? '/ADMIN' : ''}</a></div>
        <div className={`nav-links ${showSidebar ? 'showSidebar' : ''}`}>
          <div className="sidebar-logo">
            <span className="logo-name">SRMS</span>
            <i className='bx bx-x' onClick={toggleSidebar}></i>
          </div>
          <ul className="links">
            <li><Link to="/">PAGRINDINIS</Link></li>
            <li><Link to="/training" className={canAccessStudent ? '' : 'hidden'}>TRENIRUOTĖ</Link></li>
            <li><Link to="/tests" className={canAccessStudent ? '' : 'hidden'}>TESTAI</Link></li>
            <li><Link to="/speedTyping" className={canAccessStudent ? '' : 'hidden'}>SPARTUS RAŠYMAS</Link></li>
            <li><Link to="/userBadges" className={canAccessStudent ? '' : 'hidden'}>ŽENKLELIAI</Link></li>
            <li>
              <a href="#" onClick={toggleJsSubMenu}>PROFILIS</a>
              <i className={`bx bxs-chevron-down js-arrow arrow ${showJsSubMenu ? 'rotated' : ''}`} />
              <ul className={`js-sub-menu sub-menu ${showJsSubMenu ? 'show' : ''}`}>
                <li>
                    <a onClick={changePassword} style={{cursor : 'pointer'}}>
                        Pakeisti Slaptažodį
                    </a>
                </li>
                <li>
                    <a style={{cursor : 'pointer'}}>
                        Profilis
                    </a>
                </li>
                <li>
                    <a onClick={logout} style={{cursor : 'pointer'}}>
                        Atsijungti
                    </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <div className="search-box">
          <i className={`bx bx-search ${showInput ? 'bx-x' : ''}`} onClick={toggleSearchBox}></i>
          <div className={`input-box ${showInput ? 'show' : ''}`}>
            <input type="text" placeholder="Search..." />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBarStudent;