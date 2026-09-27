import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegistroClientePage from './pages/RegistroClientePage';

import ClientesPage from './pages/admin/ClientesPage';
import FlotaPage from './pages/admin/FlotaPage';
import SolicitudesPage from './pages/admin/SolicitudesPage';
import ProgramacionPage from './pages/admin/ProgramacionPage';
import OrdenesPage from './pages/admin/OrdenesPage';
import VueloPage from './pages/admin/VueloPage';
import InformePage from './pages/admin/InformePage';
import UsuariosPage from './pages/admin/UsuariosPage';

import MiAgendaPage from './pages/piloto/MiAgendaPage';
import RegistrarVueloPage from './pages/piloto/RegistrarVueloPage';

import SolicitarPage from './pages/cliente/SolicitarPage';
import MisInformesPage from './pages/cliente/MisInformesPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Página pública de inicio: información de la empresa, visible para cualquiera */}
          <Route path="/" element={<LandingPage />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegistroClientePage />} />

          {/* Administrador */}
          <Route path="/admin" element={<ProtectedRoute rol="admin"><Layout /></ProtectedRoute>}>
            <Route index element={<Navigate to="clientes" replace />} />
            <Route path="clientes" element={<ClientesPage />} />
            <Route path="flota" element={<FlotaPage />} />
            <Route path="solicitudes" element={<SolicitudesPage />} />
            <Route path="programacion" element={<ProgramacionPage />} />
            <Route path="ordenes" element={<OrdenesPage />} />
            <Route path="vuelo" element={<VueloPage />} />
            <Route path="informe" element={<InformePage />} />
            <Route path="usuarios" element={<UsuariosPage />} />
          </Route>

          {/* Piloto */}
          <Route path="/piloto" element={<ProtectedRoute rol="piloto"><Layout /></ProtectedRoute>}>
            <Route index element={<Navigate to="mi-agenda" replace />} />
            <Route path="mi-agenda" element={<MiAgendaPage />} />
            <Route path="registrar-vuelo" element={<RegistrarVueloPage />} />
          </Route>

          {/* Cliente */}
          <Route path="/cliente" element={<ProtectedRoute rol="cliente"><Layout /></ProtectedRoute>}>
            <Route index element={<Navigate to="solicitar" replace />} />
            <Route path="solicitar" element={<SolicitarPage />} />
            <Route path="mis-informes" element={<MisInformesPage />} />
          </Route>

          {/* Cualquier otra ruta no reconocida vuelve al inicio */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
