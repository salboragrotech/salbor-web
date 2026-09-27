import { apiFetch } from './client';

export const listarProductos = () => apiFetch('/productos');
export const crearProducto = (datos) => apiFetch('/productos', { method: 'POST', body: datos });
