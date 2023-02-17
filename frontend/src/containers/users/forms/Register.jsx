import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import { useState, useRef } from 'react'
import { Link, useNavigate } from "react-router-dom";
import React from 'react'
import Select from 'react-select'
import axios from '../../../axios'
import { toast } from 'react-toastify';


const Register = () => {
    const navigate = useNavigate();

    const [startDate, setStartDate] = useState();

    const loader = useRef()


    function DatepickerCustom() {
        const dateFormat = "dd-MM-yyyy"
        return (
            <div className="relative">
                <DatePicker
                    className="block px-3 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent border rounded-lg  appearance-none focus:outline-none focus:ring focus:ring-cyan-400 peer"
                    dateFormat={dateFormat}
                    name="birth"
                    placeholderText="day-month-year"
                    selected={startDate}
                    onChange={
                      (event) => {    
                            setStartDate(event)
                            localStorage.setItem('raw_date',event)
                            onChangeForm("birth", localStorage.getItem('raw_date'))
                        }
                    }
                />
                <label htmlFor="name" className="absolute text-sm text-gray-400 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-cyan-800 peer-focus:dark:text-cyan-800 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Date of Birth</label>
            </div>
        );
    }

      // convert format date to string
  const formatDate = (date) => {
    let d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    return [day, month, year].join("-");
  };

    const options = [
        { value: "MALE", label: "Male" },
        { value: "FEMALE", label: "Female" }
    ]

    // Register Form
    const [formRegister, setFormRegister] = useState({
        name: "",
        username: "",
        email: "",
        phone_number: "",
        passowrd: "",
        birth: "",
        gender: "",
        profile: "",
    })

    const customStyles = {
        control: (base, state) => ({
            ...base,
            height: 50,
            border: state.isFocused ? "3px solid #22d3ee" : "none",
            borderRadius: state.isFocused ? 11 : "none",
            "&:hover": {
                boxShadow: "none",
                borderRadius: 10,

            }
        })
    };


    const onChangeForm = (label, event) => {
        switch (label) {
            case "name":
                setFormRegister({ ...formRegister, name: event.target.value });
                break;
            case "username":
                setFormRegister({ ...formRegister, username: event.target.value });
                break;
            case "email":
                // email validation
                const email_validation = /\S+@\S+\.\S+/;
                if (email_validation.test(event.target.value)) {
                    setFormRegister({ ...formRegister, email: event.target.value });
                }
                break;
            case "phone_number":
                setFormRegister({ ...formRegister, phone_number: event.target.value });
                break;
            case "password":
                setFormRegister({ ...formRegister, password: event.target.value });
                break;
            case "gender":
                setFormRegister({ ...formRegister, gender: event });
                break;
            case "birth":
                setFormRegister({ ...formRegister, birth: formatDate(event) });
                break;
            default:
                break;
        }

    };

    //   Submit handler
    const onSubmitHandler = async (event) => {
        event.preventDefault();
        loader.current.classList.toggle('hidden')
        // Post to register API
        await axios
          .post("/auth/register", formRegister)
          .then((response) => {
            // move to sign in page
            navigate("/login");
            // add successfully notif
            toast.success(response.data.detail);

          })
          .catch((error) => {
            // add error notif
            toast.error(error.response.data.detail);
            loader.current.classList.toggle('hidden')

          });
    };

    return (
        <>
            <div>
                <h1 className="text-3xl font-bold text-center cursor-pointer">
                    Create An Account
                </h1>
                <p className="w-80 text-center text-sm mb-8 font-semibold text-gray-700 tracking-wide cursor-pointer mx-auto">
                    Welcome to Raymond's Todo!
                </p>
            </div>
            <form onSubmit={onSubmitHandler}>
                <div className='space-y-4'>
                    <div className="relative">
                        <input type="text"
                            id="name"
                            className="block px-3 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent border rounded-lg  appearance-none focus:outline-none focus:ring focus:ring-cyan-400 peer"
                            placeholder=" "
                            onChange={(event) => {
                                onChangeForm("name", event)
                            }}
                        />
                        <label htmlFor="name" className="z-auto absolute text-sm text-gray-400 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-cyan-800 peer-focus:dark:text-cyan-800 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Name</label>
                    </div>

                    <div className="relative">
                        <input type="text"
                            id="username"
                            className="block px-3 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent border rounded-lg  appearance-none focus:outline-none focus:ring focus:ring-cyan-400 peer"
                            placeholder=" "
                            onChange={(event) => {
                                onChangeForm("username", event)
                            }}
                        />
                        <label htmlFor="username" className="z-auto absolute text-sm text-gray-400 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-cyan-800 peer-focus:dark:text-cyan-800 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Username</label>
                    </div>


                    <div className="relative z-auto">
                        <DatepickerCustom />
                    </div>

                    <div className="relative block w-full text-sm text-gray-900 bg-transparent border rounded-lg focus:ring focus:ring-cyan-400 peer">

                        <Select
                            styles={customStyles}
                            placeholder="Gender..."
                            className="basic-single focus:ring focus:ring-cyan-400 peer"
                            classNamePrefix="select"
                            isSearchable="true"
                            name="gender"
                            options={options}
                            theme={(theme) => ({
                                ...theme,
                                borderRadius: 4,
                                colors: {
                                    ...theme.colors,
                                    text: 'rgb(6 182 212)',
                                    primary25: 'rgb(59 130 246 / 0.12)',
                                    primary: 'rgb(6 182 212)',
                                },
                            })}
                            onChange={(option) => {
                                onChangeForm("gender",option.value)
                            }}
                            

                        />

                        <label htmlFor="gender" className="z-auto absolute text-sm text-gray-400 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-cyan-800 peer-focus:dark:text-cyan-800 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Gender</label>
                    </div>


                    <div className="relative">
                        <input type="number"
                            id="phone_number"
                            className=" block px-3 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent border rounded-lg  appearance-none focus:outline-none focus:ring focus:ring-cyan-400 peer"
                            placeholder=" "
                            onChange={(event) => {
                                onChangeForm("phone_number", event)
                            }}
                        />
                        <label htmlFor="phone_number" className="z-auto absolute text-sm text-gray-400 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2  origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-cyan-800 peer-focus:dark:text-cyan-800 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Phone Number</label>
                    </div>
                    <div className="relative">
                        <input type="email"
                            id="email"
                            className="block px-3 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent border rounded-lg  appearance-none focus:outline-none focus:ring focus:ring-cyan-400 peer"
                            placeholder=" "
                            onChange={(event) => {
                                onChangeForm("email", event)
                            }}
                        />
                        <label htmlFor="email" className="z-auto absolute text-sm text-gray-400 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2  origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-cyan-800 peer-focus:dark:text-cyan-800 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Email</label>
                    </div>
                    <div className="relative">
                        <input type="password"
                            id="password"
                            className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 border bg-transparent rounded-lg  appearance-none focus:outline-none focus:ring  focus:ring-cyan-400 peer"
                            placeholder=" "
                            onChange={(event) => {
                                onChangeForm("password", event)
                            }}
                        />
                        <label htmlFor="password" className="z-auto absolute text-sm text-gray-400 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2  origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-cyan-800 peer-focus:dark:text-cyan-800 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Password</label>
                    </div>
                    <div className="text-center mt-6">
                        <button
                            type="submit"
                            className="py-3 w-64 text-xl text-white bg-cyan-400 rounded-2xl hover:bg-cyan-300 active:bg-cyan-500 outline-none"
                        >
                        <div role="status" className='flex justify-center' >
                            <svg aria-hidden="true" ref={loader} className="w-7 mr-2 hidden text-gray-200 animate-spin dark:text-gray-600 fill-cyan-700" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                            </svg>
                            <span>Create</span>
                        </div>
                        </button>
                        <p className="mt-4 text-sm">
                            Already have an account?{" "}
                            <Link to="/login">
                                <span className="underline cursor-pointer mr-2">Sign In</span>
                            </Link>
                        </p>
                    </div>
                </div>

            </form>
        </>
    )
}

export default Register
