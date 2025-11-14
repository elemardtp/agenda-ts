// Nome do arquivo: ./frontend/src/pages/Login.tsx
// Finalidade: Componente de login do frontend.
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { AxiosError } from 'axios' // Import para tipar o erro
import { useAuth } from '../context/AuthContext' // Importa hook de autenticação
import { toast } from 'react-toastify' // Importa toast para notificções
import { useNavigate } from 'react-router-dom' // Importa navigate para redirecionamento

const Login = () => {
  const { login, isAuthenticated } = useAuth() // Obtém função de login do contexto
  const [username, setUsername] = useState('') // Estado para usuário
  const [password, setPassword] = useState('') // Estado para senha
  const navigate = useNavigate() // Hook para redirecionamento

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  // Função assíncrona para login
  const handleLogin = async () => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

    try {
      const response = await axios.post(`${API_URL}/funcionarios/login`, {
        username,
        password
      })

      const { token, role } = response.data
      login(token, role) // Salva token/role no contexto/localStorage
      toast.success('Login realizado com sucesso!')
      navigate('/dashboard') // Redireciona para página principal após sucesso
    } catch (error) {
      const axiosError = error as AxiosError
      console.error('Erro ao fazer login:', axiosError)
      const msg = axiosError.response?.data?.message || 'Verifique suas credenciais.'
      toast.error(`Erro ao fazer login: ${msg}`)
    }
  }

  return (
    <form className="br-form"> {/* Form com classe GovBR */}
      <div className="br-input"> {/* Wrapper para input */}
        <label>Usuário</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Digite o usuário"
        />
      </div>

      <div className="br-input"> {/* Wrapper para input */}
        <label>Senha</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Digite a senha"
        />
      </div>

      <button type="button" className="br-button" onClick={handleLogin}>Entrar</button> // Botão com onClick
    </form>
  )
}

export default Login
