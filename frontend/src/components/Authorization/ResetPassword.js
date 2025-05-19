import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle, faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useAxiosPrivate from "../../hooks/UseAxiosPrivate";
import NavBarNew from "../Main/NavBarNew";
import Footer from "../Main/Footer";
import SuccessSelectModal from "../Modals/SuccessSelectModal";
import '../../styles/login.css';

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = '/resetPassword';

const ResetPassword = () => {
    const errRef = useRef();

    const axiosPrivate = useAxiosPrivate();

    const [cpwd, setcPwd] = useState('');
    const [validcPwd, setValidcPwd] = useState(false);
    const [cpwdFocus, setcPwdFocus] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        setValidcPwd(PWD_REGEX.test(cpwd));
    }, [cpwd])

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd));
        setValidMatch(pwd === matchPwd);
    }, [pwd, matchPwd])

    useEffect(() => {
        setErrMsg('');
    }, [cpwd, pwd, matchPwd])

    const resetForm = () => {
        setSuccess(false);
        setErrMsg('');
        setSuccessMsg('Slaptažodis sėkmingai pakeistas');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const v1 = PWD_REGEX.test(cpwd);
        const v2 = PWD_REGEX.test(pwd);
        if (!v1 || !v2 ) {
            setErrMsg("Negalima reikšmė");
            return;
        }
        try {
            const response = await axiosPrivate.put(REGISTER_URL,
                JSON.stringify({ CurrentPassword : cpwd, NewPassword : pwd }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            console.log(response?.data);
            console.log(response?.accessToken);
            setSuccess(true);
            setcPwd('');
            setPwd('');
            setMatchPwd('');
            resetForm();
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 409) {
                setErrMsg('Username Taken');
            } else {
                setErrMsg('Password change Failed')
            }
            errRef.current.focus();
        }
    }

    return (
        <>
            <NavBarNew />
            <section className='log-reg-sec'>
                <div className="login-div">
                    <div className="wrapper-reg" style={{ height: '400px'}}>
                        <div className='title-login'><span className='title-span' style={{fontSize: '40px'}}>Slaptažodžio keitimas</span></div>
                        <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <i><FontAwesomeIcon icon={faLock} /></i>
                                <input
                                    placeholder="Dabartinis slaptažodis"
                                    type="password"
                                    id="currentpassword"
                                    onChange={(e) => setcPwd(e.target.value)}
                                    value={cpwd}
                                    required
                                    aria-invalid={validcPwd ? "false" : "true"}
                                    aria-describedby="cpwdnote"
                                    onFocus={() => setcPwdFocus(true)}
                                    onBlur={() => setcPwdFocus(false)}
                                />

                                <i className='check-i'>
                                    <span className={validcPwd ? "valid" : "hide"}>
                                        <FontAwesomeIcon icon={faCheck} />
                                    </span>
                                    <span className={validcPwd || !cpwd ? "hide" : "invalid"}>
                                        <FontAwesomeIcon icon={faTimes} />
                                    </span>
                                </i>

                                <p id="cpwdnote" className={cpwdFocus && !validcPwd ? "instructions" : "offscreen"}>
                                    <FontAwesomeIcon icon={faInfoCircle} />
                                    nuo 8 iki 24 simbolių.<br />
                                    Didžiosios, mažosios raidės skaičiai ir simboliai.<br />
                                    Leistini simboliai: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                                </p>
                            </div>

                            <div className='row'>
                                <i><FontAwesomeIcon icon={faLock} /></i>
                                <input
                                    placeholder="Naujas slaptažodis"
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

                                <i className='check-i'>
                                    <span className={validPwd ? "valid" : "hide"}>
                                        <FontAwesomeIcon icon={faCheck} />
                                    </span>
                                    <span className={validPwd || !pwd ? "hide" : "invalid"}>
                                        <FontAwesomeIcon icon={faTimes} />
                                    </span>
                                </i>

                                <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                                    <FontAwesomeIcon icon={faInfoCircle} />
                                    nuo 8 iki 24 simbolių.<br />
                                    Didžiosios, mažosios raidės, simboliai ir skaičiai.<br />
                                    Leistini simboliai: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                                </p>
                            </div>

                            <div className='row'>
                            <i><FontAwesomeIcon icon={faLock} /></i>
                                <input
                                    placeholder="Pakartoti slaptažodį"
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

                                <i className='check-i'>
                                    <span className={validMatch && matchPwd? "valid" : "hide"}>
                                        <FontAwesomeIcon icon={faCheck} />
                                    </span>
                                    <span className={validMatch || !matchPwd ? "hide" : "invalid"}>
                                        <FontAwesomeIcon icon={faTimes} />
                                    </span>
                                </i>

                                <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                                    <FontAwesomeIcon icon={faInfoCircle} />
                                    Turi sutapti su slaptažodžiu.
                                </p>
                            </div>
                            
                            <div className="row button">
                                <button disabled={!validcPwd || !validPwd || !validMatch ? true : false} style={{fontSize: '15px'}}>Pakeisti slaptažodį</button>
                            </div>
                        </form>
                    </div>
                </div>                  
                    
            </section>
            <SuccessSelectModal
                show={successMsg !== ""}
                onClose={() => setSuccessMsg("")}
                message={successMsg}
            />
            <Footer />
        </>
    )
}

export default ResetPassword
