# EventosREST – Práctica 1 (Despliegue de Aplicaciones Web)

API REST con Express + Mongoose para gestionar eventos, sus entradas y recintos.

## Estructura

```
EventosREST/
├── index.js            servidor principal
├── models/
│   ├── evento.js       esquema de eventos + subesquema de entradas (modelo "eventos")
│   └── recinto.js      esquema de recintos (modelo "recintos")
└── routes/
    ├── eventos.js      endpoints /eventos y /eventos/entradas
    └── recintos.js     endpoints /recintos
```

- Módulos: CommonJS (`require` / `module.exports`) en todo el proyecto.
- Endpoints: `async/await` con `try/catch` en todos.
- Respuestas: `{ ok: true, resultado: ... }` o `{ ok: false, error: "..." }`.

## Ejecución en local

```bash
npm install
npm start
```

Por defecto conecta a `mongodb://127.0.0.1:27017/eventos` y escucha en el puerto 8080.
Se puede cambiar con las variables de entorno `MONGODB_URI` y `PORT`.

## Despliegue

### 1. MongoDB Atlas
1. Crear un cluster gratuito (M0) en https://cloud.mongodb.com.
2. *Database Access*: crear un usuario con contraseña.
3. *Network Access*: añadir `0.0.0.0/0` (Render no tiene IP fija).
4. *Connect → Drivers*: copiar la URL y añadir el nombre de la BD antes del `?`:
   `mongodb+srv://USUARIO:PASSWORD@cluster0.xxxxx.mongodb.net/eventos?retryWrites=true&w=majority`

### 2. GitHub
Subir el proyecto a un repositorio (el `.gitignore` excluye `node_modules`).

### 3. Render
1. *New → Web Service*, conectar el repositorio.
2. Build command: `npm install` · Start command: `npm start`.
3. *Environment*: añadir `MONGODB_URI` con la URL de Atlas (no hace falta `PORT`, Render la pone).
4. Desplegar y probar, por ejemplo, `https://xxxxx.onrender.com/recintos`.

## Ejemplos de peticiones

POST /recintos
```json
{ "nombre": "Palau Sant Jordi", "direccion": "Passeig Olímpic 5-7", "localidad": "Barcelona", "aforoMaximo": 17000 }
```

POST /eventos
```json
{
  "nombre": "Summer Party 2027",
  "fecha": "2027-07-01",
  "recinto": "<id del recinto>",
  "entradas": [
    { "tipo": "VIP", "precio": 80, "disponibles": 10 },
    { "tipo": "General", "precio": 30, "disponibles": 500 }
  ]
}
```

PUT /eventos/entradas/<idEvento>/VIP/5 → resta 5 entradas VIP.
