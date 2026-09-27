// Cambia esto por la URL real de tu API cuando la despliegues (ej. https://salbor-api.onrender.com/api)
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

let tokenActual = null;

export function setToken(token) {
  tokenActual = token;
}

export async function apiFetch(path, { method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (tokenActual) headers.Authorization = `Bearer ${tokenActual}`;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Error ${res.status}`);
  }
  return data;
}
