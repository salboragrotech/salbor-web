import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      const usuario = await login(email, password);
      navigate(`/${usuario.rol}`);
    } catch (err) {
      setError(err.message || 'Correo o contraseña incorrectos');
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="login-screen">
      <div className="login-box">
        <h1>Salbor Agrotech</h1>
        <p className="sub">Ingresa con tu usuario y contraseña</p>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Correo</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="correo@salboragrotech.com" />
          </div>
          <div className="field">
            <label>Contraseña</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <button className="btn block" type="submit" disabled={cargando}>{cargando ? 'Entrando…' : 'Entrar'}</button>
        </form>
        {error && <div className="error-msg">{error}</div>}
        <p className="sub" style={{ marginTop: '.9rem', textAlign: 'center' }}>
          ¿Eres cliente nuevo? <Link className="link" to="/registro">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
}
