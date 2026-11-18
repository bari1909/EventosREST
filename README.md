# Práctica 1 - API REST de eventos

API REST hecha con Express y Mongoose para gestionar eventos, sus entradas y los recintos donde se celebran.

Las URLs de la aplicación desplegada en Render y del repositorio de GitHub están en el fichero **urls.txt**.

## Estructura

- `index.js`: servidor principal (conexión a la BD, Express y enrutadores)
- `models/evento.js`: esquema de eventos con el subesquema de entradas
- `models/recinto.js`: esquema de recintos
- `routes/recintos.js`: endpoints de `/recintos`
- `routes/eventos.js`: endpoints de `/eventos` y de las entradas
- `capturas/`: capturas de las pruebas hechas contra la aplicación en Render

## Cómo ejecutarlo

```
npm install
npm start
```

En local se conecta a `mongodb://127.0.0.1:27017/eventos` y escucha en el puerto 8080.
En Render la URL de MongoDB Atlas se pasa con la variable de entorno `MONGODB_URI`.
