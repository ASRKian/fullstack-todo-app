import Cookies from "js-cookie";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";


export default function Loading() {
    const { uid, token } = useParams();
    const navigate = useNavigate()
    useEffect(() => {
        Cookies.set('uid', uid)
        Cookies.set('token', token)
        navigate('/reset-password')
    }, [])
    return (
        <div>
            Loading...
        </div>
    )
}
