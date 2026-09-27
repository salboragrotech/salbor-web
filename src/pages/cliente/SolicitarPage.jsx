import React, { useEffect, useState } from 'react';
import { fechasOcupadas } from '../../api/ordenes';
import { crearSolicitud, listarNotificaciones, misSolicitudes as apiMisSolicitudes } from '../../api/extras';
import { misFincas } from '../../api/clientes';
import CalendarioDisponibilidad from '../../components/CalendarioDisponibilidad';

const ETIQUETAS = { pendiente: 'Pendiente', aprobada: 'Confirmada', reprogramada: 'Reprogramada', rechazada: 'Rechazada' };

export default function SolicitarPage() {
  const [fincas, setFincas] = useState([]);
  const [fincaId, setFincaId] = useState('');
  const [ocupadas, setOcupadas] = useState([]);
  const [fechaElegida, setFechaElegida] = useState(null);
  const [notas, setNotas] = useState('');
  const [notificaciones, setNotificaciones] = useState([]);
  const [misSolicitudes, setMisSolicitudes] = useState([]);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  async function cargar() {
    try {
      const mis = await misFincas();
      setFincas(mis);
      if (mis.length === 1) setFincaId(mis[0].id);
      setOcupadas(await fechasOcupadas());
      setNotificaciones(await listarNotificaciones());
      setMisSolicitudes(await apiMisSolicitudes());
    } catch (err) {
      setError(err.message);
    }
  }
  useEffect(() => { cargar(); }, []);

  async function handleEnviar() {
    setError(''); setExito('');
    if (!fincaId) { setError('Selecciona la finca'); return; }
    if (!fechaElegida) { setError('Elige un día disponible en el calendario'); return; }
    try {
      await crearSolicitud({ finca_id: fincaId, fecha_solicitada: fechaElegida, notas });
      setExito('Solicitud enviada. Te avisaremos cuando el administrador la confirme.');
      setNotas(''); setFechaElegida(null);
      cargar();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      {notificaciones.length > 0 && (
        <div className="card">
          <h2>Notificaciones</h2>
          {notificaciones.map((n) => (
            <div className={`notif ${n.tipo === 'reprogramada' ? 'reprogramada' : ''}`} key={n.id}>
              {n.mensaje}
              <div className="fecha">{new Date(n.creado_en).toLocaleString('es-EC', { dateStyle: 'medium', timeStyle: 'short' })}</div>
            </div>
          ))}
        </div>
      )}

      <div className="card">
        <h2>Solicitar fumigación</h2>
        <div className="field">
          <label>Finca</label>
          <select value={fincaId} onChange={(e) => setFincaId(e.target.value)}>
            <option value="">Selecciona…</option>
            {fincas.map((f) => <option key={f.id} value={f.id}>{f.nombre}</option>)}
          </select>
        </div>
        <label>Elige un día disponible</label>
        <div className="card" style={{ background: '#FBFAF6', marginTop: '.4rem', marginBottom: '1rem' }}>
          <CalendarioDisponibilidad fechasOcupadas={ocupadas} fechaSeleccionada={fechaElegida} onSeleccionar={setFechaElegida} />
        </div>
        <div className="field"><label>Notas para el piloto</label><textarea value={notas} onChange={(e) => setNotas(e.target.value)} placeholder="Ej. cultivo de maíz, acceso por el portón norte..." /></div>
        <button className="btn" onClick={handleEnviar}>Enviar solicitud</button>
        {error && <div className="error-msg">{error}</div>}
        {exito && <div className="desc" style={{ color: 'var(--verde-cultivo)' }}>{exito}</div>}
      </div>

      <div className="card">
        <h2>Mis solicitudes</h2>
        <table>
          <thead><tr><th>Finca</th><th>Fecha deseada</th><th>Estado</th></tr></thead>
          <tbody>
            {misSolicitudes.map((s) => (
              <tr key={s.id}>
                <td>{s.finca}</td><td>{String(s.fecha_solicitada).slice(0, 10)}</td>
                <td><span className={`tag ${s.estado === 'pendiente' ? 'pendiente' : ''}`}>{ETIQUETAS[s.estado] || s.estado}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        {misSolicitudes.length === 0 && <div className="empty">Aún no has enviado solicitudes.</div>}
      </div>
    </>
  );
}
