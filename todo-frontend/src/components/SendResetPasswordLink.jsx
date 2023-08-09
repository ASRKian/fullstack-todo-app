import { toast } from "react-toastify"
import { useSendResetPasswordLinkMutation } from "../Services/userAuthAPI"

export default function SendResetPasswordLink() {
    const [sendResetPasswordLink] = useSendResetPasswordLinkMutation()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const data = new FormData(e.currentTarget)
            const actualData = {
                email: data.get('resetEmail')
            }
            const res = await sendResetPasswordLink(actualData);
            if (res.data?.msg === "Password reset link send, please check your email") {
                toast.success('Email sent successfully, check it & click on link', {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            } else if (res.error?.data.errors.non_field_errors[0] === "You are not the registered user!") {
                toast.error('Given email is not registered, please register it first!', {
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
                <label htmlFor="resetEmail" className="form-label">Email address</label>
                <input type="email" className="form-control" name="resetEmail" id="resetEmail" aria-describedby="email" required />
            </div>
            <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Submit</button>
        </form>
    )
}
