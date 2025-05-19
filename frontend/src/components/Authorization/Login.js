import { useRef, useState, useEffect } from 'react';
import useAuth from '../../hooks/UseAuth';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import LoginNavBar from '../Main/LoginNavBar';
import Footer from '../Main/Footer';
import '../../styles/login.css';
import axios from '../../api/axios';
import { jwtDecode } from 'jwt-decode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faArchive, faLock, faUser } from '@fortawesome/free-solid-svg-icons';

const LOGIN_URL = '/login';

const Login = () => {
    const { setAuth, auth } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        userRef.current.focus();
        console.log(auth);
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({ UserName : user, Password : pwd }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            const accessToken = response?.data?.accessToken;
            const refreshToken = response?.data?.refreshToken;
            const decodedToken = jwtDecode(accessToken);
            const roles = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
            const id = decodedToken.sub;
            setAuth({ user, roles, id, accessToken, refreshToken });
            setUser('');
            setPwd('');
            localStorage.setItem("refreshToken", JSON.stringify(refreshToken));
            navigate(from, { replace: true });
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg(err.response?.data);
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
    }

    return (
        <section className='log-reg-sec'>
            <LoginNavBar />
            <div className='login-div'>
                <div className='wrapper'>
                    <div className='title-login'><span className='title-span' style={{fontSize: '40px'}}>Prisijungimas</span></div>
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
                                className="input-field"
                            />
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
                            />
                        </div>

                        <div className="row button" >
                            <button style={{fontSize: '15px'}}>Prisijungti</button>
                        </div>

                        <div className="signup-link">
                            Nesate registruotas? <Link to="/register" >Registruotis</Link>
                        </div>
                    </form>
                </div>
            </div>
            
            <Footer />            
        </section>
    )
}

export default Login