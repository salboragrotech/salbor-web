import React from 'react';

export default function ReporteVuelos({ orden, vuelos }) {
  if (!vuelos || vuelos.length === 0) {
    return <div className="card"><div className="empty">Esta orden todavía no tiene vuelos registrados.</div></div>;
  }
  const totalDosis = vuelos.reduce((s, v) => s + Number(v.dosis_l_ha || 0), 0).toFixed(1);
  const fecha = new Date().toLocaleDateString('es-EC', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="report">
      <div className="report-head">
        <div className="cliente">{orden.cliente}</div>
        <div className="meta">Finca: {orden.finca} · Informe generado el {fecha}</div>
      </div>
      <div className="report-body">
        <div className="kpis">
          <div className="kpi"><div className="num">{orden.hectareas_declaradas || 0}</div><div className="lbl">Hectáreas tratadas</div></div>
          <div className="kpi"><div className="num">{vuelos.length}</div><div className="lbl">Vuelos realizados</div></div>
          <div className="kpi"><div className="num">{totalDosis}</div><div className="lbl">Litros/ha total</div></div>
        </div>
        <table>
          <thead><tr><th>Producto</th><th>Dosis</th><th>Viento</th><th>Temp.</th><th>Piloto</th></tr></thead>
          <tbody>
            {vuelos.map((v) => (
              <tr key={v.id}>
                <td>{v.producto_nombre}</td><td>{v.dosis_l_ha} l/ha</td>
                <td>{v.viento_kmh || '—'} km/h</td><td>{v.temperatura_c || '—'}°C</td><td>{v.piloto_nombre}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="row" style={{ marginTop: '1rem' }}>
          <button className="btn outline" onClick={() => window.print()}>Descargar / imprimir PDF</button>
        </div>
      </div>
    </div>
  );
}
