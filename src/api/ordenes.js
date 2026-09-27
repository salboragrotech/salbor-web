import { apiFetch } from './client';

export const listarOrdenes = () => apiFetch('/ordenes');
export const crearOrden = (datos) => apiFetch('/ordenes', { method: 'POST', body: datos });
export const programarOrden = (id, datos) => apiFetch(`/ordenes/${id}/programar`, { method: 'PATCH', body: datos });
export const cambiarEstadoOrden = (id, estado) => apiFetch(`/ordenes/${id}/estado`, { method: 'PATCH', body: { estado } });
export const obtenerAgenda = (fecha, pilotoId) => {
  const params = new URLSearchParams();
  if (fecha) params.set('fecha', fecha);
  if (pilotoId) params.set('piloto_id', pilotoId);
  const qs = params.toString();
  return apiFetch(`/ordenes/agenda${qs ? `?${qs}` : ''}`);
};
export const fechasOcupadas = () => apiFetch('/ordenes/fechas-ocupadas');
export const misOrdenes = () => apiFetch('/ordenes/mis');
