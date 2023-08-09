import { useContext } from "react";
import { useRegisterUserMutation } from "../Services/userAuthAPI";
import { AuthContext } from "../Context/ContextAPI";
import { useDispatch } from "react-redux";
import { changeUser } from "../Slices/userSlice";
import { toast } from "react-toastify";

export default function Register() {
    const useContextAPI = useContext(AuthContext);
    const dispatch = useDispatch()

    const [registerUser] = useRegisterUserMutation()

    const handleSubmit = async (e) => {
        e.preventDefault()
        const data = new FormData(e.currentTarget);
        const actualData = {
            name: data.get('name'),
            email: data.get('email'),
            password: data.get('password1'),
            password2: data.get('password2'),
            tc: data.get('tc')
        }
        if (actualData.password === actualData.password2) {
            const response = await registerUser(actualData);
            if (response.error?.data.errors.email[0] === "user with this Email already exists.") {
                toast.error('user already exist!', {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            } else if (response.data?.msg === 'registration success') {
                const { access, refresh } = response.data.token
                useContextAPI.storeCookie(access, refresh)
                toast.success('Registration successfully!', {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                dispatch(changeUser(true))
            }
        } else {
            toast.error('Password & confirm password do not match!', {
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
    }
    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label htmlFor="name" className="form-label">Name</label>
                <input type="text" className="form-control" name="name" id="name" aria-describedby="name" required />
            </div>
            <div className="mb-3">
                <label htmlFor="email" className="form-label">Email address</label>
                <input type="email" className="form-control" name="email" id="email" aria-describedby="email" required />
            </div>
            <div className="mb-3">
                <label htmlFor="password1" className="form-label">Password</label>
                <input type="password" className="form-control" name="password1" id="password1" required />
            </div>
            <div className="mb-3">
                <label htmlFor="password2" className="form-label">Confirm Password</label>
                <input type="password" className="form-control" name="password2" id="password2" required />
            </div>
            <div className="mb-3 form-check">
                <input type="checkbox" className="form-check-input" value={true} name="tc" id="tc" required />
                <label className="form-check-label" htmlFor="tc">Check me out</label>
            </div>
            <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Submit</button>
        </form>
    )
}
