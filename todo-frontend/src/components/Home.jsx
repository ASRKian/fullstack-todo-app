import { useContext, useEffect, useState } from "react"
import { changeUser } from "../Slices/userSlice"
import { AuthContext } from "../Context/ContextAPI";
import { useDispatch, useSelector } from "react-redux";
import todo from '../Images/todo.svg'
import { useLazyGetDetailsQuery } from "../Services/userAuthAPI";
import Cookies from "js-cookie";

export default function Home() {

    const dispatch = useDispatch()
    const useContextAPI = useContext(AuthContext);
    const state = useSelector(state => state.user)
    const [getDetails, { isError, isSuccess, isLoading }] = useLazyGetDetailsQuery()
    const [userData, setUserData] = useState()

    const details = async () => {
        const access_token = Cookies.get('access_token')
        const res = await getDetails(access_token)
        setUserData(res.data);
    }

    useEffect(() => {
        useContextAPI.isLoggedIn()
            .then((res) => { dispatch(changeUser(res)), res && details() })
            .catch(err => console.log(err))
    }, [])

    return (
        <div className="px-4 py-3 my-5 text-center">
            <img className="d-block mx-auto mb-3" src={todo} alt="" width="200px" height="200px" />
            <h1 className="display-5 fw-bold text-body-emphasis">Todo Web App</h1>
            <div className="col-lg-6 mx-auto">
                {!isLoading && !state.user ? <p className="lead mb-4">Now there is no need to remember your daily task all the time, just register and start adding your daily task list and all set!</p> : <h3>Welcome: {userData?.name}</h3>}
            </div>
        </div>
    )
}