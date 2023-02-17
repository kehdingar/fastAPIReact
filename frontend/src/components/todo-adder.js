import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { ADD_TODO_REQUEST } from "../redux/actions";


export default function TodoAdder(){

    const [title, setTitle] = useState(null)

    const titleFieldRef = useRef(null)

    const dispatch = useDispatch();

    function handleTextChange(e){
        setTitle(e.target.value)
    }
    
    async function addTodoItem(params){
        // Preventing empty inputs


        if(title){
            dispatch({
                type:ADD_TODO_REQUEST,
                payload:{
                    title, 
    
                }
            });
            // Clear title after adding
            setTitle(null)
    
            titleFieldRef.current.value = ""
        }

    }

    function handleKeyDown (event){
        if (event.key === 'Enter') {
            if(title){

            dispatch({
                type:ADD_TODO_REQUEST,
                payload:{
                    title, 
    
                }
            });
            // Clear title after adding
            setTitle(null)
    
            titleFieldRef.current.value = ""
        }
        }
      };


    return (
        <div className="flex justify-center bg-white">
          <div className="relative flex ">
            <input type="text"
              id="addTodo"
              ref={titleFieldRef}
              className="py-3 w-80 px-4 rounded-l-md appearance-none focus:outline-none peer bg-gray-600 text-white xs:w-40 lg:w-80 md:w-80"
              placeholder=" "
              onChange={handleTextChange} 
              onKeyDown={handleKeyDown}
            />
            <label htmlFor="addTodo" className="z-auto absolute text-sm  bg-transparent text-gray-400 dark:text-gray-400 duration-300 transform -translate-y-1 scale-75 top-0 origin-[0]  dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-cyan-800 peer-focus:bg-white peer-focus:dark:text-cyan-800 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Add todo</label>
          </div>
          <button type="button" className="py-3 px-4 text-xl text-white bg-cyan-400 rounded-r-md hover:bg-cyan-300 active:bg-cyan-500 outline-none" onClick={addTodoItem}>
            ADD
          </button>
        </div>

    )
}