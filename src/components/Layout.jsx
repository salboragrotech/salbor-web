import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const TABS = {
  admin: [
    ['clientes', 'Clientes'], ['solicitudes', 'Solicitudes'], ['flota', 'Pilotos y drones'],
    ['programacion', 'Programación'], ['ordenes', 'Órdenes'], ['vuelo', 'Registro de vuelo'],
    ['informe', 'Informe'], ['usuarios', 'Usuarios'],
  ],
  piloto: [['mi-agenda', 'Mi agenda'], ['registrar-vuelo', 'Registrar vuelo']],
  cliente: [['solicitar', 'Solicitar fumigación'], ['mis-informes', 'Mis informes']],
};

const ETIQUETAS_ROL = { admin: 'Administrador', piloto: 'Piloto', cliente: 'Cliente' };

export default function Layout() {
  const { usuario, logout } = useAuth();
  const tabs = TABS[usuario.rol] || [];

  return (
    <div>
      <header>
        <div>
          <h1>Salbor Agrotech</h1>
          <p>Control operativo y administrativo de fumigación</p>
        </div>
        <div className="userbox">
          <div className="who">{usuario.nombre}</div>
          <div>{ETIQUETAS_ROL[usuario.rol]}</div>
          <button onClick={logout}>Cerrar sesión</button>
        </div>
      </header>

      <nav className="tabs">
        {tabs.map(([path, label]) => (
          <NavLink key={path} to={`/${usuario.rol}/${path}`} className={({ isActive }) => (isActive ? 'active' : '')}>
            {label}
          </NavLink>
        ))}
      </nav>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
