// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Layout from './components/layout/Layout';

// Vistas Públicas
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ProductPage from './pages/client/ProductPage';
import RegisterPage from './pages/RegisterPage';

// Vistas Protegidas
import DashboardPage from './pages/admin/DashboardPage';
import Dashboard2Page from './pages/admin/Dashboard2_TEMP.jsx';
import UsersPage from './pages/admin/UsersPage';
import RolesPage from './pages/admin/RolesPage';
import PermissionsPage from './pages/admin/PermissionsPage';
import ModulesPage from './pages/admin/ModulesPage';
import MarcaPage from './pages/admin/MarcaPage';
import CategoriaPage from './pages/admin/CategoriaPage';
import InteligencePage from './pages/admin/InteligencePage';
import ReportesPage from './pages/admin/ReportesPage';
import AnalyticsPage from './pages/admin/AnalyticsPage';
import Predicciones2Page from './pages/admin/Predicciones2Page';
import Reportes2Page from "./pages/admin/Reportes2Page";

import './App.css';

/* ----------------------------------------------
   🔒 ProtectedRoute: protege rutas privadas
------------------------------------------------- */
const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Cargando...</div>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

/* ----------------------------------------------
   🚀 App principal
------------------------------------------------- */
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>

          {/* ------------------------------------
             🌐 RUTAS PÚBLICAS
          ------------------------------------ */}
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/catalogo" element={<ProductPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* ------------------------------------
             🔐 RUTAS PRIVADAS (con Layout)
             Todas las rutas hijas usan Sidebar + Layout
          ------------------------------------ */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>

              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/dashboard2" element={<Dashboard2Page />} />
<Route path="/predicciones2" element={<Predicciones2Page />} />

              <Route path="/users" element={<UsersPage />} />
              <Route path="/roles" element={<RolesPage />} />
              <Route path="/permissions" element={<PermissionsPage />} />
              <Route path="/modules" element={<ModulesPage />} />
              <Route path="/brands" element={<MarcaPage />} />
              <Route path="/categories" element={<CategoriaPage />} />

              <Route path="/inteligencia" element={<InteligencePage />} />
              <Route path="/reportes" element={<ReportesPage />} />
              <Route path="/reportes2" element={<Reportes2Page />} />
              <Route path="/analytics" element={<AnalyticsPage />} />

            </Route>
          </Route>

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
