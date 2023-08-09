import { Droppable } from 'react-beautiful-dnd'
import { useDeleteTodoMutation, useLazyGetTodosQuery } from '../Services/userAuthAPI'
import Cookies from 'js-cookie'
import SingleTodo from './SingleTodo'
import { useNavigate } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import { changeUser } from '../Slices/userSlice'
import { useDispatch } from 'react-redux'
import { AuthContext } from '../Context/ContextAPI'
import { toast } from 'react-toastify'

export default function TodoBox(props) {
    const [deleteCount, setDeleteCount] = useState(0)
    const navigate = useNavigate();
    const [getTodos, { isLoading }] = useLazyGetTodosQuery();
    const [deleteTodo, { isError, isSuccess }] = useDeleteTodoMutation()

    const [todos, setTodos] = useState()

    const access = () => {
        const access_token = Cookies.get('access_token')
        return access_token
    }

    const dispatch = useDispatch()
    const useContextAPI = useContext(AuthContext);

    const deleting = async (id) => {
        if (await useContextAPI.isLoggedIn()) {
            const access_token = Cookies.get('access_token');
            await deleteTodo({ access_token, id });
            setDeleteCount(deleteCount + 1)
            toast.success('Todo deleted successfully', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                });
        } else {
            alert('Your session expired, Please login again!')
            navigate('/')
        }
    }

    useEffect(() => {
        useContextAPI.isLoggedIn()
            .then((res) => { res ? getTodos(access()).then(res => setTodos(res.data)) : navigate('/'), dispatch(changeUser(res)) })

    }, [props.count, deleteCount])

    let low = 0;
    let medium = 0;
    let high = 0;
    let complete = 0;

    return (

        <div className="container">
            <h2 className='text-center'>Your Todos</h2>
            <div className="row">
                <Droppable droppableId='low'>
                    {
                        (provided) => (
                            <div className={`col-md-2 mt-3 m-5 shadow-lg p-3 mb-4 rounded bg-success`} style={{ height: '80vh', textAlign: 'center' }} ref={provided.innerRef} {...provided.droppableProps}>
                                <h5>Low Priority</h5>
                                {
                                    !isLoading && todos?.map((todo) => {
                                        return !todo.complete && todo.priority === 'low' && <SingleTodo key={todo.id} id={todo.id} index={low++} {...todo} delete={deleting} />
                                    })
                                }
                                {provided.placeholder}
                            </div>
                        )
                    }
                </Droppable>
                <Droppable droppableId='medium'>
                    {
                        (provided) => (
                            <div className={`col-md-2 mt-3 m-5 shadow-lg p-3 mb-4 rounded bg-warning`} style={{ height: '80vh', textAlign: 'center' }} ref={provided.innerRef} {...provided.droppableProps}>
                                <h5>Medium Priority</h5>

                                {
                                    !isLoading && todos?.map((todo, index) => {
                                        return !todo.complete && todo.priority === 'medium' && <SingleTodo key={todo.id} id={todo.id} index={medium++} {...todo} delete={deleting} />
                                    })
                                }
                                {provided.placeholder}
                            </div>
                        )
                    }
                </Droppable>
                <Droppable droppableId='high'>
                    {
                        (provided) => (
                            <div className={`col-md-2 mt-3 m-5 shadow-lg p-3 mb-4 rounded bg-danger`} style={{ height: '80vh', textAlign: 'center' }} ref={provided.innerRef} {...provided.droppableProps}>
                                <h5>High Priority</h5>

                                {
                                    !isLoading && todos?.map((todo) => {
                                        return !todo.complete && todo.priority === 'high' && <SingleTodo key={todo.id} id={todo.id} index={high++} {...todo} delete={deleting} />
                                    })
                                }
                                {provided.placeholder}
                            </div>
                        )
                    }
                </Droppable>
                <Droppable droppableId='complete'>
                    {
                        (provided) => (
                            <div className={`col-md-2 mt-3 m-5 shadow-lg p-3 mb-4 rounded bg-primary`} style={{ height: '80vh', textAlign: 'center' }} ref={provided.innerRef} {...provided.droppableProps}>
                                <h5>Completed</h5>
                                {
                                    !isLoading && todos?.map((todo) => {
                                        return todo.complete && <SingleTodo key={todo.id} id={todo.id} index={complete++} {...todo} delete={deleting} />
                                    })
                                }
                                {provided.placeholder}
                            </div>
                        )
                    }
                </Droppable>
            </div>
        </div>
    )
}
