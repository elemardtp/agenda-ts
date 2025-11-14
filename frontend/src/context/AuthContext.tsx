// Nome do arquivo: ./frontend/src/context/AuthContext.tsx
// Finalidade: Contexto de autenticação do frontend.
import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null)
  const [role, setRole] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const isAuthenticated = !!token

  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    const savedRole = localStorage.getItem('role')
    if (savedToken) setToken(savedToken)
    if (savedRole) setRole(savedRole)
    setIsLoading(false)
  }, [])

  const login = (newToken, newRole) => {
    setToken(newToken)
    setRole(newRole)
    localStorage.setItem('token', newToken)
    localStorage.setItem('role', newRole)
  }

  const logout = () => {
    setToken(null)
    setRole(null)
    localStorage.removeItem('token')
    localStorage.removeItem('role')
  }

  return (
    <AuthContext.Provider value={{ token, role, login, logout, isAuthenticated, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
