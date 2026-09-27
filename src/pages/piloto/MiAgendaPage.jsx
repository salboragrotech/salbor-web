import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerAgenda } from '../../api/ordenes';

function hoyISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function MiAgendaPage() {
  const [agenda, setAgenda] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    obtenerAgenda(hoyISO()).then(setAgenda).catch((e) => setError(e.message));
  }, []);

  const hoy = hoyISO();
  const manana = (() => { const d = new Date(); d.setDate(d.getDate() + 1); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; })();

  return (
    <div className="card">
      <h2>Mi agenda</h2>
      <p className="desc">Las fumigaciones que te asignó el administrador.</p>
      {error && <div className="error-msg">{error}</div>}
      <table>
        <thead><tr><th>Fecha</th><th>Hora</th><th>Cliente</th><th>Finca</th><th>Dron</th><th>Aviso</th><th></th></tr></thead>
        <tbody>
          {agenda.map((a) => (
            <tr key={a.orden_id}>
              <td>{a.fecha_programada}</td><td>{a.hora_programada || '—'}</td>
              <td>{a.cliente}</td><td>{a.finca}</td><td>{a.drone_asignado || '—'}</td>
              <td>{a.fecha_programada === hoy ? <span className="tag pendiente">Hoy</span> : a.fecha_programada === manana ? <span className="tag">Mañana</span> : '—'}</td>
              <td><button className="btn outline small" onClick={() => navigate('/piloto/registrar-vuelo', { state: { orden: a } })}>Registrar vuelo</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      {agenda.length === 0 && <div className="empty">No tienes fumigaciones programadas todavía.</div>}
    </div>
  );
}
