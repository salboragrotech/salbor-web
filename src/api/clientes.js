import { apiFetch } from './client';

export const listarClientes = () => apiFetch('/clientes');
export const crearCliente = (datos) => apiFetch('/clientes', { method: 'POST', body: datos });

export const listarFincas = () => apiFetch('/fincas');
export const misFincas = () => apiFetch('/fincas/mias');
export const crearFinca = (datos) => apiFetch('/fincas', { method: 'POST', body: datos });
