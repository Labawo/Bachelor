import axios from '../api/axios';
import useAuth from './UseAuth';
import { jwtDecode } from 'jwt-decode';

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {

        const saved = localStorage.getItem("refreshToken");
        const initialValue = JSON.parse(saved);

        const refreshToken = {
            refreshToken: initialValue
        };

        const response = await axios.post('/accessToken', refreshToken, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const decodedToken = jwtDecode(response.data.accessToken);
        const roles = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        const user = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];

        setAuth(prev => ({
            ...prev,
            accessToken: response.data.accessToken,
            roles: roles,
            user: user,
        }));
        return response.data.accessToken;
    }
    return refresh;
};

export default useRefreshToken;