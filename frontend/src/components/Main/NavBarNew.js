import React, { useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import '../../styles/NavBarNew.css'; // Import your CSS file
import useAuth from "../../hooks/UseAuth";
import NavBarStudent from "./NavBarStudent";
import NavBarAdmin from "./NavBarAdmin";

const NavBarNew = () => {

  const { auth } = useAuth();

  const canAccessAdmin = auth.roles.includes("Admin");
  const canAccessStudent = auth.roles.includes("Student") && !auth.roles.includes("Admin");

  return (
    <>
    {canAccessAdmin ? <NavBarAdmin /> : <NavBarStudent />}
    </>
  );
};

export default NavBarNew;