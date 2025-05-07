import React, { useState, useContext, useEffect } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AuthContext from "../../context/AuthProvider";
import useAxiosPrivate from "../../hooks/UseAxiosPrivate";
import { faSignOutAlt, faArchive, faTrophy, faUser, faHome, faCheckSquare, faDumbbell, faCar } from '@fortawesome/free-solid-svg-icons';
import '../../styles/NavBarNew.css'; // Import your CSS file
import useAuth from "../../hooks/UseAuth";

const NavBarStudent = () => {
  // States to control visibility of the search box and submenus
    const [showInput, setShowInput] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);
    const [showHtmlCssSubMenu, setShowHtmlCssSubMenu] = useState(false);
    const [showJsSubMenu, setShowJsSubMenu] = useState(false);
    const [showMoreSubMenu, setShowMoreSubMenu] = useState(false);
    const [badageCount, setBadgeCount] = useState(0);
    const [quizDone, setQuizDone] = useState(0);
    const [playerWpm, setPlayerWpm] = useState(0);
    const [playerXp, setPlayerXp] = useState(0);
    const [quizXp, setQuizXp] = useState(0);

    const axiosPrivate = useAxiosPrivate();

    const navigate = useNavigate();

    const { setAuth } = useContext(AuthContext);

    const { auth } = useAuth();
    const location = useLocation();

    const canAccessAdmin = auth.roles.includes("Admin");
    const canAccessStudent = auth.roles.includes("Student") && !auth.roles.includes("Admin");

    const logout = async () => {
        setAuth({});
        localStorage.setItem('refreshToken', 'null');
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

    useEffect(() => {
      const fetchStatistics = async () => {
        try {
          const response = await axiosPrivate.get("/statistics");
          const { badgeCount, wpm, quizDone, quizXp, quoteXP } = response.data;
          setBadgeCount(badgeCount);
          setPlayerWpm(wpm);
          setQuizDone(quizDone);
          setPlayerXp(quoteXP);
          setQuizXp(quizXp);
        } catch (error) {
          console.error("Klaida gaunant statistika", error);
        }
      };

      fetchStatistics();
      
    }, [axiosPrivate]);

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
            <li><Link to="/"><FontAwesomeIcon icon={faHome} /> PAGRINDINIS</Link></li>
            <li><Link to="/speedTyping" className={canAccessStudent ? '' : 'hidden'}><FontAwesomeIcon icon={faCar} /> SPARTUS RAŠYMAS</Link></li>
            <li><Link to="/tests" className={canAccessStudent ? '' : 'hidden'}><FontAwesomeIcon icon={faCheckSquare} /> TESTAI</Link></li>
            <li><Link to="/training" className={canAccessStudent ? '' : 'hidden'}><FontAwesomeIcon icon={faDumbbell} /> TRENIRUOTĖ</Link></li>
            <li><Link to="/userBadges" className={canAccessStudent ? '' : 'hidden'}><FontAwesomeIcon icon={faTrophy} /> ŽENKLELIAI</Link></li>
            <li>
              <a href="#" onClick={toggleJsSubMenu}><FontAwesomeIcon icon={faUser} /> {auth.user ? auth.user.toUpperCase() : null}</a>
              <i className={`bx bxs-chevron-down js-arrow arrow ${showJsSubMenu ? 'rotated' : ''}`} />
              <ul className={`js-sub-menu sub-menu ${showJsSubMenu ? 'show' : ''}`}>
                <li>
                    <a onClick={changePassword} style={{cursor : 'pointer'}}>
                        Pakeisti Slaptažodį
                    </a>
                </li>
                <li>
                    
                </li>
                <li className="more">
                  <span onClick={toggleMoreSubMenu}>
                    <a style={{cursor : 'pointer'}}>
                        Statistika
                    </a>
                    <i className={`bx bxs-chevron-right arrow more-arrow ${showMoreSubMenu ? 'rotated' : ''}`}></i>
                  </span>
                  <ul className={`more-sub-menu sub-menu ${showMoreSubMenu ? 'show' : ''}`}>
                    <li><a href="#">Atlikti testai: {quizDone}</a></li>
                    <li><a href="#">Žodžiai/min: {playerWpm}</a></li>
                    <li><a href="#">Ženkliukų sk.: {badageCount}</a></li>
                    <li><a href="#">Citatų patirtis: {playerXp}</a></li>
                    <li><a href="#">Testų patirtis: {quizXp}</a></li>
                  </ul>
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