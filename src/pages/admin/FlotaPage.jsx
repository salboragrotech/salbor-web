import React, { useEffect, useState } from 'react';
import { listarPilotos, crearPiloto, actualizarPiloto, bajaPiloto } from '../../api/pilotos';
import { listarDrones, crearDrone, actualizarDrone, bajaDrone } from '../../api/drones';

export default function FlotaPage() {
  const [pilotos, setPilotos] = useState([]);
  const [drones, setDrones] = useState([]);
  const [formPiloto, setFormPiloto] = useState({ nombre: '', licencia: '', telefono: '' });
  const [formDrone, setFormDrone] = useState({ modelo: '', placa: '' });
  const [error, setError] = useState('');

  async function cargar() {
    try {
      setPilotos(await listarPilotos(true));
      setDrones(await listarDrones(true));
    } catch (err) { setError(err.message); }
  }
  useEffect(() => { cargar(); }, []);

  async function handleAddPiloto(e) {
    e.preventDefault();
    if (!formPiloto.nombre) { setError('Ingresa el nombre del piloto'); return; }
    try {
      await crearPiloto(formPiloto);
      setFormPiloto({ nombre: '', licencia: '', telefono: '' });
      cargar();
    } catch (err) { setError(err.message); }
  }

  async function handleEditarPiloto(p) {
    const nombre = prompt('Nombre del piloto', p.nombre);
    if (nombre === null) return;
    const licencia = prompt('Licencia', p.licencia || '');
    if (licencia === null) return;
    const telefono = prompt('Teléfono', p.telefono || '');
    if (telefono === null) return;
    try { await actualizarPiloto(p.id, { nombre, licencia, telefono }); cargar(); }
    catch (err) { setError(err.message); }
  }

  async function handleBajaPiloto(p) {
    if (!confirm(`¿Dar de baja a ${p.nombre}?`)) return;
    try { await bajaPiloto(p.id); cargar(); } catch (err) { setError(err.message); }
  }

  async function handleAddDrone(e) {
    e.preventDefault();
    if (!formDrone.modelo || !formDrone.placa) { setError('Ingresa modelo y placa'); return; }
    try {
      await crearDrone(formDrone);
      setFormDrone({ modelo: '', placa: '' });
      cargar();
    } catch (err) { setError(err.message); }
  }

  async function handleEditarDrone(d) {
    const modelo = prompt('Modelo del dron', d.modelo);
    if (modelo === null) return;
    const placa = prompt('Placa asignada', d.placa);
    if (placa === null) return;
    try { await actualizarDrone(d.id, { modelo, placa }); cargar(); }
    catch (err) { setError(err.message); }
  }

  async function handleEstadoDrone(d, estado) {
    if (estado === 'baja' && !confirm(`¿Dar de baja el dron ${d.placa}?`)) return;
    try {
      if (estado === 'baja') await bajaDrone(d.id);
      else await actualizarDrone(d.id, { estado });
      cargar();
    } catch (err) { setError(err.message); }
  }

  return (
    <>
      {error && <div className="error-msg" style={{ marginBottom: '1rem' }}>{error}</div>}

      <div className="card">
        <h2>Pilotos</h2>
        <form onSubmit={handleAddPiloto}>
          <div className="grid">
            <div className="field"><label>Nombre</label><input value={formPiloto.nombre} onChange={(e) => setFormPiloto({ ...formPiloto, nombre: e.target.value })} placeholder="Juan Pérez" /></div>
            <div className="field"><label>Licencia</label><input value={formPiloto.licencia} onChange={(e) => setFormPiloto({ ...formPiloto, licencia: e.target.value })} placeholder="Nº de licencia" /></div>
            <div className="field"><label>Teléfono</label><input value={formPiloto.telefono} onChange={(e) => setFormPiloto({ ...formPiloto, telefono: e.target.value })} placeholder="09..." /></div>
          </div>
          <button className="btn" type="submit">Agregar piloto</button>
        </form>
        <table style={{ marginTop: '.9rem' }}>
          <thead><tr><th>Nombre</th><th>Licencia</th><th>Teléfono</th><th>Estado</th><th></th></tr></thead>
          <tbody>
            {pilotos.map((p) => (
              <tr key={p.id}>
                <td>{p.nombre}</td><td>{p.licencia || '—'}</td><td>{p.telefono || '—'}</td>
                <td><span className={`tag ${p.activo ? '' : 'pendiente'}`}>{p.activo ? 'Activo' : 'De baja'}</span></td>
                <td className="row">
                  <button className="btn outline small" onClick={() => handleEditarPiloto(p)}>Editar</button>
                  {p.activo
                    ? <button className="btn outline small" onClick={() => handleBajaPiloto(p)}>Dar de baja</button>
                    : <button className="btn outline small" onClick={() => actualizarPiloto(p.id, {}).then(cargar)}>Reactivar</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {pilotos.length === 0 && <div className="empty">Aún no hay pilotos registrados.</div>}
      </div>

      <div className="card">
        <h2>Drones</h2>
        <form onSubmit={handleAddDrone}>
          <div className="grid">
            <div className="field"><label>Modelo</label><input value={formDrone.modelo} onChange={(e) => setFormDrone({ ...formDrone, modelo: e.target.value })} placeholder="DJI Agras T30" /></div>
            <div className="field"><label>Placa asignada</label><input value={formDrone.placa} onChange={(e) => setFormDrone({ ...formDrone, placa: e.target.value })} placeholder="ABC-1234" /></div>
          </div>
          <button className="btn" type="submit">Agregar dron</button>
        </form>
        <table style={{ marginTop: '.9rem' }}>
          <thead><tr><th>Modelo</th><th>Placa</th><th>Estado</th><th></th></tr></thead>
          <tbody>
            {drones.map((d) => (
              <tr key={d.id}>
                <td>{d.modelo}</td><td>{d.placa}</td>
                <td><span className={`tag ${d.estado === 'operativo' ? '' : 'pendiente'}`}>{d.estado}</span></td>
                <td className="row">
                  <button className="btn outline small" onClick={() => handleEditarDrone(d)}>Editar</button>
                  {d.estado !== 'mantenimiento' && <button className="btn outline small" onClick={() => handleEstadoDrone(d, 'mantenimiento')}>Mantenimiento</button>}
                  {d.estado !== 'operativo' && <button className="btn outline small" onClick={() => handleEstadoDrone(d, 'operativo')}>Reactivar</button>}
                  {d.estado !== 'baja' && <button className="btn outline small" onClick={() => handleEstadoDrone(d, 'baja')}>Dar de baja</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {drones.length === 0 && <div className="empty">Aún no hay drones registrados.</div>}
      </div>
    </>
  );
}
