import React, { createContext, useContext, useEffect, useState } from 'react';
import { setToken } from '../api/client';
import { login as apiLogin, registroCliente as apiRegistroCliente } from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [token, setTokenState] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Restaura la sesión guardada al recargar la página.
  useEffect(() => {
    const guardado = localStorage.getItem('salbor_sesion');
    if (guardado) {
      const { token, usuario } = JSON.parse(guardado);
      setToken(token);
      setTokenState(token);
      setUsuario(usuario);
    }
    setCargando(false);
  }, []);

  function guardarSesion(token, usuario) {
    setToken(token);
    setTokenState(token);
    setUsuario(usuario);
    localStorage.setItem('salbor_sesion', JSON.stringify({ token, usuario }));
  }

  async function login(email, password) {
    const data = await apiLogin(email, password);
    guardarSesion(data.token, data.usuario);
    return data.usuario;
  }

  async function registrarCliente(datos) {
    const data = await apiRegistroCliente(datos);
    guardarSesion(data.token, data.usuario);
    return data.usuario;
  }

  function logout() {
    setToken(null);
    setTokenState(null);
    setUsuario(null);
    localStorage.removeItem('salbor_sesion');
  }

  return (
    <AuthContext.Provider value={{ usuario, token, cargando, login, registrarCliente, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
