import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useCreateTodoMutation } from '../Services/userAuthAPI';
import { AuthContext } from '../Context/ContextAPI';
import { changeUser } from '../Slices/userSlice';
import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

export default function CreateInput() {
    const navigate = useNavigate();
    const [createTodo] = useCreateTodoMutation();
    const dispatch = useDispatch()
    const useContextAPI = useContext(AuthContext)

    const [todo, setTodo] = useState('');
    const [priority, setPriority] = useState('low');

    useEffect(() => {
        useContextAPI.isLoggedIn()
            .then((res) => { !res && navigate('/'), dispatch(changeUser(res)) })
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();

        const body = {
            todo,
            priority,
            complete: false
        }
        if (await useContextAPI.isLoggedIn()) {
            const access_token = Cookies.get('access_token')
            const res = await createTodo({ body, access_token })
            console.log(res);
            setPriority('low');
            setTodo('')
            if (res.data?.msg === 'data created') {
                toast.success('Todo created successfully!', {
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
            toast.error('Session expired, please login again...', {
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
    }
    return (
        <div className='container'>
            <h1 className='mt-4 mb-5'>Input todo here</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Todo title</label>
                    <input type="text" className="form-control" name='todo' value={todo} onChange={e => setTodo(e.target.value)} id="title" placeholder="Todo title" required />
                </div>


                <div className="mb-3">
                    <label htmlFor="priority" className="form-label">Todo Priority</label>
                    <select className="form-select" id='priority' name='priority' onChange={e => setPriority(e.target.value)} aria-label="Default select example">
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}
