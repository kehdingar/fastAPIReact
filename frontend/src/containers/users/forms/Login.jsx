import { Link, useNavigate, } from "react-router-dom"
import { useState, useRef } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../../utils/auth";
import axios from '../../../axios'


const Login = () => {
  const navigate = useNavigate()
  const auth = useAuth()
  const loader = useRef()

  const [loginForm, setLoginform] = useState({
    username: "",
    password: "",
  });

  const onChangeForm = (label, event) => {
    switch (label) {
      case "username":
        setLoginform({ ...loginForm, username: event.target.value });
        break;
      case "password":
        setLoginform({ ...loginForm, password: event.target.value });
        break;
      default:
        break;
    }
  };

  const onSubmitHandler = async (event) => {

    event.preventDefault();
    loader.current.classList.toggle('hidden')

    // call api login
    await axios
      .post("/auth/login", loginForm)
      .then((response) => {

        // Save token to local storage
        auth.login(response.data.result.access_token, response.data.result.token_type)
        toast.success("You have been logged in")
      })
      .catch((error) => {
        // add error notif
        toast.error(error.response.data.detail);
        loader.current.classList.toggle('hidden')
        return navigate('/login')

      });
  };

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold text-center">
          Welcome to Kehdinga's Todo
        </h1>
        <p className="w-80 text-center text-sm mb-8 font-semibold text-gray-700 tracking-wide cursor-pointer mx-auto">
          Please login to your account!
        </p>
      </div>
      <form onSubmit={onSubmitHandler}>
        <div className='space-y-4'>
          <div className="relative">
            <input type="text"
              id="username"
              className="block px-3 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent border rounded-lg  appearance-none focus:outline-none focus:ring focus:ring-cyan-400 peer"
              placeholder=" "
              onChange={(event) => {
                onChangeForm("username", event);
              }}
            />
            <label htmlFor="username" className="absolute text-sm text-gray-400 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-cyan-800 peer-focus:dark:text-cyan-800 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Username</label>
          </div>

          <div className="relative">
            <input type="password"
              id="password"
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 border bg-transparent rounded-lg  appearance-none focus:outline-none focus:ring  focus:ring-cyan-400 peer"
              placeholder=" "
              onChange={(event) => {
                onChangeForm("password", event);
              }}
            />
            <label htmlFor="password" className="absolute text-sm text-gray-400 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-cyan-800 peer-focus:dark:text-cyan-800 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Password</label>
          </div>
          <div className="text-center mt-6">
            <button
              type="submit"
              className="py-3 w-64 text-xl text-white bg-cyan-400 rounded-2xl hover:bg-cyan-300 active:bg-cyan-500 outline-none"
            >
              <div role="status" className='flex justify-center' >
                <svg aria-hidden="true" ref={loader} className="w-7 mr-2 hidden text-gray-200 animate-spin dark:text-gray-600 fill-cyan-700" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                </svg>
                <span>Sign In</span>
              </div>
            </button>
            <p className="mt-4 text-sm">
              You don't have an account?{" "}
              <Link to="/register">
                <span className="underline cursor-pointer mr-1">Register</span>
              </Link>
              or{" "}
              <Link to="/forgot">
                <span className="underline cursor-pointer">Forgot Password?</span>

              </Link>
            </p>
          </div>

          {/* <input type="text"
                        placeholder="Username"
                        className="block text-sm py-3 px-4 rounded-lg w-full border outline-none focus:ring focus:outline-none focus:ring-cyan-400" />

                    <input type="passowrd"
                        placeholder="Password"
                        className="block text-sm py-3 px-4 rounded-lg w-full border outline-none focus:ring focus:outline-none focus:ring-cyan-400" /> */}

        </div>

      </form>
    </>
  )
}

export default Login