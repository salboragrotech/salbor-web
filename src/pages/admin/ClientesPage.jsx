import React, { useEffect, useState } from 'react';
import { listarClientes, crearCliente, crearFinca } from '../../api/clientes';

export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [form, setForm] = useState({ razon_social: '', ruc: '', telefono: '', finca: '', hectareas: '' });
  const [error, setError] = useState('');

  async function cargar() {
    setCargando(true);
    try { setClientes(await listarClientes()); } catch (err) { setError(err.message); }
    setCargando(false);
  }
  useEffect(() => { cargar(); }, []);

  function set(campo, valor) { setForm((f) => ({ ...f, [campo]: valor })); }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!form.razon_social || !form.finca) { setError('Ingresa razón social y finca'); return; }
    try {
      const cliente = await crearCliente({ razon_social: form.razon_social, ruc: form.ruc, telefono: form.telefono });
      await crearFinca({ cliente_id: cliente.id, nombre: form.finca, hectareas_declaradas: form.hectareas ? parseFloat(form.hectareas) : null });
      setForm({ razon_social: '', ruc: '', telefono: '', finca: '', hectareas: '' });
      cargar();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <div className="card">
        <h2>Nuevo cliente y finca</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid">
            <div className="field"><label>Razón social</label><input value={form.razon_social} onChange={(e) => set('razon_social', e.target.value)} placeholder="Hacienda Los Álamos S.A." /></div>
            <div className="field"><label>RUC</label><input value={form.ruc} onChange={(e) => set('ruc', e.target.value)} placeholder="1790012345001" /></div>
            <div className="field"><label>Contacto</label><input value={form.telefono} onChange={(e) => set('telefono', e.target.value)} placeholder="tel. o email" /></div>
            <div className="field"><label>Finca</label><input value={form.finca} onChange={(e) => set('finca', e.target.value)} placeholder="Finca San José" /></div>
            <div className="field"><label>Hectáreas</label><input type="number" value={form.hectareas} onChange={(e) => set('hectareas', e.target.value)} placeholder="12.5" /></div>
          </div>
          <button className="btn" type="submit">Guardar cliente</button>
        </form>
        {error && <div className="error-msg">{error}</div>}
      </div>

      <div className="card">
        <h2>Clientes registrados</h2>
        {cargando ? <div className="cargando">Cargando…</div> : (
          <>
            <table>
              <thead><tr><th>Razón social</th><th>RUC</th><th>Teléfono</th></tr></thead>
              <tbody>
                {clientes.map((c) => (
                  <tr key={c.id}><td>{c.razon_social}</td><td>{c.ruc || '—'}</td><td>{c.telefono || '—'}</td></tr>
                ))}
              </tbody>
            </table>
            {clientes.length === 0 && <div className="empty">Aún no hay clientes registrados.</div>}
          </>
        )}
      </div>
    </>
  );
}
