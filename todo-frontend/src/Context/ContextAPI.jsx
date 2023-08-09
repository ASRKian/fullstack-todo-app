import { createContext } from "react";
import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode'
import { useRefreshTokenMutation } from "../Services/userAuthAPI";
import { useDispatch } from "react-redux";
import { changeUser } from "../Slices/userSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const AuthContext = createContext(null);

export const AuthContextProvider = (props) => {
    const [refreshToken] = useRefreshTokenMutation()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const storeCookie = (access_token, refresh_token) => {
        if (access_token) {
            Cookies.set('access_token', access_token, {
                expires: 1,
                secure: true
            })
        } else {
            access_token = Cookies.get('access_token')
        }

        if (refresh_token) {
            Cookies.set('refresh_token', refresh_token, {
                expires: 7,
                secure: true
            })
        } else {
            refresh_token = Cookies.get('refresh_token')
        }

        const user = jwt_decode(access_token) ?? null;
        return user
    }

    const getCookie = () => {
        const access_token = Cookies.get('access_token')
        const refresh_token = Cookies.get('refresh_token')
        return { access_token, refresh_token }
    }

    const deleteCookie = () => {
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        dispatch(changeUser(false))
        toast.success('Logged out successfully!', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            });
        navigate('/')
    }

    const isTokenValid = (access_token) => {
        try {
            const decoded_token = jwt_decode(access_token)
            return decoded_token.exp > (Date.now() / 1000)
        } catch (error) {
            return false
        }
    }

    const refreshingToken = async () => {
        let { access_token, refresh_token } = getCookie()
        if (access_token && refresh_token) {
            if (!isTokenValid(access_token)) {
                const response = await refreshToken(refresh_token);
                access_token = (response.data.access)
                Cookies.set('access_token', access_token, {
                    expires: 1,
                    secure: true
                })
            }
        } else if (refresh_token) {
            const response = await refreshToken(refresh_token);
            access_token = (response.data.access)
            Cookies.set('access_token', access_token, {
                expires: 7,
                secure: true
            })
        }
    }

    const isLoggedIn = async () => {
        await refreshingToken()
        const { access_token, refresh_token } = getCookie()
        if (!refresh_token) {
            return false
        }
        if (access_token) {
            return isTokenValid(access_token)
        } else {
            return false
        }
    }

    return (
        <AuthContext.Provider value={{
            storeCookie,
            getCookie,
            deleteCookie,
            isTokenValid,
            refreshingToken,
            isLoggedIn,


        }}>
            {props.children}
        </AuthContext.Provider>
    )
}