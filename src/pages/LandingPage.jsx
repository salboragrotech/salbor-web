import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LandingPage.css';

const SERVICIOS = [
  {
    titulo: 'Precisión georreferenciada',
    texto: 'Cada finca queda registrada con su ubicación real, así el área tratada siempre coincide con lo facturado.',
  },
  {
    titulo: 'Ahorro de tiempo y de agua',
    texto: 'La fumigación con drones cubre más hectáreas por hora que los métodos tradicionales, con menos desperdicio de producto.',
  },
  {
    titulo: 'Informe automático por cliente',
    texto: 'Después de cada vuelo recibes un informe con dosis aplicada, clima y hectáreas cubiertas — sin llamadas ni papeleo.',
  },
  {
    titulo: 'Tu propia plataforma',
    texto: 'Solicita tu fumigación, elige el día en el calendario y sigue el estado de tu pedido, todo desde tu cuenta.',
  },
];

const PASOS = [
  ['1', 'Solicita', 'Eliges tu finca y el día que necesitas la fumigación en un calendario con disponibilidad real.'],
  ['2', 'Confirmamos', 'Te asignamos piloto y dron, y te llega la confirmación (o una nueva fecha si hace falta reprogramar).'],
  ['3', 'Volamos', 'El piloto aplica el producto y registra cada detalle del vuelo en el momento, desde el campo.'],
  ['4', 'Recibes tu informe', 'Accedes al detalle completo de la aplicación apenas termina el trabajo.'],
];

export default function LandingPage() {
  const { usuario } = useAuth();

  return (
    <div className="landing">
      <header className="landing-header">
        <div className="landing-logo"><img src="/logo.jpeg" alt="Salbor Agrotech" /> Salbor Agrotech</div>
        <nav className="landing-nav">
          {usuario ? (
            <Link className="btn" to={`/${usuario.rol}`}>Ir a mi panel</Link>
          ) : (
            <>
              <Link className="btn outline" to="/login">Iniciar sesión</Link>
              <Link className="btn" to="/registro">Solicitar fumigación</Link>
            </>
          )}
        </nav>
      </header>

      <section className="landing-hero">
        <h1>Fumigación con drones, de principio a fin</h1>
        <p>
          Salbor Agrotech aplica agroquímicos con drones de precisión y te da control total del proceso:
          pides, aprobamos, volamos y recibes tu informe — todo desde una sola plataforma.
        </p>
        {!usuario && (
          <div className="landing-cta">
            <Link className="btn" to="/registro">Solicitar fumigación</Link>
            <Link className="btn outline" to="/login">Ya tengo cuenta</Link>
          </div>
        )}
      </section>

      <section className="landing-section">
        <h2>Por qué Salbor Agrotech</h2>
        <div className="landing-grid">
          {SERVICIOS.map((s) => (
            <div className="landing-card" key={s.titulo}>
              <h3>{s.titulo}</h3>
              <p>{s.texto}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="landing-section landing-section-alt">
        <h2>Cómo funciona</h2>
        <div className="landing-pasos">
          {PASOS.map(([n, titulo, texto]) => (
            <div className="landing-paso" key={n}>
              <div className="landing-paso-numero">{n}</div>
              <h3>{titulo}</h3>
              <p>{texto}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="landing-section landing-contacto">
        <h2>¿Listo para tu próxima fumigación?</h2>
        <p>Crea tu cuenta de cliente y programa tu primera solicitud en minutos.</p>
        <div className="landing-cta">
          <Link className="btn" to="/registro">Solicitar fumigación</Link>
        </div>
        <p className="landing-datos">
          salboragrotech@outlook.com · +593 96 983 6651
        </p>
      </section>

      <footer className="landing-footer">
        © {new Date().getFullYear()} Salbor Agrotech — Control operativo y administrativo de fumigación con drones
      </footer>
    </div>
  );
}
