import React, { useEffect, useState } from 'react';
import { listarOrdenes } from '../../api/ordenes';
import { crearFactura } from '../../api/extras';

export default function OrdenesPage() {
  const [ordenes, setOrdenes] = useState([]);
  const [precios, setPrecios] = useState({});
  const [error, setError] = useState('');

  async function cargar() {
    try { setOrdenes(await listarOrdenes()); } catch (err) { setError(err.message); }
  }
  useEffect(() => { cargar(); }, []);

  async function handleFacturar(orden) {
    const precio = parseFloat(precios[orden.orden_id]);
    if (!precio || precio <= 0) { setError('Ingresa un precio por hectárea válido'); return; }
    try {
      await crearFactura({ orden_id: orden.orden_id, precio_por_ha: precio });
      cargar();
    } catch (err) { setError(err.message); }
  }

  return (
    <div className="card">
      <h2>Órdenes de trabajo</h2>
      <p className="desc">Cada orden con al menos un vuelo registrado se puede facturar por hectárea.</p>
      {error && <div className="error-msg">{error}</div>}
      <table>
        <thead><tr><th>Cliente</th><th>Finca</th><th>Ha cubiertas</th><th>Vuelos</th><th>Precio/ha</th><th></th><th>Estado</th></tr></thead>
        <tbody>
          {ordenes.map((o) => (
            <tr key={o.orden_id}>
              <td>{o.cliente}</td><td>{o.finca}</td>
              <td>{o.ha_cubiertas || 0}</td><td>{o.total_vuelos}</td>
              <td>
                {o.estado === 'facturada'
                  ? '—'
                  : <input type="number" style={{ width: 80 }} placeholder="25.00"
                      onChange={(e) => setPrecios((p) => ({ ...p, [o.orden_id]: e.target.value }))} />}
              </td>
              <td>{o.estado !== 'facturada' && <button className="btn outline small" onClick={() => handleFacturar(o)}>Facturar</button>}</td>
              <td><span className="tag">{o.estado}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
      {ordenes.length === 0 && <div className="empty">Aún no hay órdenes.</div>}
    </div>
  );
}
