import { ADD_TODO,ADD_TODO_REQUEST, DELETE_TODO_REQUEST, DELETE_TODO,TOGGLE_COMPLETED_REQUEST,TOGGLE_COMPLETED, TOGGLE_IMPORTANT,TOGGLE_IMPORTANT_REQUEST, UPDATE_TODO, UPDATE_TODO_REQUEST } from "./actions";

import { takeEvery, put, call, all } from "@redux-saga/core/effects";
import axios from '../axios'
import { toast } from "react-toastify";



function getAuthorization(){
    const auth_token = localStorage.getItem("auth_token");
    const auth_token_type = localStorage.getItem("auth_token_type");
    const token = auth_token_type + " " + auth_token;
    return token
}

export function sessionChecker(error){
    const msg = error.response.data.detail.message
     if (error.response.data.detail.ref === "exp"){
        toast.error(msg,{
            onClose: () => {
              localStorage.setItem('exp_msg',msg)
              localStorage.clear()
              window.location.href="/login"
            },
            autoClose: 5000
          });
        
    }else{
        return error
    }

 }

async function apiAddTodo(action) {
    try {
        const title = action.payload.title
        const data = {title:title}
        const response = await axios.post("/todos/add", data, { headers: { Authorization: getAuthorization() } });
        return response
    } catch (error) {
       sessionChecker(error)
    }
   }

function* addTodo(action){
       try {
           const todo = yield call(apiAddTodo,action)

           yield put({ type:ADD_TODO , todos: todo.data });

       } catch (error) {
            return error
       }
      
     }

async function apiDeleteTodo(action) {
    try {
        const id = action.payload.id
        const url = "/todos/delete/" + id
        const response = await axios.delete(url,{ headers: { Authorization: getAuthorization() } });
        return response
    } catch (error) {
        sessionChecker(error)
    }
   }

function* deleteTodo(action){
    try {
        const todo = yield call(apiDeleteTodo,action)
        // Send the action to the store
        yield put({ type:DELETE_TODO ,todos: todo.data });
        
    } catch (error) {
      return error
    }
  }

async function apiToggleCompleted(action) {
    try {
        const id = action.payload.id
        const completed = action.payload.completed
        const data = {data:{completed:completed}}
        const url = "/todos/toggleCompleted/" + id
        const response = await axios.put(url,data,{ headers: { Authorization: getAuthorization()} });
        return response
    } catch (error) {
        sessionChecker(error)
    }
   }

function* toggleCompleted(action){
    try {
        const todo = yield call(apiToggleCompleted,action)
        // Send the action to the store
        yield put({ type:TOGGLE_COMPLETED ,todos: todo.data });
        
    } catch (error) {
      return error
    }
  }

async function apiToggleImportant(action) {
    try {
        const id = action.payload.id
        const important = action.payload.important
        const data = {data:{important:important}}
        const url = "/todos/toggleImportant/" + id
        const response = await axios.put(url,data,{ headers: { Authorization: getAuthorization() } });
        return response
    } catch (error) {
        sessionChecker(error)
    }
   }

function* toggleImportant(action){
    try {
        const todo = yield call(apiToggleImportant,action)
        // Send the action to the store
        yield put({ type:TOGGLE_IMPORTANT ,todos: todo.data });
        
    } catch (error) {
        return error
    }
  }

async function apiUpdateTodo(action) {
    try {
        const id = action.payload.id
        const title = action.payload.title
        const prevTitle = action.payload.prevTitle
        if (title === ""){
            return {data:{title:title,prevTitle:prevTitle,id:id}}
        }
        const data = {data:{title:title}}
        const url = "/todos/update/" + id
        const response = await axios.put(url,data,{ headers: { Authorization: getAuthorization() } });
        return response
    } catch (error) {
        sessionChecker(error)
    }
   }

function* updateTodo(action){
    try {
        const todo = yield call(apiUpdateTodo,action)
        // Send the action to the store
        yield put({ type:UPDATE_TODO ,todos: todo.data });
        
    } catch (error) {
      return error
    }
  }


function* middleware() {
    yield all([
        yield takeEvery(ADD_TODO_REQUEST, addTodo),
        yield takeEvery(DELETE_TODO_REQUEST, deleteTodo),
        yield takeEvery(TOGGLE_COMPLETED_REQUEST, toggleCompleted),
        yield takeEvery(TOGGLE_IMPORTANT_REQUEST, toggleImportant),
        yield takeEvery(UPDATE_TODO_REQUEST, updateTodo),

    ]);
  }
  
  export default middleware;


// export default function*(){
//         yield* addTodos()
//         yield* deleteTodos()
 
// }

// Running Tasks In Parallel
// import { all, call } from 'redux-saga/effects'

// // correct, effects will get executed in parallel
// const [users, repos] = yield all([
//   call(fetch, '/users'),
//   call(fetch, '/repos')
// ])