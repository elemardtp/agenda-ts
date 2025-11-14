// Nome do arquivo: ./frontend/src/pages/Home.tsx
// Finalidade: Página de dashboard com opções de navegação.
import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Bem-vindo ao dashboard da aplicação de agendamento.</p>
      <ul>
        <li><Link to="/clientes">Clientes</Link></li>
        <li><Link to="/procedimentos">Procedimentos</Link></li>
        <li><Link to="/agendamentos">Agendamentos</Link></li>
      </ul>
      <button className="br-button" onClick={handleLogout}>Sair</button>
    </div>
  )
}

export default Home
