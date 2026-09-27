import React, { useState } from 'react';

const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

function formatoISO(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function CalendarioDisponibilidad({ fechasOcupadas, fechaSeleccionada, onSeleccionar, mesInicial }) {
  const inicio = mesInicial ? new Date(mesInicial) : new Date();
  const [ano, setAno] = useState(inicio.getFullYear());
  const [mes, setMes] = useState(inicio.getMonth());

  function cambiarMes(delta) {
    let m = mes + delta, a = ano;
    if (m < 0) { m = 11; a--; }
    if (m > 11) { m = 0; a++; }
    setMes(m); setAno(a);
  }

  const hoy = new Date(); hoy.setHours(0, 0, 0, 0);
  const ocupadas = new Set(fechasOcupadas || []);
  const primerDia = new Date(ano, mes, 1);
  const diasEnMes = new Date(ano, mes + 1, 0).getDate();
  const offset = primerDia.getDay();

  const celdas = [];
  for (let i = 0; i < offset; i++) celdas.push(null);
  for (let d = 1; d <= diasEnMes; d++) celdas.push(d);

  return (
    <div>
      <div className="cal-head">
        <button type="button" className="btn outline small" onClick={() => cambiarMes(-1)}>‹</button>
        <span style={{ fontWeight: 600, fontSize: '.85rem' }}>{MESES[mes]} {ano}</span>
        <button type="button" className="btn outline small" onClick={() => cambiarMes(1)}>›</button>
      </div>
      <div className="cal-grid">
        {['D','L','M','M','J','V','S'].map((d, i) => <div className="diasem" key={i}>{d}</div>)}
        {celdas.map((d, i) => {
          if (d === null) return <button className="vacio" disabled key={`v${i}`} />;
          const fechaObj = new Date(ano, mes, d);
          const fechaStr = formatoISO(fechaObj);
          let clase = '';
          let disabled = false;
          if (fechaObj < hoy) { clase = 'pasado'; disabled = true; }
          else if (ocupadas.has(fechaStr)) { clase = 'ocupado'; disabled = true; }
          else if (fechaStr === fechaSeleccionada) { clase = 'elegido'; }
          return (
            <button key={fechaStr} className={clase} disabled={disabled} onClick={() => onSeleccionar(fechaStr)}>
              {d}
            </button>
          );
        })}
      </div>
      <div className="cal-leyenda">
        <span><i className="dot libre" /> Disponible</span>
        <span><i className="dot ocupado" /> Ya programado</span>
        <span><i className="dot elegido" /> Tu elección</span>
      </div>
    </div>
  );
}
