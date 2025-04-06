import axios from '../api/axios';
import useAuth from './UseAuth';

const useRefreshToken = () => {
    const { setAuth, auth } = useAuth();

    const refresh = async () => {

        const refreshToken = {
            refreshToken: auth.refreshToken
        };

        const response = await axios.post('/accessToken', refreshToken, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        setAuth(prev => ({
            ...prev,
            accessToken: response.data.accessToken
        }));
        return response.data.accessToken;
    }
    return refresh;
};

export default useRefreshToken;