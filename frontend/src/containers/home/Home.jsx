import React from 'react'
import { useEffect, useState, useRef } from 'react'
import axios from '../../axios'
import { useDispatch } from "react-redux";
import { SET_INITIAL_STATE } from '../../redux/actions';
import { sessionChecker } from '../../redux/middleware';
import { useAuth } from '../../utils/auth';

export default function Home() {

  const [user, setUser] = useState({});
  const auth = useAuth()

  const dispatch = useDispatch();

  const primaryMenuItems = useRef()
  const bars = useRef()
  const xBars = useRef()

  async function getTodos(token) {
    try {
      const response = await axios.get("/todos/", { headers: { Authorization: token } })
      const modified_todos = response.data.result.map((todo) => {
        todo['isInEdit'] = false
        return todo
      })
      const databaseState = { todos: modified_todos }
      dispatch({
        type: SET_INITIAL_STATE,
        payload: {
          initialState: databaseState,
        }
      });
    } catch (error) {
      return error

    }
  }

  useEffect(() => {
    const auth_token = localStorage.getItem("auth_token");
    const auth_token_type = localStorage.getItem("auth_token_type");
    const token = auth_token_type + " " + auth_token;
    //fetch data from get user api
    axios
      .get("/users/", {
        headers: { Authorization: token },
      })
      .then((response) => {
        setUser(response.data.result);
        getTodos(token)
      })
      .catch((error) => {
        sessionChecker(error)
      });
    // eslint-disable-next-line
  }, []);

  function handleLogout(e) {
    e.preventDefault();
    auth.logout()
  }

  function handleMobile() {
    primaryMenuItems.current.classList.toggle("hidden")
    xBars.current.classList.toggle('invisible')

    if (xBars.current.classList.contains('invisible')) {
      bars.current.classList.remove('invisible')
      bars.current.classList.add('visible')
    } else {
      bars.current.classList.remove('visible')
      bars.current.classList.add('invisible')
    }
  }

  return (
    <>
      <nav className="flex items-center justify-between flex-wrap bg-cyan-700 p-6 shadow-md">
        <div className="flex items-center flex-shrink-0 text-white mr-6">
          <img
            className="w-[80px] mr-1"
            alt="logo"
            src="../logo512.png"
          />        </div>

        <div className="block lg:hidden" onClick={handleMobile}>
          <div>
            <button className="relative">
              <div className="relative flex overflow-hidden items-center justify-center rounded-full w-[50px] h-[50px] transform transition-all bg-slate-700 ring-0 ring-gray-300 hover:ring-8 group-focus:ring-4 ring-opacity-30 duration-200 shadow-md">
                <div className="flex flex-col items-center w-[20px] h-[25px] transform transition-all duration-300 overflow-hidden ">
                  <div className="flex flex-col items-center justify-between visible" ref={bars}>
                    <div className="bg-white h-[2px] mb-2 w-7 transform  origin-left group-focus:translate-x-10" ></div>
                    <div className="bg-white h-[1.5px] mb-2 w-7 rounded transform  group-focus:translate-x-10 " ></div>
                    <div className="bg-white h-[2.2px] w-7 transform  origin-left group-focus:translate-x-10"></div>
                  </div>

                  <div className="absolute items-center justify-between transform top-2.5 left-0 translate-x-0 flex invisible" ref={xBars}>
                    <div className="absolute bg-white h-[2px] w-5 transform rotate-45"></div>
                    <div className="absolute bg-white h-[2px] w-5 transform -rotate-45"></div>
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>
        {/* Nav Items */}
        <div className="w-full flex-grow lg:flex lg:items-center lg:w-auto hidden" ref={primaryMenuItems}>
          <div className="text-sm lg:flex-grow">
            <div className="block mt-4 lg:inline-block lg:mt-0 text-white mr-4">
              {`${user.username}`.toUpperCase()}
            </div>
            <div className="block mt-4 lg:inline-block lg:mt-0 text-white mr-4">
              {user.gender}
            </div>
            <div className="block mt-4 lg:inline-block lg:mt-0 text-white">
              {user.email}
            </div>
          </div>
          <div>
            <img
              className="w-12 rounded-full border-8 border-white mr-1"
              alt="profile"
              src={user.profile}
            />
          </div>
          <button
            onClick={(event) => {
              handleLogout(event)
            }}
            className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">
            Logout
          </button>

        </div>
      </nav>
    </>
  )

}
