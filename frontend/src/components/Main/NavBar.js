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
    const canAccessDoctor = auth.roles.includes("Doctor") && !auth.roles.includes("Admin");
    const canAccessPatient = auth.roles.includes("Patient") && !auth.roles.includes("Admin");
    const canAccessPatientDoctor = (auth.roles.includes("Doctor") || auth.roles.includes("Patient")) && !auth.roles.includes("Admin");

    return (
        <div className="navbar">
            <div className="navbar-allign">
                <div className="navbar-links">
                    <span className={`nav-link-span ${isActiveLink('/') ? 'active-span' : ''}`}>
                        <Link to="/" className='nav-link'>Home</Link>
                    </span>
                    <span className={`nav-link-span ${isActiveLink('/therapies') ? 'active-span' : ''}`}>
                        <Link to="/therapies" className='nav-link'>Therapies</Link>
                    </span>
                    <span className={canAccessAdmin ? `nav-link-span ${isActiveLink('/admin') ? 'active-span' : ''}` : 'hidden'}>
                        <Link to="/admin" className={canAccessAdmin ? 'nav-link' : 'hidden'}>Users</Link>
                    </span>
                    <span className={canAccessPatient ? `nav-link-span ${isActiveLink('/myAppointments') ? 'active-span' : ''}` : 'hidden'}>
                        <Link to="/myAppointments" className={canAccessPatient ? 'nav-link' : 'hidden'}>My Appointments</Link>
                    </span>
                    <span className={canAccessPatient ? `nav-link-span ${isActiveLink('/notes') ? 'active-span' : ''}` : 'hidden'}>
                        <Link to="/notes" className={canAccessPatient ? 'nav-link' : 'hidden'}>Notes</Link>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default NavBar;