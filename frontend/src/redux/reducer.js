import { ADD_TODO, TOGGLE_COMPLETED, DELETE_TODO, TOGGLE_IMPORTANT, EDIT_TODO, UPDATE_TODO, TOGGLE_EDIT,SET_INITIAL_STATE } from "./actions";

export const firstState = {
    todos: [],
}

function reducer(state = firstState, action) {

    switch (action.type) { 
        case ADD_TODO:{
            const newState = {
                ...state,
                todos: [...state.todos,
                    {
                        id: action.todos.todo_id,
                        title:action.todos.title,
                        completed: false,
                        isInEdit: false,
                        important: false,
                    },                
                ],
            };
            return newState;

        }

        case EDIT_TODO:{
            const newTodo = state.todos.map((todo) => {
                if (todo.id === action.payload.id) {
                    todo.isInEdit = true;
                }
                return todo;
            });

           const newState = {
            ...state,
            todos: newTodo,
           };
           return newState;
        }

        case TOGGLE_EDIT:{
                    const newTodo = state.todos.map((todo) => {
                        if (todo.isInEdit) {
                            todo.isInEdit = false;
                        }
                        return todo;
                    });
        
                   const newState = {
                    ...state,
                    todos: newTodo,
                   };
                   return newState;
        }


        case UPDATE_TODO:{
            const id = action.todos.id
            const newTodo = state.todos.map((todo) => {
                if (todo.id === id) {
                    if(action.todos.title === ""){
                        // Reset tile to previous tilte if it was empty
                        todo.title = action.todos.prevTitle
                    }else{
                        todo.title = action.todos.title
                    }
                    todo.isInEdit = !todo.isInEdit;
                }
                return todo;
            });

           const newState = {
            ...state,
            todos: newTodo,
           };
           return newState;
        }

        case SET_INITIAL_STATE:{
           const newState = action.payload.initialState
           return newState;
        }


        case TOGGLE_COMPLETED:{
            const id = action.todos.id
            const newTodo = state.todos.map((todo) => {
                if (todo.id === id) {
                    todo.completed = !todo.completed;
                }
                return todo;
            });

           const newState = {
            ...state,
            todos: newTodo,
           };

           return newState;
        }

        case DELETE_TODO:{
            const id = action.todos.id;
            const newTodos = state.todos.filter((todo) =>{
               return( id !== todo.id)
            })

           const newState = {
            ...state,
            todos: newTodos,
           };

           return newState;
        }

        case TOGGLE_IMPORTANT:{
            const id = action.todos.id
            const newTodo = state.todos.map((todo) => {
                if (todo.id === id) {
                    todo.important = !todo.important;
                }
                return todo;
            });

           const newState = {
            ...state,
            todos: newTodo,
           };

           return newState;
        }


    
        default:
            return state;
    }
}

export default reducer 