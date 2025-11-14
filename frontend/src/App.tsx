// Nome do arquivo: ./frontend/src/App.tsx
// Finalidade: Componente principal do app React.
import React from 'react'
import Login from './pages/Login'

const App = () => {
  return (
    <main>
      <Login />
    </main>
  )
}

export default App



import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/common/Layout';
import Home from './pages/Home';
import Clientes from './pages/Clientes';
import Procedimentos from './pages/Procedimentos';
import Agendamentos from './pages/Agendamentos';
import Login from './pages/Login';

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Home />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/procedimentos" element={<Procedimentos />} />
          <Route path="/agendamentos" element={<Agendamentos />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
