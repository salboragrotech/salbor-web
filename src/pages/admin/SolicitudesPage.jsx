import React, { useEffect, useState } from 'react';
import { listarSolicitudes, aprobarSolicitud } from '../../api/extras';
import { listarPilotos } from '../../api/pilotos';
import { listarDrones } from '../../api/drones';

const ETIQUETAS = { pendiente: 'Pendiente', aprobada: 'Confirmada', reprogramada: 'Reprogramada', rechazada: 'Rechazada' };

export default function SolicitudesPage() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [pilotos, setPilotos] = useState([]);
  const [drones, setDrones] = useState([]);
  const [form, setForm] = useState({});
  const [error, setError] = useState('');

  async function cargar() {
    try {
      setSolicitudes(await listarSolicitudes());
      setPilotos(await listarPilotos());
      setDrones(await listarDrones());
    } catch (err) { setError(err.message); }
  }
  useEffect(() => { cargar(); }, []);

  function setCampo(id, campo, valor) {
    setForm((f) => ({ ...f, [id]: { ...f[id], [campo]: valor } }));
  }

  async function handleAprobar(s) {
    const datos = form[s.id] || {};
    if (!datos.fecha_programada || !datos.piloto_asignado_id) {
      setError('Elige al menos la fecha y el piloto');
      return;
    }
    try {
      await aprobarSolicitud(s.id, {
        fecha_programada: datos.fecha_programada,
        hora_programada: datos.hora_programada,
        piloto_asignado_id: datos.piloto_asignado_id,
        drone_asignado_id: datos.drone_asignado_id,
        precio_por_ha: datos.precio_por_ha ? parseFloat(datos.precio_por_ha) : null,
      });
      cargar();
    } catch (err) { setError(err.message); }
  }

  const pendientes = solicitudes.filter((s) => s.estado === 'pendiente');

  return (
    <>
      {error && <div className="error-msg" style={{ marginBottom: '1rem' }}>{error}</div>}

      <div className="card">
        <h2>Solicitudes pendientes</h2>
        <p className="desc">Revisa, asigna piloto/dron y aprueba. Si cambias la fecha respecto a la solicitada, el cliente ve que fue "reprogramada" en vez de "confirmada".</p>
        {pendientes.map((s) => {
          const datos = form[s.id] || {};
          return (
            <div className="solicitud-card" key={s.id}>
              <div className="top"><strong>{s.cliente}</strong><span>{s.finca}</span></div>
              {s.notas && <div className="notas">"{s.notas}"</div>}
              <div className="grid">
                <div className="field">
                  <label>Fecha (solicitó {String(s.fecha_solicitada).slice(0, 10)})</label>
                  <input type="date" defaultValue={String(s.fecha_solicitada).slice(0, 10)} onChange={(e) => setCampo(s.id, 'fecha_programada', e.target.value)} />
                </div>
                <div className="field"><label>Hora</label><input type="time" onChange={(e) => setCampo(s.id, 'hora_programada', e.target.value)} /></div>
                <div className="field">
                  <label>Piloto</label>
                  <select onChange={(e) => setCampo(s.id, 'piloto_asignado_id', e.target.value)} defaultValue="">
                    <option value="" disabled>Selecciona…</option>
                    {pilotos.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label>Dron</label>
                  <select onChange={(e) => setCampo(s.id, 'drone_asignado_id', e.target.value)} defaultValue="">
                    <option value="" disabled>Selecciona…</option>
                    {drones.map((d) => <option key={d.id} value={d.id}>{d.modelo} ({d.placa})</option>)}
                  </select>
                </div>
                <div className="field"><label>Precio por ha (opcional)</label><input type="number" onChange={(e) => setCampo(s.id, 'precio_por_ha', e.target.value)} placeholder="25.00" /></div>
              </div>
              <button className="btn" onClick={() => handleAprobar(s)}>Aprobar y notificar al cliente</button>
            </div>
          );
        })}
        {pendientes.length === 0 && <div className="empty">No hay solicitudes pendientes.</div>}
      </div>

      <div className="card">
        <h2>Historial de solicitudes</h2>
        <table>
          <thead><tr><th>Cliente</th><th>Finca</th><th>Fecha deseada</th><th>Estado</th></tr></thead>
          <tbody>
            {solicitudes.map((s) => (
              <tr key={s.id}>
                <td>{s.cliente}</td><td>{s.finca}</td><td>{String(s.fecha_solicitada).slice(0, 10)}</td>
                <td><span className={`tag ${s.estado === 'pendiente' ? 'pendiente' : ''}`}>{ETIQUETAS[s.estado] || s.estado}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        {solicitudes.length === 0 && <div className="empty">No hay solicitudes todavía.</div>}
      </div>
    </>
  );
}
