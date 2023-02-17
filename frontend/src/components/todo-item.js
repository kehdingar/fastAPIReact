
import { AiTwotoneEdit, AiOutlineStar, AiFillStar } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import React from 'react'
import { DELETE_TODO_REQUEST, TOGGLE_COMPLETED_REQUEST, TOGGLE_IMPORTANT_REQUEST, EDIT_TODO, UPDATE_TODO_REQUEST } from '../redux/actions';
import { useDispatch } from "react-redux";



export default function TodoItem({ id, title, completed, important, isInEdit }) {

  const dispatch = useDispatch();

  function toggleCheckBox() {

    dispatch({
      type: TOGGLE_COMPLETED_REQUEST,
      payload: {
        id,
        completed
      }
    })
   
  }

  function toggleImportant() {
    dispatch({
      type: TOGGLE_IMPORTANT_REQUEST,
      payload: {
        id,
        important
      }
    })
  }

  function handleDeleteClick() {
    dispatch({
      type: DELETE_TODO_REQUEST,
      payload: {
        id,
      }
    })
  }

  // Prevent triggering parent to clearing the edit
  function handleTextClick(e) {
    e.stopPropagation();
  }

  function handleEdit(e) {
    dispatch({
      type: EDIT_TODO,
      payload: {
        id,
        isInEdit,
      }
    })
    // Prevent parent component evenlistener from bublling up
    e.stopPropagation();
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      dispatch({
        type: UPDATE_TODO_REQUEST,
        payload: {
          id,
          title: event.target.value,
          prevTitle: title
        }
      })
    }
  };

  return (
    <div className='flex mb-4'>
      <div className="task-left flex flex-1">
        <input type="checkbox" checked={completed ? 'checked' : ''} value=""
          className="appearance-none
                    cursor-pointer
                    min-w-[25px]
                    h-6 w-6
                    bg-gray-400 
                    rounded-sm  
                    checked:bg-green-300 
                    checked:scale-75
                  transition-all 
                  duration-200 
                  peer
                  after:content-['']
                  after:text-center
                  "
          onChange={toggleCheckBox}
        />
        <div className="h-6 w-6 
                            absolute 
                            rounded-sm 
                            pointer-events-none
                          peer-checked:border-green-300 
                          transition-all 
                          duration-200 
                          peer-checked:border-2">
        </div>
        <div className="h-6 w-6 
                            rounded-sm
                            absolute
                            pointer-events-none
                          peer-checked:border-green-300 
                          peer-checked:after:content-['✓']
                          peer-checked:text-center
                          ">
        </div>
        {isInEdit ?
          <div className="w-full min-w-[200px]">
            <input
              className="ml-2 w-[410px] placeholder:text-white placeholder:italic border-b border-cyan-400 bg-transparent  font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-cyan-400 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
              defaultValue={title}
              onKeyDown={handleKeyDown}
              onClick={handleTextClick}
            />
          </div>
          :
          <label htmlFor='editTodo' className='flex flex-col justify-center px-2 peer-checked:text-green-400  select-none peer-checked:line-through'>{title}</label>}


      </div>
      <div className="task-right flex gap-1 text-xl">
        <AiTwotoneEdit className="cursor-pointer" onClick={handleEdit} />
        {important ? <AiFillStar className="cursor-pointer" onClick={toggleImportant} /> : <AiOutlineStar className="cursor-pointer" onClick={toggleImportant} />}
        <MdDelete className="cursor-pointer" onClick={handleDeleteClick} />
      </div>
    </div>
  )
}
