import { Draggable } from 'react-beautiful-dnd'

export default function SingleTodo(props) {
    return (
        <Draggable draggableId={props.id.toString()} index={props.index}>
            {
                (provided) => (

                    <div className='shadow p-3 mb-5 bg-body-tertiary rounded row' ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                        <div className='col-10'>
                            {props.todo}
                        </div>
                        <i className="fa-solid fa-trash-can col-2 fs-5 pointer" onClick={() => props.delete(props.id)} style={{ "color": "#fa0000" }}></i>
                    </div>
                )
            }
        </Draggable>
    )
}
