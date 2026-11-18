const express = require('express');

let Evento = require(__dirname + '/../models/evento.js');
let Recinto = require(__dirname + '/../models/recinto.js');

let router = express.Router();

// GET /eventos: listado de todos los eventos (con su recinto)
router.get('/', async (req, res) => {
    try {
        let resultado = await Evento.find().populate('recinto');
        if (resultado.length > 0)
            res.status(200).send({ ok: true, resultado: resultado });
        else
            res.status(500).send({ ok: false, error: "No se han encontrado eventos" });
    } catch (error) {
        res.status(500).send({ ok: false, error: "No se han encontrado eventos" });
    }
});

// GET /eventos/localidad/:nombre: eventos futuros en una localidad
router.get('/localidad/:nombre', async (req, res) => {
    try {
        // 1. Buscamos los recintos de esa localidad
        let recintos = await Recinto.find({ localidad: req.params.nombre });
        let idsRecintos = recintos.map(r => r._id);
        // 2. Buscamos los eventos de esos recintos cuya fecha no haya pasado
        let resultado = await Evento.find({
            recinto: { $in: idsRecintos },
            fecha: { $gte: new Date() }
        }).populate('recinto');
        if (resultado.length > 0)
            res.status(200).send({ ok: true, resultado: resultado });
        else
            res.status(404).send({ ok: false, error: "No se han encontrado eventos" });
    } catch (error) {
        res.status(404).send({ ok: false, error: "No se han encontrado eventos" });
    }
});

// GET /eventos/entradas/:idEvento/:tipoEntrada: precio y disponibles de un tipo de entrada
router.get('/entradas/:idEvento/:tipoEntrada', async (req, res) => {
    try {
        let evento = await Evento.findById(req.params.idEvento);
        let entrada = evento.entradas.find(e => e.tipo === req.params.tipoEntrada);
        if (entrada)
            res.status(200).send({ ok: true, resultado: {
                precio: entrada.precio,
                disponibles: entrada.disponibles
            }});
        else
            res.status(404).send({ ok: false,
                error: "Error obteniendo datos de entrada para evento " + req.params.idEvento });
    } catch (error) {
        // Si el evento no existe, evento es null y salta aquí
        res.status(404).send({ ok: false,
            error: "Error obteniendo datos de entrada para evento " + req.params.idEvento });
    }
});

// PUT /eventos/entradas/:idEvento/:tipoEntrada/:cantidad: restar entradas disponibles
router.put('/entradas/:idEvento/:tipoEntrada/:cantidad', async (req, res) => {
    try {
        let cantidad = Number(req.params.cantidad);
        let evento = await Evento.findById(req.params.idEvento);
        let entrada = evento.entradas.find(e => e.tipo === req.params.tipoEntrada);
        if (entrada && Number.isInteger(cantidad) && cantidad > 0 &&
            entrada.disponibles >= cantidad) {
            entrada.disponibles -= cantidad;
            await evento.save();
            let resultado = await Evento.findById(evento._id).populate('recinto');
            res.status(200).send({ ok: true, resultado: resultado });
        } else {
            res.status(404).send({ ok: false,
                error: "Error actualizando entradas del evento " + req.params.idEvento });
        }
    } catch (error) {
        res.status(404).send({ ok: false,
            error: "Error actualizando entradas del evento " + req.params.idEvento });
    }
});

// GET /eventos/:id: evento con el id indicado
router.get('/:id', async (req, res) => {
    try {
        let resultado = await Evento.findById(req.params.id).populate('recinto');
        if (resultado)
            res.status(200).send({ ok: true, resultado: resultado });
        else
            res.status(404).send({ ok: false,
                error: "Evento " + req.params.id + " no encontrado" });
    } catch (error) {
        res.status(404).send({ ok: false,
            error: "Evento " + req.params.id + " no encontrado" });
    }
});

// POST /eventos: añadir un evento
router.post('/', async (req, res) => {
    try {
        let nuevoEvento = new Evento({
            nombre: req.body.nombre,
            fecha: req.body.fecha,
            entradas: req.body.entradas,
            recinto: req.body.recinto
        });
        let resultado = await nuevoEvento.save();
        res.status(201).send({ ok: true, resultado: resultado });
    } catch (error) {
        res.status(500).send({ ok: false, error: "Error añadiendo evento" });
    }
});

// PUT /eventos/:id: actualizar un evento
router.put('/:id', async (req, res) => {
    try {
        let resultado = await Evento.findByIdAndUpdate(req.params.id, {
            $set: {
                nombre: req.body.nombre,
                fecha: req.body.fecha,
                entradas: req.body.entradas,
                recinto: req.body.recinto
            }
        }, { returnDocument: 'after', runValidators: true }).populate('recinto');
        if (resultado)
            res.status(200).send({ ok: true, resultado: resultado });
        else
            res.status(404).send({ ok: false,
                error: "Error actualizando evento " + req.params.id });
    } catch (error) {
        res.status(404).send({ ok: false,
            error: "Error actualizando evento " + req.params.id });
    }
});

// DELETE /eventos/:id: eliminar un evento
router.delete('/:id', async (req, res) => {
    try {
        let resultado = await Evento.findByIdAndDelete(req.params.id);
        if (resultado)
            res.status(200).send({ ok: true, resultado: resultado });
        else
            res.status(404).send({ ok: false,
                error: "Error eliminando evento " + req.params.id });
    } catch (error) {
        res.status(404).send({ ok: false,
            error: "Error eliminando evento " + req.params.id });
    }
});

module.exports = router;
