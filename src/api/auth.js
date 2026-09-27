import { apiFetch } from './client';

export const login = (email, password) =>
  apiFetch('/auth/login', { method: 'POST', body: { email, password } });

export const registroCliente = (datos) =>
  apiFetch('/auth/registro-cliente', { method: 'POST', body: datos });
