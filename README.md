# Keys

Keys es una aplicación web para consultar y administrar las llaves de una institución. Permite ver qué llaves están disponibles, registrar retiros y devoluciones, administrar al personal autorizado y consultar el historial de movimientos.

La interfaz está en español. La pantalla pública de llaves se puede consultar sin iniciar sesión; las secciones administrativas usan una sesión con token JWT almacenado en una cookie HTTP-only.

## Funcionalidades

- **Tablero público (`/`)**: muestra las llaves y su estado, permite buscar por código, nombre o ubicación, y filtrar por disponibilidad. Al abrir una llave se muestra su detalle y se puede registrar un retiro o una devolución.
- **Acceso (`/login`)**: autentica a un usuario administrativo.
- **Tablero administrativo (`/admin`)**: presenta el resumen de llaves y permite abrir el detalle de cada una.
- **Personal (`/admin/personal`)**: permite consultar, buscar, crear, editar, activar y desactivar personas.
- **Historial (`/admin/historial`)**: lista retiros y devoluciones registrados.

Al registrar un movimiento, la API valida el estado de la llave y que la persona esté activa. Inserta el movimiento y actualiza el estado de la llave dentro de una transacción de MySQL.

## Tecnologías

- **Frontend:** React, TypeScript, Vite, React Router, Bootstrap y Bootstrap Icons.
- **Backend:** Node.js, TypeScript y Express.
- **Base de datos:** MySQL, accedida mediante `mysql2`.
- **Autenticación:** JWT en cookie HTTP-only; bcrypt para comparar hashes de contraseñas.

## Estructura del proyecto

```text
.
├── backend/
│   └── src/
│       ├── config/          # Pool de conexiones MySQL
│       ├── middleware/      # Autenticación
│       ├── routes/          # API de autenticación, llaves, personas y movimientos
│       └── server.ts        # Aplicación Express y montaje de rutas
├── frontend/
│   ├── public/              # Archivos estáticos
│   └── src/
│       ├── components/      # Componentes reutilizables de interfaz
│       ├── hooks/           # Hooks, incluido el tiempo transcurrido
│       ├── pages/           # Pantallas y rutas
│       ├── services/        # Llamadas HTTP a la API
│       ├── types/           # Tipos de llaves, personas y movimientos
│       ├── App.tsx          # Rutas del frontend
│       └── index.css        # Estilos globales
└── keys.sql                 # Exportación SQL de ejemplo
```

Las cuatro tablas principales de MySQL son `llaves`, `personas`, `movimientos` y `usuarios`. Los movimientos guardan el tipo de operación, la llave, la persona y la fecha y hora.

## Requisitos

- Node.js y npm compatibles con las versiones de Vite y TypeScript indicadas en `frontend/package.json`.
- MySQL compatible con el archivo SQL (el dump utiliza la intercalación `utf8mb4_0900_ai_ci`, disponible en MySQL 8).
- Una base de datos inicializada con las tablas que utiliza la API.

## Preparar la base de datos local

El archivo [`keys.sql`](./keys.sql) es un dump que contiene estructura **y datos de ejemplo**. Revisá su contenido antes de importarlo: incluye datos personales de muestra y un hash de contraseña de una cuenta. No lo uses como una base de producción ni publiques datos reales en el repositorio.

Por ejemplo, después de crear una base local llamada `keys`:

```bash
mysql -u root -p keys < keys.sql
```

Si el dump se importa en una base que ya contiene tablas o datos, primero comprobá qué se va a reemplazar para evitar perder información.

## Ejecutar en desarrollo

Abrí una terminal para el backend y otra para el frontend.

### 1. Configurar el backend

Creá `backend/.env` con los datos de tu MySQL local:

```dotenv
DB_HOST=localhost
DB_USER=tu_usuario_mysql
DB_PASSWORD=tu_contraseña_mysql
DB_NAME=keys
DB_PORT=3306
JWT_SECRET=reemplazar_por_un_secreto_largo_y_aleatorio
```

No subas `backend/.env` a Git. El `.gitignore` de backend ya excluye los archivos `.env`.

Después, instalá dependencias y ejecutá el servidor de desarrollo:

```bash
cd backend
npm ci
npm run dev
```

La API escucha en `http://localhost:3000`. La ruta `/db-test` permite comprobar la conexión con MySQL durante el desarrollo.

### 2. Ejecutar el frontend

En otra terminal:

```bash
cd frontend
npm ci
npm run dev
```

Vite normalmente sirve la aplicación en `http://localhost:5173`. El frontend llama a la API en `http://localhost:3000/api`; CORS está configurado para ese origen local.

## Rutas principales de la API

| Método | Ruta | Uso |
|---|---|---|
| `POST` | `/api/auth/login` | Iniciar sesión y establecer la cookie de autenticación |
| `GET` | `/api/auth/me` | Comprobar la sesión actual |
| `POST` | `/api/auth/logout` | Cerrar sesión |
| `GET` | `/api/llaves` | Listar llaves y su estado actual |
| `GET` | `/api/llaves/:id` | Consultar una llave y sus movimientos del día |
| `GET` | `/api/personas` | Listar personal (requiere sesión) |
| `GET` | `/api/personas/activas` | Listar personas activas |
| `POST` | `/api/personas` | Crear una persona (requiere sesión) |
| `PUT` | `/api/personas/:id` | Modificar una persona (requiere sesión) |
| `PATCH` | `/api/personas/:id/estado` | Activar o desactivar una persona (requiere sesión) |
| `GET` | `/api/movimientos` | Consultar el historial de movimientos |
| `POST` | `/api/movimientos` | Registrar un retiro o una devolución |

## Comandos del frontend

Desde `frontend/`:

```bash
npm run dev      # Servidor de desarrollo de Vite
npm run build    # Comprobación TypeScript y compilación de producción
npm run preview  # Servir localmente la compilación de Vite
npm run lint     # Ejecutar ESLint
```

El backend dispone actualmente del comando `npm run dev` para desarrollo. El proyecto aún no define en `backend/package.json` un flujo de compilación y arranque de producción.

## Configuración de producción

La configuración actual es de desarrollo local: la API tiene el puerto `3000` fijado en el código, CORS permite `http://localhost:5173`, y los servicios del frontend usan `http://localhost:3000/api`. Antes de publicar hay que adaptar esas direcciones, definir un proceso de producción para el backend y configurar HTTPS y la cookie segura. También hay que revisar qué endpoints pueden ser públicos: actualmente la API permite consultar llaves y registrar movimientos sin una sesión administrativa.

Para un despliegue, se recomienda servir el frontend y la API bajo el mismo dominio mediante un proxy inverso y usar secretos y credenciales exclusivos del entorno de producción. No reutilices datos, cuentas ni credenciales de desarrollo.
