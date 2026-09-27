import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { obtenerAgenda } from '../../api/ordenes';
import { listarProductos } from '../../api/productos';
import { crearVuelo } from '../../api/vuelos';

function hoyISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function RegistrarVueloPage() {
  const location = useLocation();
  const [agendaHoy, setAgendaHoy] = useState([]);
  const [productos, setProductos] = useState([]);
  const [ordenId, setOrdenId] = useState(location.state?.orden?.orden_id || '');
  const [droneId, setDroneId] = useState(location.state?.orden?.drone_id || '');
  const [form, setForm] = useState({ producto_id: '', dosis_l_ha: '', area_cubierta_ha: '', viento_kmh: '', temperatura_c: '', observaciones: '' });
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  useEffect(() => {
    obtenerAgenda(hoyISO()).then(setAgendaHoy).catch((e) => setError(e.message));
    listarProductos().then(setProductos).catch((e) => setError(e.message));
  }, []);

  function set(campo, valor) { setForm((f) => ({ ...f, [campo]: valor })); }

  function seleccionarOrden(id) {
    setOrdenId(id);
    const orden = agendaHoy.find((a) => String(a.orden_id) === String(id));
    setDroneId(orden ? orden.drone_id : '');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); setExito('');
    if (!ordenId || !droneId || !form.producto_id || !form.dosis_l_ha) {
      setError('Elige la orden y completa producto y dosis. Si la orden no tiene dron asignado, avisa al administrador.');
      return;
    }
    try {
      await crearVuelo({
        orden_id: ordenId,
        drone_id: droneId,
        producto_id: form.producto_id,
        dosis_l_ha: parseFloat(form.dosis_l_ha),
        area_cubierta_ha: form.area_cubierta_ha ? parseFloat(form.area_cubierta_ha) : null,
        viento_kmh: form.viento_kmh ? parseFloat(form.viento_kmh) : null,
        temperatura_c: form.temperatura_c ? parseFloat(form.temperatura_c) : null,
        observaciones: form.observaciones || null,
      });
      setExito('Vuelo registrado correctamente.');
      setForm({ producto_id: '', dosis_l_ha: '', area_cubierta_ha: '', viento_kmh: '', temperatura_c: '', observaciones: '' });
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="card">
      <h2>Registrar vuelo</h2>
      {agendaHoy.length === 0 && (
        <p className="desc" style={{ color: 'var(--tierra)' }}>
          No tienes fumigaciones asignadas para hoy. Consulta "Mi agenda" o contacta al administrador.
        </p>
      )}
      <form onSubmit={handleSubmit}>
        <div className="grid">
          <div className="field">
            <label>Cliente / finca (de hoy)</label>
            <select value={ordenId} onChange={(e) => seleccionarOrden(e.target.value)} disabled={agendaHoy.length === 0}>
              <option value="">Selecciona…</option>
              {agendaHoy.map((a) => <option key={a.orden_id} value={a.orden_id}>{a.cliente} — {a.finca}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Producto aplicado</label>
            <select value={form.producto_id} onChange={(e) => set('producto_id', e.target.value)}>
              <option value="">Selecciona…</option>
              {productos.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
            </select>
          </div>
          <div className="field"><label>Dosis (l/ha)</label><input type="number" value={form.dosis_l_ha} onChange={(e) => set('dosis_l_ha', e.target.value)} placeholder="2.5" /></div>
          <div className="field"><label>Área cubierta (ha)</label><input type="number" value={form.area_cubierta_ha} onChange={(e) => set('area_cubierta_ha', e.target.value)} placeholder="12.5" /></div>
          <div className="field"><label>Viento (km/h)</label><input type="number" value={form.viento_kmh} onChange={(e) => set('viento_kmh', e.target.value)} placeholder="8" /></div>
          <div className="field"><label>Temp. (°C)</label><input type="number" value={form.temperatura_c} onChange={(e) => set('temperatura_c', e.target.value)} placeholder="24" /></div>
        </div>
        <div className="field"><label>Observaciones</label><textarea value={form.observaciones} onChange={(e) => set('observaciones', e.target.value)} placeholder="Incidencias, obstáculos, notas..." /></div>
        <button className="btn" type="submit" disabled={agendaHoy.length === 0}>Registrar vuelo</button>
      </form>
      {error && <div className="error-msg">{error}</div>}
      {exito && <div className="desc" style={{ color: 'var(--verde-cultivo)' }}>{exito}</div>}
    </div>
  );
}
