import Cookies from "js-cookie"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { useResetPasswordMutation } from "../Services/userAuthAPI";
import { toast } from "react-toastify";


export default function ChangePassword() {
    const navigate = useNavigate()
    const [resetPassword, { isError, isLoading, isSuccess }] = useResetPasswordMutation()
    useEffect(() => {
        const uid = Cookies.get('uid');
        const token = Cookies.get('token');
        if (!uid && !token) {
            navigate('/')
        }
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        const uid = Cookies.get('uid');
        const token = Cookies.get('token');
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        const data = new FormData(e.currentTarget);
        const body = {
            password: data.get('changePassword1'),
            password2: data.get('changePassword2')
        }
        if (uid && token) {
            if (body.password !== body.password2) {
                toast.error('Password & Confirm Password do not match!!!', {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                return
            }
            const res = await resetPassword({ body, uid, token })
            if (res.data?.msg === 'Password reset successfully!') {
                Cookies.remove('uid');
                Cookies.remove('token');
                toast.success('Password changed successfully', {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                navigate('/')
            }
            else if (res.error?.data.errors.non_field_errors[0] === 'Link is not valid or expired') {
                Cookies.remove('uid');
                Cookies.remove('token');
                toast.error('Link is not valid or expired', {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                navigate('/')
            } else {
                Cookies.remove('uid');
                Cookies.remove('token');
                toast.error('Some error occurred', {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            }
        } else {
            navigate('/')
        }
    }

    return (
        <form className="container" onSubmit={handleSubmit}>
            <div className="mb-3">
                <label htmlFor="changePassword1" className="form-label">Password</label>
                <input type="password" className="form-control" name="changePassword1" id="changePassword1" required />
            </div>
            <div className="mb-3">
                <label htmlFor="changePassword2" className="form-label">Confirm Password</label>
                <input type="password" className="form-control" name="changePassword2" id="changePassword2" required />
            </div>
            <button type="submit" className="btn btn-primary" >Change Password</button>
        </form>
    )
}
