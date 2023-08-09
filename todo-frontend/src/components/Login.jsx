import { useContext } from "react";
import { AuthContext } from "../Context/ContextAPI"
import { useLoginUserMutation } from "../Services/userAuthAPI"
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { changeUser } from "../Slices/userSlice";
import { toast } from "react-toastify";

export default function Login() {
    const useContextAPI = useContext(AuthContext);
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [loginUser] = useLoginUserMutation()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const data = new FormData(e.currentTarget)
            const actualData = {
                email: data.get('uEmail'),
                password: data.get('password')
            }
            const response = await loginUser(actualData);
            console.log(response);
            if (response.data?.msg === 'Login success') {
                const { access, refresh } = response.data.token;
                toast.success('Logged In successfully!', {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                navigate('/todo');
                dispatch(changeUser(true));
                useContextAPI.storeCookie(access, refresh)
            } else if (response.error?.data.errors.non_field_errors[0] === 'Email or Password is not valid') {
                toast.error('Email or password do not match', {
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
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label htmlFor="uEmail" className="form-label">Email address</label>
                <input type="email" className="form-control" name="uEmail" id="uemail" aria-describedby="email" required />
            </div>
            <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input type="password" className="form-control" name="password" id="password" required />
            </div>
            <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Submit</button>
        </form>
    )
}
