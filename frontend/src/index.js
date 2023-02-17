import React from 'react';
import './index.css';
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider, Link, } from "react-router-dom";
import Register from './containers/users/forms/Register';
import Forgot from './containers/users/forms/Forgot';
import Login from './containers/users/forms/Login';
import Reset from './containers/users/forms/Reset';
import { ToastContainer } from 'react-toastify'
import "react-toastify/ReactToastify.min.css"
import Home from './containers/home/Home';
import { AuthProvider } from './utils/auth';
import { RequireAuth } from './utils/RequireAuth';
import Todo from './containers/todo/Todo';
import { Provider } from "react-redux";
import { store } from "./redux/store"

function AppLayout({ children }) {
  return (
    <Provider store={store}>

      <AuthProvider>
        <div className='min-h-screen bg-cyan-700 flex justify-center items-center'>
          <div className='py-12 px-12 bg-white rounded-2xl shadow-xl z-20'>
            {children}
          </div>
        </div>
      </AuthProvider>
    </Provider>

  )
}

function AuthAppLayout({ children }) {

  return (
    <Provider store={store}>
      <AuthProvider>
        <div className='min-h-screen flex flex-col'>
          {children}

          <Todo />
        </div>
      </AuthProvider>
    </Provider>
  )
}

function ErrorPage() {
  return (
    <div className='min-h-screen bg-cyan-700 flex justify-center items-center'>
      <div className='py-12 px-12 bg-white rounded-2xl shadow-xl z-20'>
        <h1 className="text-3xl font-bold text-center">Oops! Nothing found</h1>
        <p className="text-1xl font-bold text-center my-7">Login <Link to="/login"><span className="text-1xl underline">Here</span></Link></p>
      </div>
    </div>
  )
}

const router = createBrowserRouter([
  {
    path: "/",
    element:
      <AppLayout>
        <Login />
      </AppLayout>,
  },
  {
    path: "/login",
    element:
      <AppLayout>
        <Login />
      </AppLayout>,
  },
  {
    path: "/register",
    element:
      <AppLayout>
        <Register />
      </AppLayout>,
  },
  {
    path: "/forgot",
    element:
      <AppLayout>
        <Forgot />
      </AppLayout>,
  },
  {
    path: "/home",
    element:
      <AuthAppLayout>
        <RequireAuth>
          <Home />
        </RequireAuth>
      </AuthAppLayout>,
  },
  {
    path: "/reset",
    element:
      <AppLayout>
        <Reset />
      </AppLayout>,
  },
  {
    path: "*",
    element: <ErrorPage />
  },
]

);

createRoot(document.getElementById("root")).render(
  <>
    <ToastContainer />
    <RouterProvider router={router} />
  </>
);