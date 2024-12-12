'use client'

import { AuthContextProvider } from "@/context/authContext"

// import { AuthContextProvider } from "../context/authContext"

const AuthWrapper = ({children}) => {
  return (
    <AuthContextProvider>
        {children}
    </AuthContextProvider>
  )
}

export default AuthWrapper
