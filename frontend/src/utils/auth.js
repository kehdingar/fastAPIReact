import { createContext, useContext, } from "react";
import { useNavigate } from 'react-router-dom'
import { toast } from "react-toastify";

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {

    const navigate = useNavigate()

    const login = (token, token_type) => {
        localStorage.setItem("auth_token", token);
        localStorage.setItem("auth_token_type", token_type);
        navigate('/home')

    }

    const logout = () => {
        localStorage.clear('auth_token', 'auth_token_type')
        toast.success("You have been logged out")
        navigate("/login")
    }
    const token = localStorage.getItem("auth_token")
    const token_type = localStorage.getItem("auth_token_type")

    return (<AuthContext.Provider value={{ token, token_type, login, logout }}>
        {children}
    </AuthContext.Provider>)
}

export const useAuth = () => {
    return useContext(AuthContext)
}