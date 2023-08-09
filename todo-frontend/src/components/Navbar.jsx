import { useContext } from "react";
import { AuthContext } from "../Context/ContextAPI";
import Login from "./Login";
import Register from "./Register";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Navbar() {
    const useContextAPI = useContext(AuthContext);
    const state = useSelector(state => state.user);

    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary" data-bs-theme="dark">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">Todo-List</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link active" aria-current="page" to="/">Home</Link>
                        </li>
                       {state.user && <li className="nav-item">
                            <Link className="nav-link" to="/todo">Todo-List</Link>
                        </li>}
                       {state.user && <li className="nav-item">
                            <Link className="nav-link" to="/addtodo">Add-Todo</Link>
                        </li>}
                    </ul>
                    {/* <!-- Login Button trigger modal --> */}
                    {!state.user && <button type="button" className="btn btn-secondary mx-2" data-bs-toggle="modal" data-bs-target="#loginModal">
                        Login
                    </button>}

                    {/* <!-- Login Modal --> */}
                    <div className="modal fade fc" id="loginModal" tabIndex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="loginModalLabel">Login</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">

                                    <Login />

                                </div>
                            </div>
                        </div>
                    </div>


                    {/* <!-- Register Button trigger modal --> */}
                    {!state.user && <button type="button" className="btn btn-secondary mx-2" data-bs-toggle="modal" data-bs-target="#registerModal">
                        Register
                    </button>}

                    {/* <!-- Register Modal --> */}
                    <div className="modal fade fc" id="registerModal" tabIndex="-1" aria-labelledby="registerModalLabel" aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="registerModalLabel">Register here</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">

                                    <Register />

                                </div>
                            </div>
                        </div>
                    </div>

                    {state.user && <button type="button" className="btn btn-secondary mx-2" onClick={useContextAPI.deleteCookie}>Logout</button>}
                </div>
            </div>
        </nav>
    )
}
