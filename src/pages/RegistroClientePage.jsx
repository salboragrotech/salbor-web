import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegistroClientePage() {
  const { registrarCliente } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ razon_social: '', ruc: '', finca: '', hectareas: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  function set(campo, valor) { setForm((f) => ({ ...f, [campo]: valor })); }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!form.razon_social || !form.finca || !form.email || !form.password) {
      setError('Completa razón social, finca, correo y contraseña.');
      return;
    }
    setCargando(true);
    try {
      await registrarCliente({ ...form, hectareas: form.hectareas ? parseFloat(form.hectareas) : null });
      navigate('/cliente');
    } catch (err) {
      setError(err.message || 'No se pudo completar el registro');
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="login-screen">
      <div className="login-box">
        <h1>Registro de cliente</h1>
        <p className="sub">Crea tu cuenta para solicitar fumigaciones</p>
        <form onSubmit={handleSubmit}>
          <div className="field"><label>Razón social</label><input value={form.razon_social} onChange={(e) => set('razon_social', e.target.value)} placeholder="Hacienda Los Álamos S.A." /></div>
          <div className="field"><label>RUC</label><input value={form.ruc} onChange={(e) => set('ruc', e.target.value)} placeholder="1790012345001" /></div>
          <div className="field"><label>Finca</label><input value={form.finca} onChange={(e) => set('finca', e.target.value)} placeholder="Finca San José" /></div>
          <div className="field"><label>Hectáreas</label><input type="number" value={form.hectareas} onChange={(e) => set('hectareas', e.target.value)} placeholder="12.5" /></div>
          <div className="field"><label>Correo</label><input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="correo@tuempresa.com" /></div>
          <div className="field"><label>Contraseña</label><input type="password" value={form.password} onChange={(e) => set('password', e.target.value)} placeholder="••••••••" /></div>
          <button className="btn block" type="submit" disabled={cargando}>{cargando ? 'Creando cuenta…' : 'Crear cuenta y entrar'}</button>
        </form>
        {error && <div className="error-msg">{error}</div>}
        <p className="sub" style={{ marginTop: '.9rem', textAlign: 'center' }}>
          <Link className="link" to="/login">Ya tengo cuenta, ingresar</Link>
        </p>
      </div>
    </div>
  );
}
