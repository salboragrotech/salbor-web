import { apiFetch } from './client';

export const listarDrones = (todos = false) => apiFetch(`/drones${todos ? '?todos=true' : ''}`);
export const crearDrone = (datos) => apiFetch('/drones', { method: 'POST', body: datos });
export const actualizarDrone = (id, datos) => apiFetch(`/drones/${id}`, { method: 'PUT', body: datos });
export const bajaDrone = (id) => apiFetch(`/drones/${id}/baja`, { method: 'PATCH' });
