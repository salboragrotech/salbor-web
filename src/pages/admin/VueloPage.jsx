import React, { useEffect, useState } from 'react';
import { listarOrdenes } from '../../api/ordenes';
import { listarPilotos } from '../../api/pilotos';
import { listarDrones } from '../../api/drones';
import { listarProductos } from '../../api/productos';
import { listarVuelos, crearVuelo } from '../../api/vuelos';

export default function VueloPage() {
  const [ordenes, setOrdenes] = useState([]);
  const [pilotos, setPilotos] = useState([]);
  const [drones, setDrones] = useState([]);
  const [productos, setProductos] = useState([]);
  const [vuelos, setVuelos] = useState([]);
  const [form, setForm] = useState({ orden_id: '', piloto_id: '', drone_id: '', producto_id: '', dosis_l_ha: '', viento_kmh: '', temperatura_c: '' });
  const [error, setError] = useState('');

  async function cargar() {
    try {
      setOrdenes(await listarOrdenes());
      setPilotos(await listarPilotos());
      setDrones(await listarDrones());
      setProductos(await listarProductos());
      setVuelos(await listarVuelos());
    } catch (err) { setError(err.message); }
  }
  useEffect(() => { cargar(); }, []);

  function set(campo, valor) { setForm((f) => ({ ...f, [campo]: valor })); }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!form.orden_id || !form.piloto_id || !form.drone_id || !form.producto_id || !form.dosis_l_ha) {
      setError('Completa orden, piloto, dron, producto y dosis');
      return;
    }
    try {
      await crearVuelo({
        ...form,
        dosis_l_ha: parseFloat(form.dosis_l_ha),
        viento_kmh: form.viento_kmh ? parseFloat(form.viento_kmh) : null,
        temperatura_c: form.temperatura_c ? parseFloat(form.temperatura_c) : null,
      });
      setForm({ orden_id: '', piloto_id: '', drone_id: '', producto_id: '', dosis_l_ha: '', viento_kmh: '', temperatura_c: '' });
      cargar();
    } catch (err) { setError(err.message); }
  }

  return (
    <>
      <div className="card">
        <h2>Registro operativo de vuelo</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid">
            <div className="field">
              <label>Orden</label>
              <select value={form.orden_id} onChange={(e) => set('orden_id', e.target.value)}>
                <option value="">Selecciona…</option>
                {ordenes.map((o) => <option key={o.orden_id} value={o.orden_id}>#{o.orden_id} — {o.cliente} ({o.finca})</option>)}
              </select>
            </div>
            <div className="field">
              <label>Piloto</label>
              <select value={form.piloto_id} onChange={(e) => set('piloto_id', e.target.value)}>
                <option value="">Selecciona…</option>
                {pilotos.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Dron</label>
              <select value={form.drone_id} onChange={(e) => set('drone_id', e.target.value)}>
                <option value="">Selecciona…</option>
                {drones.map((d) => <option key={d.id} value={d.id}>{d.modelo} ({d.placa})</option>)}
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
            <div className="field"><label>Viento (km/h)</label><input type="number" value={form.viento_kmh} onChange={(e) => set('viento_kmh', e.target.value)} placeholder="8" /></div>
            <div className="field"><label>Temp. (°C)</label><input type="number" value={form.temperatura_c} onChange={(e) => set('temperatura_c', e.target.value)} placeholder="24" /></div>
          </div>
          <button className="btn" type="submit">Registrar vuelo</button>
        </form>
        {error && <div className="error-msg">{error}</div>}
      </div>

      <div className="card">
        <h2>Vuelos registrados</h2>
        <table>
          <thead><tr><th>Producto</th><th>Dosis</th><th>Clima</th><th>Piloto</th></tr></thead>
          <tbody>
            {vuelos.map((v) => (
              <tr key={v.id}>
                <td>{v.producto_nombre}</td><td>{v.dosis_l_ha} l/ha</td>
                <td>{v.viento_kmh || '—'} km/h, {v.temperatura_c || '—'}°C</td><td>{v.piloto_nombre}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {vuelos.length === 0 && <div className="empty">Aún no hay vuelos registrados.</div>}
      </div>
    </>
  );
}
