import { apiFetch } from './client';

export const crearSolicitud = (datos) => apiFetch('/solicitudes', { method: 'POST', body: datos });
export const listarSolicitudes = (estado) => apiFetch(`/solicitudes${estado ? `?estado=${estado}` : ''}`);
export const misSolicitudes = () => apiFetch('/solicitudes/mias');
export const aprobarSolicitud = (id, datos) => apiFetch(`/solicitudes/${id}/aprobar`, { method: 'PATCH', body: datos });

export const listarNotificaciones = () => apiFetch('/notificaciones');

export const listarUsuarios = () => apiFetch('/usuarios');
export const crearUsuario = (datos) => apiFetch('/usuarios', { method: 'POST', body: datos });

export const listarFacturas = () => apiFetch('/facturas');
export const crearFactura = (datos) => apiFetch('/facturas', { method: 'POST', body: datos });
export const registrarPagoFactura = (id) => apiFetch(`/facturas/${id}/pago`, { method: 'PATCH' });
