// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Layout from './components/layout/Layout';

// Vistas Públicas
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage'; 
import ProductPage from './pages/client/ProductPage';
import RegisterPage from './pages/RegisterPage';

// Vistas Protegidas (Admin)
import DashboardPage from './pages/admin/DashboardPage';
import UsersPage from './pages/admin/UsersPage';
import RolesPage from './pages/admin/RolesPage';
import PermissionsPage from './pages/admin/PermissionsPage';
import ModulesPage from './pages/admin/ModulesPage';
import MarcaPage from './pages/admin/MarcaPage';
import CategoriaPage from './pages/admin/CategoriaPage';

import './App.css';
import InteligencePage from './pages/admin/InteligencePage';
import ReportesPage from './pages/admin/ReportesPage';
import AnalyticsPage from './pages/admin/AnalyticsPage';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Cargando...</div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} /> {/* Redirección de raíz */}
          {/* --- RUTAS PÚBLICAS --- */}
          {/* 2. La ruta raíz (/) ahora es la página de inicio pública */}
          <Route path="/home" element={<HomePage />} /> 
          <Route path="/login" element={<LoginPage />} />
          <Route path="/catalogo" element={<ProductPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* --- RUTAS PROTEGIDAS (ADMIN DASHBOARD) --- */}
          {/* 3. El dashboard ahora vive solo en /dashboard */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout>
                <DashboardPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/users" element={
            <ProtectedRoute>
              <Layout>
                <UsersPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/roles" element={
            <ProtectedRoute>
              <Layout>
                <RolesPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/permissions" element={
            <ProtectedRoute>
              <Layout>
                <PermissionsPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/modules" element={
            <ProtectedRoute>
              <Layout>
                <ModulesPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/brands" element={
            <ProtectedRoute>
              <Layout>
                <MarcaPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/categories" element={
            <ProtectedRoute>
              <Layout>
                <CategoriaPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/inteligencia" element={
            <ProtectedRoute>
              <Layout>
                <InteligencePage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/reportes" element={
            <ProtectedRoute>
              <Layout>
                <ReportesPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/analytics" element={
            <ProtectedRoute>
              <Layout>
                <AnalyticsPage />
              </Layout>
            </ProtectedRoute>
          } />
          {/* NOTA: Puedes añadir aquí las nuevas rutas del admin (marcas, categorias, etc.) */}
          {/* Ejemplo:
          <Route path="/productos" element={
            <ProtectedRoute>
              <Layout>
                <ProductosPage />
              </Layout>
            </ProtectedRoute>
          } />
          */}

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
