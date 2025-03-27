import React, { useState, useEffect, useRef } from "react";
import useAxiosPrivate from "../../hooks/UseAxiosPrivate";
import SuccessSelectModal from "../Modals/SuccessSelectModal";
import ErrorModal from "../Modals/ErrorModal";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../Levels/levelmodals.css";

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = '/resetPassword';

const EditUser = ({ show, onClose, userId }) => {
    const errRef = useRef();

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const axiosPrivate = useAxiosPrivate();

    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd));
        setValidMatch(pwd === matchPwd);
    }, [pwd, matchPwd])

    useEffect(() => {
        setErrMsg('');
    }, [pwd, matchPwd])

    const resetForm = () => {
        setSuccess(false);
        setErrMsg('');
        setSuccessMsg('Slaptažodis sėkmingai pakeistas');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const v2 = PWD_REGEX.test(pwd);
        if (!v2 ) {
            setErrMsg("Negalima reikšmė");
            return;
        }
        try {
        const levelData = {
            newPassword: pwd,
        };

        console.log(levelData);

        const response = await axiosPrivate.put(`/changePassword/${userId}`, levelData);
        setSuccess(true);
        setPwd('');
        setMatchPwd('');
        resetForm();
        setSuccessMessage("Naudotojo slaptažodis atnaujintas!");
        } catch (error) {
            if (!error?.response) {
                setErrMsg('No Server Response');
            } else if (error.response?.status === 409) {
                setErrMsg('Username Taken');
            } else {
                setErrMsg('Password change Failed')
            }
            errRef.current.focus();
        }
    };

    const closePassword = () => {
        resetForm();
        setPwd('');
        setMatchPwd('');
        onClose();
    }

  return (
    <>
      <div className={`modal-form ${show ? "show" : ""}`}>
      <div className="modal-content-form"> 
      <div className='close-button-div-form'>
          <button className="primary-button-form" onClick={closePassword}>X</button>
        </div>
        <div className="outer-form-div">
        <div className="form-container">
          <h2>Pakeisti slaptažodį naudotojui {userId}</h2>
          <form onSubmit={handleSubmit} className = "input_form">
          <label htmlFor="password">
                            Slaptažodis:
                            <FontAwesomeIcon icon={faCheck} className={validPwd ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validPwd || !pwd ? "hide" : "invalid"} />
                        </label>
                        <input
                            type="password"
                            id="password"
                            onChange={(e) => setPwd(e.target.value)}
                            value={pwd}
                            required
                            aria-invalid={validPwd ? "false" : "true"}
                            aria-describedby="pwdnote"
                            onFocus={() => setPwdFocus(true)}
                            onBlur={() => setPwdFocus(false)}
                        />
                        <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            nuo 8 iki 24 simbolių.<br />
                            Didžiosios, mažosios raidės, simboliai ir skaičiai.<br />
                            Leistini simboliai: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                        </p>
                        <label htmlFor="confirm_pwd">
                            Patvirtinti slaptažodį:
                            <FontAwesomeIcon icon={faCheck} className={validMatch && matchPwd ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPwd ? "hide" : "invalid"} />
                        </label>
                        <input
                            type="password"
                            id="confirm_pwd"
                            onChange={(e) => setMatchPwd(e.target.value)}
                            value={matchPwd}
                            required
                            aria-invalid={validMatch ? "false" : "true"}
                            aria-describedby="confirmnote"
                            onFocus={() => setMatchFocus(true)}
                            onBlur={() => setMatchFocus(false)}
                        />
                        <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Turi sutapti su slaptažodžiu.
                        </p>

                        
            
            <div className="modal-buttons-form">
                <button disabled={ !validPwd || !validMatch ? true : false} className="auth_button">Pakeisti slaptažodį</button>
            </div>
          </form>
          
      </div>
        </div>
      
        <SuccessSelectModal
          show={successMessage !== ""}
          onClose={() => setSuccessMessage("")}
          message={successMessage}
        />
        <ErrorModal
          show={errorMessage !== ""}
          onClose={() => setErrorMessage("")}
          message={errorMessage}
        />
      </div>
      </div>
    </>
    
  );
};

export default EditUser;