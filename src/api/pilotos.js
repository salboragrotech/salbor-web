import { apiFetch } from './client';

export const listarPilotos = (todos = false) => apiFetch(`/pilotos${todos ? '?todos=true' : ''}`);
export const crearPiloto = (datos) => apiFetch('/pilotos', { method: 'POST', body: datos });
export const actualizarPiloto = (id, datos) => apiFetch(`/pilotos/${id}`, { method: 'PUT', body: datos });
export const bajaPiloto = (id) => apiFetch(`/pilotos/${id}/baja`, { method: 'PATCH' });
