import React, { useEffect, useState } from 'react';
import { listarClientes, listarFincas } from '../../api/clientes';
import { listarPilotos } from '../../api/pilotos';
import { listarDrones } from '../../api/drones';
import { crearOrden, obtenerAgenda } from '../../api/ordenes';

export default function ProgramacionPage() {
  const [clientes, setClientes] = useState([]);
  const [fincas, setFincas] = useState([]);
  const [pilotos, setPilotos] = useState([]);
  const [drones, setDrones] = useState([]);
  const [agenda, setAgenda] = useState([]);
  const [filtroPiloto, setFiltroPiloto] = useState('');
  const [form, setForm] = useState({ cliente_id: '', finca_id: '', piloto_asignado_id: '', drone_asignado_id: '', fecha_programada: '', hora_programada: '' });
  const [error, setError] = useState('');

  async function cargarCatalogos() {
    try {
      setClientes(await listarClientes());
      setFincas(await listarFincas());
      setPilotos(await listarPilotos());
      setDrones(await listarDrones());
    } catch (err) { setError(err.message); }
  }

  async function cargarAgenda(pilotoId) {
    if (!pilotoId) { setAgenda([]); return; }
    try { setAgenda(await obtenerAgenda(null, pilotoId)); } catch (err) { setError(err.message); }
  }

  useEffect(() => { cargarCatalogos(); }, []);
  useEffect(() => { cargarAgenda(filtroPiloto); }, [filtroPiloto]);

  const fincasDelCliente = fincas.filter((f) => String(f.cliente_id) === String(form.cliente_id));

  function set(campo, valor) { setForm((f) => ({ ...f, [campo]: valor })); }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!form.cliente_id || !form.finca_id || !form.piloto_asignado_id || !form.fecha_programada) {
      setError('Completa cliente, finca, piloto y fecha');
      return;
    }
    try {
      await crearOrden(form);
      setForm({ cliente_id: '', finca_id: '', piloto_asignado_id: '', drone_asignado_id: '', fecha_programada: '', hora_programada: '' });
      if (form.piloto_asignado_id === filtroPiloto) cargarAgenda(filtroPiloto);
    } catch (err) { setError(err.message); }
  }

  return (
    <>
      <div className="card">
        <h2>Programar fumigación</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid">
            <div className="field">
              <label>Cliente</label>
              <select value={form.cliente_id} onChange={(e) => { set('cliente_id', e.target.value); set('finca_id', ''); }}>
                <option value="">Selecciona…</option>
                {clientes.map((c) => <option key={c.id} value={c.id}>{c.razon_social}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Finca</label>
              <select value={form.finca_id} onChange={(e) => set('finca_id', e.target.value)} disabled={!form.cliente_id}>
                <option value="">Selecciona…</option>
                {fincasDelCliente.map((f) => <option key={f.id} value={f.id}>{f.nombre}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Piloto asignado</label>
              <select value={form.piloto_asignado_id} onChange={(e) => set('piloto_asignado_id', e.target.value)}>
                <option value="">Selecciona…</option>
                {pilotos.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Dron asignado</label>
              <select value={form.drone_asignado_id} onChange={(e) => set('drone_asignado_id', e.target.value)}>
                <option value="">Selecciona…</option>
                {drones.map((d) => <option key={d.id} value={d.id}>{d.modelo} ({d.placa})</option>)}
              </select>
            </div>
            <div className="field"><label>Fecha</label><input type="date" value={form.fecha_programada} onChange={(e) => set('fecha_programada', e.target.value)} /></div>
            <div className="field"><label>Hora</label><input type="time" value={form.hora_programada} onChange={(e) => set('hora_programada', e.target.value)} /></div>
          </div>
          <button className="btn" type="submit">Programar</button>
        </form>
        {error && <div className="error-msg">{error}</div>}
      </div>

      <div className="card">
        <h2>Agenda por piloto</h2>
        <label>Ver agenda de</label>
        <select value={filtroPiloto} onChange={(e) => setFiltroPiloto(e.target.value)}>
          <option value="">Selecciona un piloto…</option>
          {pilotos.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
        </select>
        <table style={{ marginTop: '.7rem' }}>
          <thead><tr><th>Fecha</th><th>Hora</th><th>Cliente</th><th>Finca</th><th>Dron</th></tr></thead>
          <tbody>
            {agenda.map((a) => (
              <tr key={a.orden_id}>
                <td>{a.fecha_programada}</td><td>{a.hora_programada || '—'}</td>
                <td>{a.cliente}</td><td>{a.finca}</td><td>{a.drone_asignado || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {agenda.length === 0 && <div className="empty">Selecciona un piloto para ver su agenda.</div>}
      </div>
    </>
  );
}
