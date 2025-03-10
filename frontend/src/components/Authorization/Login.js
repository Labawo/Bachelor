import { useRef, useState, useEffect } from 'react';
import useAuth from '../../hooks/UseAuth';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import axios from '../../api/axios';
import { jwtDecode } from 'jwt-decode';

const LOGIN_URL = '/login';

const Login = () => {
    const { setAuth } = useAuth();

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
            <div className='login-full-div'>
                <div className='login-div'>
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <h1 className='animated-header'>SRMS Prisijungimas</h1>
                    <form onSubmit={handleSubmit} className = "input_form">
                        <label htmlFor="username">Vartotojo vardas:</label>
                        <input
                            type="text"
                            id="username"
                            ref={userRef}
                            autoComplete="off"
                            onChange={(e) => setUser(e.target.value)}
                            value={user}
                            required
                            className="input-field"
                        />

                        <label htmlFor="password">Slaptažodis:</label>
                        <input
                            type="password"
                            id="password"
                            onChange={(e) => setPwd(e.target.value)}
                            value={pwd}
                            required
                        />
                        <button className="auth_button">Prisijungti</button>
                    </form>
                </div>
                
                <p className='login_footer'>
                    Nesate registruotas?<br />
                    <span className="line">
                        <Link to="/register">Registruotis</Link>
                    </span>
                </p>
            </div>            
        </section>
    )
}

export default Login