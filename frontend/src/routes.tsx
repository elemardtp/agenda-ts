// Nome do arquivo: ./frontend/src/routes.tsx
// Finalidade: Configuração de rotas React.
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React, { lazy, Suspense } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './components/common/Layout';
import ErrorBoundary from './components/common/ErrorBoundary';
import { useAuth } from './context/AuthContext';


// Importações dinâmicas
const Home = lazy(() => import('./pages/Home'));
const Clientes = lazy(() => import('./pages/Clientes'));
const ClientsMaintenance = lazy(() => import('./components/common/ClientsMaintenance'));
const Procedimentos = lazy(() => import('./pages/Procedimentos'));
const Agendamentos = lazy(() => import('./pages/Agendamentos'));
const Login = lazy(() => import('./pages/Login'));


// Componente para rotas protegidas
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div>Carregando...</div>;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};


// Rotas da aplicação
const AppRoutes = () => {
  return (
    <Router>
      <ErrorBoundary>
        <Suspense fallback={<div>Carregando...</div>}>
          <Layout>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<ProtectedRoute><Home /></ProtectedRoute>} />
              <Route path="/clientes" element={<ProtectedRoute><Clientes /></ProtectedRoute>} />
              <Route path="/clientes/manutencao" element={<ProtectedRoute><ClientsMaintenance /></ProtectedRoute>} />
              <Route path="/procedimentos" element={<ProtectedRoute><Procedimentos /></ProtectedRoute>} />
              <Route path="/agendamentos" element={<ProtectedRoute><Agendamentos /></ProtectedRoute>} />
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="*" element={<div>Página não encontrada.</div>} />
            </Routes>
          </Layout>
          <ToastContainer position="top-right" autoClose={3000} />
        </Suspense>
      </ErrorBoundary>
    </Router>
  );
};

export default AppRoutes;
