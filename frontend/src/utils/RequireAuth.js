import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from './auth'


export const RequireAuth = ({ children }) => {
    const auth = useAuth()

    if (auth.token === null) {
        return <Navigate to="/login" />
    } else {

        return (
            // Wrap composition model children props in divs or fragments
            <>
                {children}

            </>
        )
    }


}
