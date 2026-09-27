import React, { useEffect, useState } from 'react';
import { listarUsuarios, crearUsuario } from '../../api/extras';
import { listarClientes } from '../../api/clientes';
import { listarPilotos } from '../../api/pilotos';

const ETIQUETAS = { admin: 'Administrador', piloto: 'Piloto', cliente: 'Cliente' };

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [pilotos, setPilotos] = useState([]);
  const [form, setForm] = useState({ nombre: '', email: '', password: '', rol: 'admin', cliente_id: '', piloto_id: '' });
  const [error, setError] = useState('');

  async function cargar() {
    try {
      setUsuarios(await listarUsuarios());
      setClientes(await listarClientes());
      setPilotos(await listarPilotos());
    } catch (err) { setError(err.message); }
  }
  useEffect(() => { cargar(); }, []);

  function set(campo, valor) { setForm((f) => ({ ...f, [campo]: valor })); }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!form.nombre || !form.email || !form.password) { setError('Completa nombre, correo y contraseña'); return; }
    if (form.rol === 'cliente' && !form.cliente_id) { setError('Selecciona el cliente vinculado'); return; }
    if (form.rol === 'piloto' && !form.piloto_id) { setError('Selecciona el piloto vinculado'); return; }
    try {
      await crearUsuario(form);
      setForm({ nombre: '', email: '', password: '', rol: 'admin', cliente_id: '', piloto_id: '' });
      cargar();
    } catch (err) { setError(err.message); }
  }

  return (
    <>
      <div className="card">
        <h2>Registrar usuario</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid">
            <div className="field"><label>Nombre</label><input value={form.nombre} onChange={(e) => set('nombre', e.target.value)} placeholder="Nombre completo" /></div>
            <div className="field">
              <label>Rol</label>
              <select value={form.rol} onChange={(e) => set('rol', e.target.value)}>
                <option value="admin">Administrador</option>
                <option value="piloto">Piloto</option>
                <option value="cliente">Cliente</option>
              </select>
            </div>
            <div className="field"><label>Correo (usuario)</label><input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="correo@salboragrotech.com" /></div>
            <div className="field"><label>Contraseña</label><input type="password" value={form.password} onChange={(e) => set('password', e.target.value)} /></div>
            {form.rol === 'cliente' && (
              <div className="field">
                <label>Cliente vinculado</label>
                <select value={form.cliente_id} onChange={(e) => set('cliente_id', e.target.value)}>
                  <option value="">Selecciona…</option>
                  {clientes.map((c) => <option key={c.id} value={c.id}>{c.razon_social}</option>)}
                </select>
              </div>
            )}
            {form.rol === 'piloto' && (
              <div className="field">
                <label>Piloto vinculado</label>
                <select value={form.piloto_id} onChange={(e) => set('piloto_id', e.target.value)}>
                  <option value="">Selecciona…</option>
                  {pilotos.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                </select>
              </div>
            )}
          </div>
          <button className="btn" type="submit">Crear usuario</button>
        </form>
        {error && <div className="error-msg">{error}</div>}
      </div>

      <div className="card">
        <h2>Usuarios registrados</h2>
        <table>
          <thead><tr><th>Nombre</th><th>Correo</th><th>Rol</th></tr></thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id}><td>{u.nombre}</td><td>{u.email}</td><td><span className="tag">{ETIQUETAS[u.rol]}</span></td></tr>
            ))}
          </tbody>
        </table>
        {usuarios.length === 0 && <div className="empty">Aún no hay usuarios registrados.</div>}
      </div>
    </>
  );
}
