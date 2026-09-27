import React, { useEffect, useState } from 'react';
import { listarOrdenes } from '../../api/ordenes';
import { listarVuelos } from '../../api/vuelos';
import ReporteVuelos from '../../components/ReporteVuelos';

export default function InformePage() {
  const [ordenes, setOrdenes] = useState([]);
  const [ordenId, setOrdenId] = useState('');
  const [orden, setOrden] = useState(null);
  const [vuelos, setVuelos] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => { listarOrdenes().then(setOrdenes).catch((e) => setError(e.message)); }, []);

  async function seleccionar(id) {
    setOrdenId(id);
    if (!id) { setOrden(null); setVuelos([]); return; }
    try {
      setOrden(ordenes.find((o) => String(o.orden_id) === String(id)));
      setVuelos(await listarVuelos(id));
    } catch (err) { setError(err.message); }
  }

  return (
    <>
      <div className="card">
        <h2>Generar informe para el cliente</h2>
        <label>Seleccionar orden</label>
        <select value={ordenId} onChange={(e) => seleccionar(e.target.value)}>
          <option value="">Selecciona…</option>
          {ordenes.map((o) => <option key={o.orden_id} value={o.orden_id}>#{o.orden_id} — {o.cliente} ({o.finca})</option>)}
        </select>
        {error && <div className="error-msg">{error}</div>}
      </div>
      {orden && <ReporteVuelos orden={orden} vuelos={vuelos} />}
    </>
  );
}
