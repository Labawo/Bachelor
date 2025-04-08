import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle, faUser, faLock, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from '../../api/axios';
import { Link } from "react-router-dom";
import LoginNavBar from '../Main/LoginNavBar';
import Footer from '../Main/Footer';
import '../../styles/login.css';

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REGISTER_URL = '/register';

const Register = () => {
    const userRef = useRef();
    const emailRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setValidName(USER_REGEX.test(user));
    }, [user])

    useEffect(() => {
        const result = EMAIL_REGEX.test(email);
        console.log(result);
        console.log(email);
        setValidEmail(result);
    }, [email])

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd));
        setValidMatch(pwd === matchPwd);
    }, [pwd, matchPwd])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd, email, matchPwd])

    const handleSubmit = async (e) => {
        e.preventDefault();
        const v1 = USER_REGEX.test(user);
        const v2 = PWD_REGEX.test(pwd);
        const v3 = EMAIL_REGEX.test(email);
        if (!v1 || !v2 || !v3) {
            setErrMsg("Invalid Entry");
            return;
        }
        try {
            const response = await axios.post(REGISTER_URL,
                JSON.stringify({ UserName : user, Email : email, Password : pwd }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            console.log(response?.data);
            console.log(response?.accessToken);
            setSuccess(true);
            setUser('');
            setPwd('');
            setMatchPwd('');
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 409) {
                setErrMsg('Username Taken');
            } else {
                setErrMsg('Registration Failed')
            }
            errRef.current.focus();
        }
    }

    return (
        <>
            {success ? (
                <section className='log-reg-sec'>
                    <LoginNavBar />
                    <div className='reg-succ-div'>
                        <h1>Registracija sėkminga!</h1>
                        <p>
                            <Link to="/">Prisijungti</Link>
                        </p>
                    </div>
                    <Footer />
                </section>
            ) : (
                <section className='log-reg-sec'>
                    <LoginNavBar />
                    <div className='login-div'>
                        <div className='wrapper-reg'>
                            <div className='title-login'><span className='title-span'>Registracija</span></div>
                            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <i><FontAwesomeIcon icon={faUser} /></i>
                                    <input
                                        placeholder="Naudotojo vardas"
                                        type="text"
                                        id="username"
                                        ref={userRef}
                                        autoComplete="off"
                                        onChange={(e) => setUser(e.target.value)}
                                        value={user}
                                        required
                                        aria-invalid={validName ? "false" : "true"}
                                        aria-describedby="uidnote"
                                        onFocus={() => setUserFocus(true)}
                                        onBlur={() => setUserFocus(false)}
                                    />

                                    <i className='check-i'>
                                        <span className={validName ? "valid" : "hide"}>
                                            <FontAwesomeIcon icon={faCheck} />
                                        </span>
                                        <span className={validName || !user ? "hide" : "invalid"}>
                                            <FontAwesomeIcon icon={faTimes} />
                                        </span>
                                    </i>

                                    <p id="uidnote" className={userFocus && user && !validName ? "instructions" : "offscreen"}>
                                        <FontAwesomeIcon icon={faInfoCircle} />
                                        nuo 4 iki 24 simbolių.<br />
                                        Privalo prasidėti raide.<br />
                                        Raidės, skaičiai ir simboliai yra leistini.
                                    </p>
                                </div>

                                <div className="row">
                                    <i><FontAwesomeIcon icon={faEnvelope} /></i>
                                    <input 
                                        placeholder="El. paštas"
                                        type="email"
                                        id="email"
                                        ref={emailRef}
                                        autoComplete="off"
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        aria-invalid={validEmail ? "false" : "true"}
                                        aria-describedby="eidnote"
                                        onFocus={() => setEmailFocus(true)}
                                        onBlur={() => setEmailFocus(false)}
                                    />

                                    <i className='check-i'>
                                        <span className={validEmail ? "valid" : "hide"}>
                                            <FontAwesomeIcon icon={faCheck} />
                                        </span>
                                        <span className={validEmail || !email ? "hide" : "invalid"}>
                                            <FontAwesomeIcon icon={faTimes} />
                                        </span>
                                    </i>

                                    <p id="eidnote" className={emailFocus && email && !validEmail ? "instructions" : "offscreen"}>
                                        <FontAwesomeIcon icon={faInfoCircle} />
                                        Privalo prasidėti raide. <br />
                                        privalo turėti @ simbolį.
                                    </p>
                                </div>

                                <div className="row">
                                    <i><FontAwesomeIcon icon={faLock} /></i>
                                    <input
                                        placeholder="Slaptažodis"
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
                                        Privalo turėti didžiąsias, mažąsias raides, skaičius ir simbolius.<br />
                                        Galimi simboliai: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                                    </p>
                                </div>

                                <div className="row">
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
                                        <span className={validMatch && matchPwd ? "valid" : "hide"}>
                                            <FontAwesomeIcon icon={faCheck} />
                                        </span>
                                        <span className={validMatch || !matchPwd ? "hide" : "invalid"}>
                                            <FontAwesomeIcon icon={faTimes} />
                                        </span>
                                    </i>

                                    <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                                        <FontAwesomeIcon icon={faInfoCircle} />
                                        Privalo sutapti su įvestu slaptažodžiu.
                                    </p>
                                </div>

                                <div className="row button">
                                    <button disabled={!validName || !validPwd ||!validEmail || !validMatch ? true : false}>Registruotis</button>
                                </div>

                                <div className="signup-link">
                                    Jau registravotės? <Link to="/">Prisijungti</Link>
                                </div>
                            </form>
                        </div>
                    </div>
                    <Footer />
                </section>
            )}
        </>
    )
}

export default Register
