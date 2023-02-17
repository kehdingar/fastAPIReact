import TodoItem from "../../components/todo-item";
import { useDispatch } from 'react-redux';
import { useSelector } from "react-redux"
import TodoAdder from "../../components/todo-adder";
import { TOGGLE_EDIT } from "../../redux/actions";


export default function Todo(props) {

  const dispatch = useDispatch();

  const { todos } = useSelector((state) => {
    return {
      todos: state.todos
    }
  })

  const prioritisedTodos = (function prioritise() {

    const importantTodos = [];
    const notImportantTodos = []

    todos.forEach(todo => {
      if (todo.important) {
        importantTodos.push(todo);
      } else {
        notImportantTodos.push(todo)
      }
    })

    // Join the two arrays and return the
    // the resultant array which contains both of them
    return importantTodos.concat(notImportantTodos)
  })();

  function handleClick(e) {

    dispatch({
      type: TOGGLE_EDIT,
      payload: {

      }
    })

  }

  return (
    <div className='bg-white font-sans flex-grow main-todo mt-9' onClick={handleClick}>
      <TodoAdder />
      <div className="w-full flex flex-row flex-wrap bg-gray-600 justify-end mt-6 pt-4 px-6 min-h-[20rem] gap-8">

        <div className="flex flex-1 flex-col">
          <h4 className=" text-3xl text-center text-white border-b-4 pb-2 mb-2 border-white-500">Tasks</h4>
          <div className="text-white">
            {prioritisedTodos.map((todo) => {
              if (!todo.completed) {
                return <TodoItem key={todo.id} {...todo} />
              } else {
                return null
              }
            })}
          </div>
        </div>

        <div className="flex flex-1 flex-col">
          <h4 className=" text-3xl text-center text-white border-b-4 pb-2 mb-2 border-white-500">Completed</h4>
          <div className="text-white">
            {prioritisedTodos.map((todo) => {
              if (todo.completed) {
                return <TodoItem key={todo.id} {...todo} />
              } else {
                return null
              }
            })}
          </div>
        </div>
      </div>
    </div>
  )

}
