# Web — Salbor Agrotech

Frontend real (React + Vite) para las tres plataformas de Salbor Agrotech —
administrador, piloto y cliente — conectado a la API por HTTP, sin datos en
memoria: todo lo que ves aquí vive en la base de datos.

## Requisitos

- Node.js 18+
- La API de Salbor Agrotech corriendo (ver `salbor-api/README.md`)

## Puesta en marcha

```bash
npm install
cp .env.example .env
# ajusta VITE_API_URL si tu API no corre en http://localhost:3000
npm run dev
```

Abre `http://localhost:5173`.

## Primer uso: no hay pantalla para crear el primer administrador

Por seguridad, no existe un endpoint público para crear un usuario `admin` — si
lo hubiera, cualquiera podría crearse uno. La primera vez, créalo directo en la
base de datos:

```sql
-- Genera el hash de tu contraseña con bcrypt (por ejemplo, con Node):
-- node -e "console.log(require('bcryptjs').hashSync('tu-password', 10))"

INSERT INTO usuarios (nombre, email, password_hash, rol)
VALUES ('Administrador', 'admin@salboragrotech.com', '<pega aquí el hash>', 'admin');
```

Con ese usuario ya puedes entrar y, desde "Usuarios", crear más administradores,
pilotos (vinculados a un piloto ya dado de alta en "Pilotos y drones") y clientes.
Los clientes también pueden crear su propia cuenta desde "Regístrate aquí" en la
pantalla de login, sin que el admin tenga que hacerlo por ellos.

## Estructura

```
salbor-web/
├── src/
│   ├── api/              ← un archivo por recurso (clientes, ordenes, vuelos...)
│   ├── context/AuthContext.jsx   ← sesión: login, registro, logout, persistencia
│   ├── components/       ← Layout, calendario de disponibilidad, informe, guardia de rutas
│   ├── pages/
│   │   ├── admin/        ← Clientes, Flota, Solicitudes, Programación, Órdenes, Vuelo, Informe, Usuarios
│   │   ├── piloto/       ← Mi agenda, Registrar vuelo
│   │   └── cliente/      ← Solicitar fumigación, Mis informes
│   └── App.jsx           ← rutas, protegidas por rol
```

## Cómo se reparte el acceso por rol

Cada rol entra a una parte distinta de la app (`/admin/...`, `/piloto/...`,
`/cliente/...`) y `ProtectedRoute` impide que alguien entre a una sección que no
le corresponde por URL, aunque la escriba a mano — pero la seguridad real está
en la API (ver `salbor-api/README.md`): el frontend solo oculta lo que el
backend de todas formas rechazaría.

## Desplegar a producción

1. Sube este proyecto a un repositorio de GitHub.
2. Conéctalo a **Vercel** o **Netlify** (ambos tienen plan gratuito).
3. Configura la variable de entorno `VITE_API_URL` en el panel del servicio,
   apuntando a la URL pública de tu API ya desplegada.
4. Cada servicio te da una URL propia (ej. `salbor-agrotech.vercel.app`); si
   compraste un dominio, lo conectas desde el panel del servicio.

## Qué falta / limitaciones de este punto de partida

- El módulo de fincas con polígono geográfico (mapa) no tiene todavía una
  pantalla para dibujarlo — se puede crear la finca sin polígono y agregarlo
  después directo en la base, o sumar un mapa (Leaflet) más adelante.
- El historial de mantenimiento de drones (que sí existe en el prototipo de
  demostración) no tiene aún tabla ni endpoint en la API — se puede agregar
  cuando haga falta.
- No hay una pantalla para que el cliente edite o cancele una solicitud
  pendiente (si la quieres, el patrón ya existe: se agregaría un botón junto a
  cada solicitud en `SolicitarPage.jsx` similar al del prototipo).
