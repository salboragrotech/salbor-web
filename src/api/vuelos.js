import { apiFetch } from './client';

export const listarVuelos = (ordenId) => apiFetch(`/vuelos${ordenId ? `?orden_id=${ordenId}` : ''}`);
export const crearVuelo = (datos) => apiFetch('/vuelos', { method: 'POST', body: datos });
export const misVuelos = (ordenId) => apiFetch(`/vuelos/mis?orden_id=${ordenId}`);
