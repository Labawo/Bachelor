import { Link, useLocation } from "react-router-dom";
import useAuth from "../../hooks/UseAuth";
import { useState } from "react";

const NavBar = () => {
    
    const { auth } = useAuth();
    const location = useLocation();

    const isActiveLink = (path) => {
        return location.pathname === path;
    };


    const canAccessAdmin = auth.roles.includes("Admin");
    const canAccessStudent = auth.roles.includes("Student") && !auth.roles.includes("Admin");

    return (
        <div className="navbar">
            <div className="navbar-allign">
                <div className="navbar-links">
                    <span className={`nav-link-span ${isActiveLink('/') ? 'active-span' : ''}`}>
                        <Link to="/" className='nav-link'>Pagrindinis</Link>
                    </span>
                    <span className={canAccessAdmin ? `nav-link-span ${isActiveLink('/admin') ? 'active-span' : ''}` : 'hidden'}>
                        <Link to="/admin" className={canAccessAdmin ? 'nav-link' : 'hidden'}>Naudotojai</Link>
                    </span>
                    <span className={canAccessAdmin ? `nav-link-span ${isActiveLink('/admin') ? 'active-span' : ''}` : 'hidden'}>
                        <Link to="/admin" className={canAccessAdmin ? 'nav-link' : 'hidden'}>Lygiai</Link>
                    </span>
                    <span className={canAccessAdmin ? `nav-link-span ${isActiveLink('/admin') ? 'active-span' : ''}` : 'hidden'}>
                        <Link to="/admin" className={canAccessAdmin ? 'nav-link' : 'hidden'}>Ženkleliai</Link>
                    </span>
                    <span className={canAccessStudent ? `nav-link-span ${isActiveLink('/training') ? 'active-span' : ''}` : 'hidden'}>
                        <Link to="/training" className={canAccessStudent ? 'nav-link' : 'hidden'}>Treniruotė</Link>
                    </span>
                    <span className={canAccessStudent ? `nav-link-span ${isActiveLink('/tests') ? 'active-span' : ''}` : 'hidden'}>
                        <Link to="/tests" className={canAccessStudent ? 'nav-link' : 'hidden'}>Testai</Link>
                    </span>
                    <span className={canAccessStudent ? `nav-link-span ${isActiveLink('/speedTyping') ? 'active-span' : ''}` : 'hidden'}>
                        <Link to="/speedTyping" className={canAccessStudent ? 'nav-link' : 'hidden'}>Spartus rašymas</Link>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default NavBar;