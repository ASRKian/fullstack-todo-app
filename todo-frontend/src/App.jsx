import Navbar from './components/Navbar'
import Home from './components/Home'
import { Route, Routes, useNavigate } from 'react-router-dom'
import TodoBox from './components/TodoBox'
import { DragDropContext } from 'react-beautiful-dnd'
import CreateInput from './components/CreateInput'
import { usePatchTodoMutation } from './Services/userAuthAPI'
import Cookies from 'js-cookie'
import { useState, useContext,useEffect } from 'react'
import { AuthContext } from './Context/ContextAPI'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import './App.css'

function App() {
  const [patchTodo, { isError, isSuccess }] = usePatchTodoMutation()
  const [count, setCount] = useState(0)
  const useContextAPI = useContext(AuthContext);
  const navigate = useNavigate()

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    const id = Number(draggableId)

    if (!destination) {
      return;
    }

    if (destination.droppableId === source.droppableId) {
      return;
    }
    if (await useContextAPI.isLoggedIn()) {
      const access_token = Cookies.get('access_token')
      if (destination.droppableId === 'complete') {
        await patchTodo({
          body: {
            complete: true
          }, id, access_token
        })
      } else {
        await patchTodo({
          body: {
            priority: destination.droppableId,
            complete: false
          }, id, access_token
        })
      }
    } else {
      navigate('/')
    }
  }
  useEffect(() => {
    isSuccess && setCount(count + 1)
  }, [isSuccess])

  return (<>
    {isError ? <h1>Some error occurred</h1> : <DragDropContext onDragEnd={onDragEnd}>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/todo' element={<TodoBox count={count} />} />
        <Route path='/addtodo' element={<CreateInput />} />
      </Routes>
      <ToastContainer />
    </DragDropContext>}
  </>
  )
}

export default App
